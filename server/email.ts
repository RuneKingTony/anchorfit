import { Resend } from 'resend';

function getResendInstance(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
}

interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerState: string;
  items: Array<{
    name: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  discount: number;
  promoCode?: string;
  shippingFee: number;
  total: number;
}

export async function sendOrderConfirmationToSeller(orderData: OrderEmailData): Promise<boolean> {
  try {
    const resend = getResendInstance();
    if (!resend) {
      console.error('RESEND_API_KEY not configured');
      return false;
    }

    const itemsHTML = orderData.items.map(item => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.size}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.color}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">₦${item.price.toLocaleString()}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">₦${(item.price * item.quantity).toLocaleString()}</td>
      </tr>
    `).join('');

    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; text-align: center; margin-bottom: 30px;">🛒 New Order Received - Anchor Fit</h2>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">Order Details</h3>
          <p><strong>Order ID:</strong> ${orderData.orderId}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>

        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">Customer Information</h3>
          <p><strong>Name:</strong> ${orderData.customerName}</p>
          <p><strong>Email:</strong> ${orderData.customerEmail}</p>
          <p><strong>Phone:</strong> ${orderData.customerPhone}</p>
          <p><strong>Address:</strong> ${orderData.customerAddress}</p>
          <p><strong>State:</strong> ${orderData.customerState}</p>
        </div>

        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
              <tr style="background-color: #333; color: white;">
                <th style="padding: 10px; border: 1px solid #ddd;">Product</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Size</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Color</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Qty</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Price</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
        </div>

        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">Order Summary</h3>
          <div style="border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 10px;">
            <p style="display: flex; justify-content: space-between; margin: 5px 0;">
              <span>Subtotal:</span>
              <span>₦${orderData.subtotal.toLocaleString()}</span>
            </p>
            ${orderData.discount > 0 ? `
              <p style="display: flex; justify-content: space-between; margin: 5px 0; color: #28a745;">
                <span>Discount (${orderData.promoCode || 'Applied'}):</span>
                <span>-₦${orderData.discount.toLocaleString()}</span>
              </p>
            ` : ''}
            <p style="display: flex; justify-content: space-between; margin: 5px 0;">
              <span>Shipping Fee:</span>
              <span>₦${orderData.shippingFee.toLocaleString()}</span>
            </p>
          </div>
          <p style="display: flex; justify-content: space-between; margin: 10px 0; font-size: 18px; font-weight: bold;">
            <span>Total:</span>
            <span>₦${orderData.total.toLocaleString()}</span>
          </p>
        </div>

        <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
          <p style="margin: 0; color: #856404;">
            <strong>Action Required:</strong> Please prepare this order for delivery. 
            The customer expects delivery within 3-7 business days.
          </p>
        </div>
      </div>
    `;

    // Send to seller (aftee.ng@gmail.com) for order notifications
    const result = await resend.emails.send({
      from: 'Anchor Fit <noreply@anchorfit.ng>',
      to: ['aftee.ng@gmail.com'],
      subject: `New Order #${orderData.orderId} - ₦${orderData.total.toLocaleString()}`,
      html: emailHTML,
    });

    console.log('Email sent successfully:', result);

    return true;
  } catch (error) {
    console.error('Failed to send order confirmation to seller:', error);
    return false;
  }
}

export async function sendDeliveryConfirmationToBuyer(orderData: OrderEmailData): Promise<boolean> {
  try {
    const resend = getResendInstance();
    if (!resend) {
      console.error('RESEND_API_KEY not configured');
      return false;
    }

    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; text-align: center; margin-bottom: 30px;">🎉 Order Confirmed - Anchor Fit</h2>
        
        <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #28a745;">
          <h3 style="color: #155724; margin-top: 0;">Thank you for your order!</h3>
          <p style="color: #155724; margin-bottom: 0;">
            Your order has been confirmed and is being prepared for delivery.
          </p>
        </div>

        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">Order Details</h3>
          <p><strong>Order ID:</strong> ${orderData.orderId}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>

        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">Delivery Information</h3>
          <p><strong>Delivery Address:</strong> ${orderData.customerAddress}, ${orderData.customerState}</p>
          <p><strong>Estimated Delivery:</strong> 3-7 business days</p>
          <p><strong>Phone:</strong> ${orderData.customerPhone}</p>
        </div>

        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">Order Summary</h3>
          <div style="border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 10px;">
            <p style="display: flex; justify-content: space-between; margin: 5px 0;">
              <span>Subtotal:</span>
              <span>₦${orderData.subtotal.toLocaleString()}</span>
            </p>
            ${orderData.discount > 0 ? `
              <p style="display: flex; justify-content: space-between; margin: 5px 0; color: #28a745;">
                <span>Discount (${orderData.promoCode || 'Applied'}):</span>
                <span>-₦${orderData.discount.toLocaleString()}</span>
              </p>
            ` : ''}
            <p style="display: flex; justify-content: space-between; margin: 5px 0;">
              <span>Shipping Fee:</span>
              <span>₦${orderData.shippingFee.toLocaleString()}</span>
            </p>
          </div>
          <p style="display: flex; justify-content: space-between; margin: 10px 0; font-size: 18px; font-weight: bold;">
            <span>Total:</span>
            <span>₦${orderData.total.toLocaleString()}</span>
          </p>
        </div>

        <div style="background-color: #cce5ff; padding: 15px; border-radius: 8px; border-left: 4px solid #007bff;">
          <p style="margin: 0; color: #004085;">
            <strong>What's Next?</strong> We'll prepare your order and deliver it within 3-7 business days. 
            You'll receive updates on your delivery status.
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #666;">
            Need help? Contact us at support@anchorfit.ng
          </p>
        </div>
      </div>
    `;

    const result = await resend.emails.send({
      from: 'Anchor Fit <noreply@anchorfit.ng>',
      to: [orderData.customerEmail],
      subject: `Order Confirmed #${orderData.orderId} - Delivery in 3-7 Days`,
      html: emailHTML,
    });

    console.log('Delivery confirmation email sent successfully:', result);

    return true;
  } catch (error) {
    console.error('Failed to send delivery confirmation to buyer:', error);
    return false;
  }
}

