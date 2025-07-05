import { 
  users, 
  profiles, 
  orders, 
  discount_codes,
  email_verification_tokens,
  password_reset_tokens,
  type User, 
  type InsertUser,
  type Profile,
  type InsertProfile,
  type Order,
  type InsertOrder,
  type DiscountCode,
  type InsertDiscountCode,
  type EmailVerificationToken,
  type InsertEmailVerificationToken,
  type PasswordResetToken,
  type InsertPasswordResetToken
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gt } from "drizzle-orm";
import bcrypt from "bcrypt";

export interface IStorage {
  // User management
  createUser(userData: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  verifyPassword(email: string, password: string): Promise<User | null>;
  verifyUserEmail(userId: string): Promise<void>;
  updateUserPassword(userId: string, newPassword: string): Promise<void>;
  
  // Email verification
  createEmailVerificationToken(tokenData: InsertEmailVerificationToken): Promise<EmailVerificationToken>;
  getEmailVerificationToken(token: string): Promise<EmailVerificationToken | undefined>;
  deleteEmailVerificationToken(token: string): Promise<void>;
  
  // Password reset
  createPasswordResetToken(tokenData: InsertPasswordResetToken): Promise<PasswordResetToken>;
  getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined>;
  verifyPasswordResetCode(email: string, code: string): Promise<PasswordResetToken | null>;
  deletePasswordResetToken(token: string): Promise<void>;
  
  // Profile management
  createProfile(profileData: InsertProfile): Promise<Profile>;
  getProfile(userId: string): Promise<Profile | undefined>;
  updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | undefined>;
  
  // Order management
  createOrder(orderData: InsertOrder): Promise<Order>;
  getOrdersByUserId(userId: string): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>;
  getOrderByReference(reference: string): Promise<Order | undefined>;
  updateOrderStatus(reference: string, status: string): Promise<void>;
  
  // Discount codes
  getDiscountCode(code: string): Promise<DiscountCode | undefined>;
  validateDiscountCode(code: string): Promise<{ valid: boolean; discount?: DiscountCode }>;
  createDiscountCode(discountData: InsertDiscountCode): Promise<DiscountCode>;
  

}

export class DatabaseStorage implements IStorage {
  
  // User management
  async createUser(userData: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        password: hashedPassword,
      })
      .returning();

    // Create a default profile for the new user
    await this.createProfile({
      email: user.email,
      full_name: '',
      phone: '',
      instagram_username: '',
      phone_verified: false
    });

    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user;
  }

  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  async verifyUserEmail(userId: string): Promise<void> {
    await db
      .update(users)
      .set({ email_verified: true })
      .where(eq(users.id, userId));
  }

  async updateUserPassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId));
  }

  // Email verification
  async createEmailVerificationToken(tokenData: InsertEmailVerificationToken): Promise<EmailVerificationToken> {
    const [token] = await db
      .insert(email_verification_tokens)
      .values(tokenData)
      .returning();
    return token;
  }

  async getEmailVerificationToken(token: string): Promise<EmailVerificationToken | undefined> {
    const [tokenData] = await db
      .select()
      .from(email_verification_tokens)
      .where(eq(email_verification_tokens.token, token))
      .limit(1);
    return tokenData;
  }

  async deleteEmailVerificationToken(token: string): Promise<void> {
    await db
      .delete(email_verification_tokens)
      .where(eq(email_verification_tokens.token, token));
  }

  // Password reset
  async createPasswordResetToken(tokenData: InsertPasswordResetToken): Promise<PasswordResetToken> {
    const [token] = await db
      .insert(password_reset_tokens)
      .values(tokenData)
      .returning();
    return token;
  }

  async getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined> {
    const [tokenData] = await db
      .select()
      .from(password_reset_tokens)
      .where(eq(password_reset_tokens.token, token))
      .limit(1);
    return tokenData;
  }

  async verifyPasswordResetCode(email: string, code: string): Promise<PasswordResetToken | null> {
    // First get the user by email
    const user = await this.getUserByEmail(email);
    if (!user) {
      return null;
    }

    // Find the password reset token with the code
    const [tokenData] = await db
      .select()
      .from(password_reset_tokens)
      .where(
        and(
          eq(password_reset_tokens.user_id, user.id),
          eq(password_reset_tokens.reset_code, code),
          gt(password_reset_tokens.expires_at, new Date())
        )
      )
      .limit(1);
    
    return tokenData || null;
  }

  async deletePasswordResetToken(token: string): Promise<void> {
    await db
      .delete(password_reset_tokens)
      .where(eq(password_reset_tokens.token, token));
  }

  // Profile management
  async createProfile(profileData: InsertProfile): Promise<Profile> {
    const [profile] = await db
      .insert(profiles)
      .values({
        ...profileData,
        phone_verified: false,
      } as any)
      .returning();
    return profile;
  }

  async getProfile(userId: string): Promise<Profile | undefined> {
    // First get the user to find their email
    const user = await this.getUserById(userId);
    if (!user) return undefined;
    
    // Then find profile by email
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.email, user.email))
      .limit(1);
    return profile;
  }

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | undefined> {
    // First get the user to find their email
    const user = await this.getUserById(userId);
    if (!user) return undefined;
    
    // Then update profile by email
    const [profile] = await db
      .update(profiles)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(profiles.email, user.email))
      .returning();
    return profile;
  }

  // Order management
  async createOrder(orderData: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(orderData)
      .returning();
    return order;
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    // Get user's profile to find their orders
    const userProfile = await this.getProfile(userId);
    if (!userProfile) {
      return [];
    }
    
    return await db
      .select()
      .from(orders)
      .where(eq(orders.user_id, userProfile.id))
      .orderBy(orders.created_at);
  }

  async getAllOrders(): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .orderBy(orders.created_at);
  }

  async getOrderByReference(reference: string): Promise<Order | undefined> {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.paystack_reference, reference))
      .limit(1);
    return order;
  }

  async updateOrderStatus(reference: string, status: string): Promise<void> {
    await db
      .update(orders)
      .set({ status, updated_at: new Date() })
      .where(eq(orders.paystack_reference, reference));
  }

  // Discount codes
  async getDiscountCode(code: string): Promise<DiscountCode | undefined> {
    const [discountCode] = await db
      .select()
      .from(discount_codes)
      .where(eq(discount_codes.code, code))
      .limit(1);
    return discountCode;
  }

  async validateDiscountCode(code: string): Promise<{ valid: boolean; discount?: DiscountCode }> {
    const discountCode = await this.getDiscountCode(code);
    
    if (!discountCode) {
      return { valid: false };
    }

    const now = new Date();
    const isActive = discountCode.active ?? false;
    const isNotExpired = !discountCode.expires_at || new Date(discountCode.expires_at) > now;
    const isUnderLimit = !discountCode.usage_limit || (discountCode.used_count ?? 0) < discountCode.usage_limit;

    const valid = isActive && isNotExpired && isUnderLimit;
    
    return { valid, discount: valid ? discountCode : undefined };
  }

  async createDiscountCode(discountData: InsertDiscountCode): Promise<DiscountCode> {
    const [discountCode] = await db
      .insert(discount_codes)
      .values(discountData)
      .returning();
    return discountCode;
  }

  // Helper methods
  // Removed referral system - only using discount codes for marketing
}

export const storage = new DatabaseStorage();
