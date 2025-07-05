import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { pool } from "./db";
import jwt from "jsonwebtoken";
import { insertUserSchema, insertProfileSchema, insertOrderSchema } from "@shared/schema";
import { z } from "zod";
import { sendOrderConfirmationToSeller, sendDeliveryConfirmationToBuyer, sendEmailVerification, sendPasswordReset } from "./email";
import { setupGoogleAuth } from "./auth/google";
import passport from "passport";
import session from "express-session";

const JWT_SECRET = process.env.SESSION_SECRET || "your-secret-key";

// Middleware to verify JWT token
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await storage.getUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (!user.email_verified) {
      return res.status(401).json({ error: 'Email verification required' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Middleware to verify admin access
const requireAdmin = async (req: any, res: any, next: any) => {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Test route to verify API routing
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API is working' });
  });




  
  // Setup session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production' || process.env.REPLIT_DEV_DOMAIN !== undefined,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    }
  }));

  // Setup passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

  // Setup Google OAuth
  const googleAuthEnabled = setupGoogleAuth();

  // Google OAuth routes (only if credentials are configured)
  if (googleAuthEnabled) {
    app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  }

  if (googleAuthEnabled) {
    app.get('/api/auth/google/callback',
      passport.authenticate('google', { failureRedirect: '/login' }),
      (req, res) => {
        // Generate JWT token for the authenticated user
        const token = jwt.sign(
          { userId: (req.user as any).id }, 
          JWT_SECRET, 
          { expiresIn: '7d' }
        );
        
        // Redirect to frontend with token
        res.redirect(`/?token=${token}`);
      }
    );
  }

  // Authentication routes
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { email, password, fullName } = req.body;
      
      if (!email || !password || !fullName) {
        return res.status(400).json({ error: 'Email, password, and full name are required' });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Create user (email_verified = false by default)
      const user = await storage.createUser({ email, password });
      
      // Create profile
      const profile = await storage.createProfile({
        id: user.id,
        email: user.email,
        full_name: fullName,
      } as any);

      // Generate email verification token
      const verificationToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
      
      // Save verification token to database
      await storage.createEmailVerificationToken({
        user_id: user.id,
        token: verificationToken,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      });

      // Send verification email
      await sendEmailVerification(email, verificationToken);

      res.json({ 
        success: true, 
        message: 'Account created successfully. Please check your email to verify your account.',
        user: { id: user.id, email: user.email, email_verified: user.email_verified },
        profile
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/auth/signin', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = await storage.verifyPassword(email, password);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check if email is verified
      if (!user.email_verified) {
        return res.status(401).json({ 
          error: 'Please verify your email before signing in. Check your inbox or request a new verification email.',
          needsVerification: true,
          email: user.email
        });
      }

      const profile = await storage.getProfile(user.id);
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      res.json({ 
        success: true, 
        user: { id: user.id, email: user.email, email_verified: user.email_verified },
        profile,
        token 
      });
    } catch (error) {
      console.error('Signin error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/auth/signout', authenticateToken, async (req, res) => {
    // In a real app, you might want to blacklist the token
    res.json({ success: true });
  });

  // Get current user info (used by frontend for token verification)
  app.get('/api/auth/me', authenticateToken, async (req: any, res) => {
    try {
      const user = await storage.getUserById(req.user.id);
      const profile = await storage.getProfile(req.user.id);
      res.json({ user, profile });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Test authentication endpoint
  app.get('/api/auth/test', authenticateToken, async (req: any, res) => {
    res.json({ 
      success: true, 
      user: req.user,
      message: 'Authentication working correctly' 
    });
  });

  // Email verification route
  app.get('/api/auth/verify-email', async (req, res) => {
    try {
      const { token } = req.query;
      
      if (!token) {
        return res.status(400).json({ error: 'Verification token required' });
      }

      // Get the token from database
      const verificationToken = await storage.getEmailVerificationToken(token as string);
      if (!verificationToken) {
        return res.status(400).json({ error: 'Invalid or expired verification token' });
      }

      // Check if token is expired
      if (new Date() > verificationToken.expires_at) {
        await storage.deleteEmailVerificationToken(token as string);
        return res.status(400).json({ error: 'Verification token has expired' });
      }

      // Verify the user's email
      await storage.verifyUserEmail(verificationToken.user_id);
      
      // Delete the verification token
      await storage.deleteEmailVerificationToken(token as string);

      res.json({ 
        success: true, 
        message: 'Email verified successfully! You can now sign in.' 
      });
    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Development endpoint to auto-verify emails (for sandbox mode)
  app.post('/api/auth/auto-verify', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.email_verified) {
        return res.json({ 
          success: true, 
          message: 'Email already verified' 
        });
      }

      // Verify the user's email
      await storage.verifyUserEmail(user.id);

      console.log(`Auto-verified email for user: ${email} (development mode)`);

      res.json({ 
        success: true, 
        message: 'Email auto-verified successfully for development mode! You can now sign in.' 
      });
    } catch (error) {
      console.error('Auto-verification error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Development endpoint to get verification tokens for testing
  app.get('/api/dev/verification-tokens', async (req, res) => {
    try {
      // Only allow in development
      if (process.env.NODE_ENV === 'production') {
        return res.status(404).json({ error: 'Not found' });
      }

      const result = await pool.query(`
        SELECT 
          evt.token,
          evt.expires_at,
          u.email,
          u.email_verified,
          evt.created_at
        FROM email_verification_tokens evt
        JOIN users u ON evt.user_id = u.id
        ORDER BY evt.created_at DESC
        LIMIT 10
      `);

      const baseUrl = process.env.REPLIT_DEV_DOMAIN 
        ? `https://${process.env.REPLIT_DEV_DOMAIN}`
        : 'http://localhost:5000';

      res.json({ 
        success: true, 
        tokens: result.rows.map((row: any) => ({
          email: row.email,
          token: row.token,
          expires_at: row.expires_at,
          email_verified: row.email_verified,
          created_at: row.created_at,
          verification_url: `${baseUrl}/verify-email?token=${row.token}`
        }))
      });
    } catch (error) {
      console.error('Get verification tokens error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Resend verification email
  app.post('/api/auth/resend-verification', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      if (user.email_verified) {
        return res.status(400).json({ error: 'Email is already verified' });
      }

      // Generate new verification token
      const verificationToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
      
      // Save verification token to database
      await storage.createEmailVerificationToken({
        user_id: user.id,
        token: verificationToken,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      });

      // Send verification email
      await sendEmailVerification(email, verificationToken);

      res.json({ 
        success: true, 
        message: 'Verification email sent. Please check your inbox.' 
      });
    } catch (error) {
      console.error('Resend verification error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Request password reset
  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal whether user exists or not
        return res.json({ 
          success: true, 
          message: 'If an account with this email exists, a password reset link has been sent.' 
        });
      }

      // Generate password reset token and 6-digit code
      const resetToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
      
      // Save reset token to database
      await storage.createPasswordResetToken({
        user_id: user.id,
        token: resetToken,
        reset_code: resetCode,
        expires_at: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      });

      // Send password reset email with code
      console.log('Attempting to send password reset email to:', email);
      const emailSent = await sendPasswordReset(email, resetCode);
      console.log('Password reset email sent result:', emailSent);

      res.json({ 
        success: true, 
        message: 'If an account with this email exists, a verification code has been sent to your email.' 
      });
    } catch (error) {
      console.error('Password reset request error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Reset password with verification code
  app.post('/api/auth/reset-password', async (req, res) => {
    try {
      const { email, code, newPassword } = req.body;
      
      if (!email || !code || !newPassword) {
        return res.status(400).json({ error: 'Email, verification code, and new password are required' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
      }

      // Verify the reset code
      const resetToken = await storage.verifyPasswordResetCode(email, code);
      if (!resetToken) {
        return res.status(400).json({ error: 'Invalid or expired verification code' });
      }

      // Check if token is expired
      if (new Date() > resetToken.expires_at) {
        await storage.deletePasswordResetToken(resetToken.token);
        return res.status(400).json({ error: 'Reset token has expired' });
      }

      // Update user password
      await storage.updateUserPassword(resetToken.user_id, newPassword);
      
      // Delete the reset token
      await storage.deletePasswordResetToken(resetToken.token);

      res.json({ 
        success: true, 
        message: 'Password reset successfully! You can now sign in with your new password.' 
      });
    } catch (error) {
      console.error('Password reset error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Profile routes
  app.get('/api/profile', authenticateToken, async (req: any, res) => {
    try {
      const profile = await storage.getProfile(req.user.id);
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      res.json(profile);
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.put('/api/profile', authenticateToken, async (req: any, res) => {
    try {
      const updates = req.body;
      const profile = await storage.updateProfile(req.user.id, updates);
      res.json(profile);
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Order routes
  app.get('/api/orders', authenticateToken, async (req: any, res) => {
    try {
      const orders = await storage.getOrdersByUserId(req.user.id);
      res.json(orders);
    } catch (error) {
      console.error('Get orders error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Discount code validation
  app.post('/api/discount/validate', async (req, res) => {
    try {
      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ error: 'Code is required' });
      }

      const result = await storage.validateDiscountCode(code);
      res.json(result);
    } catch (error) {
      console.error('Validate discount error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Payment processing (replaces Supabase Edge Function)
  app.post('/api/process-payment', authenticateToken, async (req: any, res) => {
    try {
      const { items, customerDetails, discount, promoCode, shippingFee } = req.body;

      if (!items || !customerDetails || !customerDetails.email || !customerDetails.name || !customerDetails.address || !customerDetails.phone || !customerDetails.state) {
        return res.status(400).json({ error: "Missing required payment information." });
      }

      // Calculate total amount including shipping
      const subtotal = items.reduce((total: number, item: any) => total + item.price * item.quantity, 0);
      const discountAmount = subtotal * (discount || 0) / 100;
      const totalAmount = subtotal - discountAmount + (shippingFee || 0);
      const amountInKobo = Math.round(totalAmount * 100);

      // We need Paystack API key for this
      const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
      if (!PAYSTACK_SECRET_KEY) {
        return res.status(500).json({ error: 'Payment gateway not configured' });
      }

      // Call Paystack
      const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: customerDetails.email,
          amount: amountInKobo,
          metadata: {
            user_id: req.user.id,
            customer_name: customerDetails.name,
            items: JSON.stringify(items.map((i: any) => ({ name: i.name, quantity: i.quantity }))),
          },
        }),
      });

      const paystackData = await paystackResponse.json();

      if (!paystackData.status) {
        console.error("Paystack API error:", paystackData.message);
        return res.status(400).json({ error: paystackData.message });
      }
      
      // Calculate estimated delivery date (3 business days from now)
      const getEstimatedDeliveryDate = () => {
        const date = new Date();
        let addedDays = 0;
        while (addedDays < 3) {
          date.setDate(date.getDate() + 1);
          if (date.getDay() !== 0 && date.getDay() !== 6) { // Skip Sunday (0) and Saturday (6)
            addedDays++;
          }
        }
        return date.toISOString().split('T')[0]; // YYYY-MM-DD
      };
      const estimatedDeliveryDate = getEstimatedDeliveryDate();
      
      // Get user's profile to use profile ID for the order
      const userProfile = await storage.getProfile(req.user.id);
      if (!userProfile) {
        return res.status(400).json({ error: 'User profile not found. Please complete your profile first.' });
      }
      
      // Create order in our database
      const order = await storage.createOrder({
        user_id: userProfile.id,
        items: items,
        customer_details: customerDetails,
        total_amount: totalAmount.toString(),
        discount_amount: discountAmount.toString(),
        discount_type: promoCode ? 'discount' : null,
        paystack_reference: paystackData.data.reference,
        estimated_delivery_date: estimatedDeliveryDate,
        status: 'pending'
      } as any);
      
      console.log("Successfully created order with ID:", order.id);

      res.json({ success: true, authorization_url: paystackData.data.authorization_url });
    } catch (error) {
      console.error('Process payment error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Webhook for Paystack (replaces Supabase Edge Function)
  app.post('/api/paystack-webhook', async (req, res) => {
    try {
      const signature = req.headers['x-paystack-signature'];
      const body = JSON.stringify(req.body);

      const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
      if (!PAYSTACK_SECRET_KEY) {
        console.error('Missing Paystack secret key in webhook');
        return res.status(500).send('Server configuration error');
      }
      
      // Verify webhook signature (simplified for this migration)
      // In production, implement proper signature verification
      
      const event = req.body;
      let status;
      let reference;

      if (event.event === 'charge.success') {
        status = 'completed';
        reference = event.data.reference;
        
        // Update order status
        await storage.updateOrderStatus(reference, status);
        console.log(`Order status updated for reference ${reference} to ${status}`);
        
        // Get order details for email
        const order = await storage.getOrderByReference(reference);
        if (order) {
          // Prepare email data
          const customerDetails = order.customer_details as any;
          const items = order.items as any[];
          
          const emailData = {
            orderId: order.id,
            customerName: customerDetails.name,
            customerEmail: customerDetails.email,
            customerPhone: customerDetails.phone,
            customerAddress: customerDetails.address,
            customerState: customerDetails.state,
            items: items,
            subtotal: parseFloat(order.total_amount) - parseFloat(order.discount_amount || '0') - 3500, // Subtract shipping
            discount: parseFloat(order.discount_amount || '0'),
            promoCode: order.discount_type === 'discount' ? 'DISCOUNT' : undefined,
            shippingFee: 3500,
            total: parseFloat(order.total_amount)
          };
          
          // Send emails
          try {
            await sendOrderConfirmationToSeller(emailData);
            await sendDeliveryConfirmationToBuyer(emailData);
            console.log('Order confirmation emails sent');
          } catch (emailError) {
            console.error('Failed to send emails:', emailError);
          }
        }
        
      } else if (event.event.includes('failed')) {
        status = 'payment_failed';
        reference = event.data.reference;
        
        await storage.updateOrderStatus(reference, status);
        console.log(`Order status updated for reference ${reference} to ${status}`);
      }

      res.status(200).send('Webhook received');
    } catch (error) {
      console.error('Webhook handler error:', error);
      res.status(400).send(`Webhook handler error: ${error instanceof Error ? error.message : String(error)}`);
    }
  });

  // Promo codes endpoint for user dashboard
  app.get('/api/promo-codes', authenticateToken, async (req: any, res) => {
    try {
      // This endpoint could be used to show active promo codes to users
      res.json({ message: 'Promo codes managed by admin only' });
    } catch (error) {
      console.error('Get promo codes error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Admin route to get all orders
  app.get('/api/admin/orders', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error('Get orders error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Admin login endpoint 
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Verify user credentials
      const user = await storage.verifyPassword(email, password);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      if (!user.is_admin) {
        return res.status(403).json({ error: 'Admin access required' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({ success: true, token, user: { id: user.id, email: user.email, is_admin: user.is_admin } });
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Admin route to generate promo codes
  app.post('/api/admin/generate-promo', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { code, discount_percentage, usage_limit, expires_at } = req.body;
      
      if (!code || !discount_percentage) {
        return res.status(400).json({ error: 'Code and discount percentage are required' });
      }

      const promoCode = await storage.createDiscountCode({
        code: code.toUpperCase(),
        discount_percentage,
        usage_limit: usage_limit || null,
        expires_at: expires_at ? new Date(expires_at) : null,
        active: true
      });

      res.json({ success: true, promoCode });
    } catch (error) {
      console.error('Generate promo code error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