export async function sendEmailVerification(email: string, token: string): Promise<boolean> {
  try {
    const resend = getResendInstance();
    if (!resend) {
      console.error('RESEND_API_KEY not configured');
      return false;
    }

    console.log(`Sending email verification to: ${email}`);
    


    const baseUrl = process.env.REPLIT_DEV_DOMAIN 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : process.env.FRONTEND_URL || 'http://localhost:5000';
    const verificationUrl = `${baseUrl}/verify-email?token=${token}`;
    
    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; text-align: center; margin-bottom: 30px;">🔐 Verify Your Email - Anchor Fit</h2>
        
        <div style="background-color: #cce5ff; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #007bff;">
          <h3 style="color: #004085; margin-top: 0;">Welcome to Anchor Fit!</h3>
          <p style="color: #004085; margin-bottom: 0;">
            Thank you for signing up! Please verify your email address to complete your registration and start shopping.
          </p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Verify Email Address
          </a>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0; color: #666;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <p style="word-break: break-all; color: #007bff; margin: 10px 0;">${verificationUrl}</p>
        </div>
        
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
          <p style="margin: 0; color: #856404;">
            <strong>Security Notice:</strong> This verification link will expire in 24 hours for security reasons.
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #666;">
            If you didn't create an account with us, please ignore this email.
          </p>
          <p style="color: #666;">
            Need help? Contact us at support@anchorfit.ng
          </p>
        </div>
      </div>
    `;

    const result = await resend.emails.send({
      from: 'Anchor Fit <noreply@anchorfit.ng>',
      to: [email],
      subject: 'Verify Your Email - Anchor Fit',
      html: emailHTML,
    });

    console.log('Email verification sent successfully:', result);

    return true;
  } catch (error) {
    console.error('Failed to send email verification:', error);
    return false;
  }
}

export async function sendPasswordReset(email: string, resetCode: string): Promise<boolean> {
  try {
    const resend = getResendInstance();
    if (!resend) {
      console.error('RESEND_API_KEY not configured');
      return false;
    }

    // Validate email before sending
    if (!email || email.includes('example.com') || email.includes('test@')) {
      console.error('Invalid email address for password reset:', email);
      return false;
    }

    console.log(`Attempting to send password reset email to: ${email}`);



    console.log('Sending password reset code to:', email);
    
    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; text-align: center; margin-bottom: 30px;">🔑 Reset Your Password - Anchor Fit</h2>
        
        <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
          <h3 style="color: #856404; margin-top: 0;">Password Reset Request</h3>
          <p style="color: #856404; margin-bottom: 0;">
            You requested to reset your password for your Anchor Fit account. Use the verification code below to proceed.
          </p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border: 2px solid #dc3545;">
            <p style="margin: 0; color: #666; font-size: 14px;">Your Password Reset Code:</p>
            <p style="margin: 10px 0; font-size: 32px; font-weight: bold; color: #dc3545; letter-spacing: 5px;">${resetCode}</p>
            <p style="margin: 0; color: #666; font-size: 12px;">Enter this code on the password reset page</p>
          </div>
        </div>
        
        <div style="background-color: #f8d7da; padding: 15px; border-radius: 8px; border-left: 4px solid #dc3545;">
          <p style="margin: 0; color: #721c24;">
            <strong>Security Notice:</strong> This password reset code will expire in 1 hour for security reasons.
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #666;">
            If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
          </p>
          <p style="color: #666;">
            Need help? Contact us at support@anchorfit.ng
          </p>
        </div>
      </div>
    `;

    const result = await resend.emails.send({
      from: 'Anchor Fit <noreply@anchorfit.ng>',
      to: [email],
      subject: 'Reset Your Password - Anchor Fit',
      html: emailHTML,
    });

    console.log('Password reset email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return false;
  }
}