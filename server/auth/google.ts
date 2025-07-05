import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { storage } from '../storage';
import jwt from 'jsonwebtoken';

async function generateReferralCode(): Promise<string> {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const JWT_SECRET = process.env.SESSION_SECRET || "your-secret-key";

export function setupGoogleAuth() {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.warn('Google OAuth credentials not configured');
    return false;
  }

  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.REPLIT_DEV_DOMAIN 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}/api/auth/google/callback`
      : "/api/auth/google/callback"
  }, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      // Check if user exists with this email
      const existingUser = await storage.getUserByEmail(profile.emails?.[0]?.value || '');
      
      if (existingUser) {
        // User exists, ensure they have a profile
        const existingProfile = await storage.getProfile(existingUser.id);
        if (!existingProfile) {
          // Create profile for existing user
          await storage.createProfile({
            email: existingUser.email,
            full_name: profile.displayName || '',
            google_id: profile.id,
            phone_verified: false
          });
        }
        return done(null, existingUser);
      } else {
        // Create new user
        const newUser = await storage.createUser({
          email: profile.emails?.[0]?.value || '',
          password: '', // Empty password for OAuth users
          email_verified: true, // OAuth users are pre-verified
        });

        // Create profile
        await storage.createProfile({
          email: profile.emails?.[0]?.value || '',
          full_name: profile.displayName || '',
          google_id: profile.id,
          phone_verified: false
        });

        return done(null, newUser);
      }
    } catch (error) {
      console.error('Google OAuth error:', error);
      return done(error, undefined);
    }
  }));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUserById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  return true;
}

export function generateAuthToken(user: any) {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}