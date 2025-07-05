import { pgTable, text, serial, integer, boolean, uuid, timestamp, numeric, jsonb, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Auth Users table (for authentication)
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  email_verified: boolean("email_verified").default(false).notNull(),
  is_admin: boolean("is_admin").default(false).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// User Profiles table (extended user information)
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  full_name: text("full_name"),
  phone: text("phone"),
  instagram_username: text("instagram_username"),
  phone_verified: boolean("phone_verified").default(false).notNull(),
  google_id: text("google_id").unique(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Orders table
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => profiles.id).notNull(),
  total_amount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  discount_amount: numeric("discount_amount", { precision: 10, scale: 2 }).default('0'),
  discount_type: text("discount_type"), // 'promo_code', 'first_order'
  status: text("status").default('pending'), // 'pending', 'completed', 'cancelled', 'payment_failed'
  paystack_reference: text("paystack_reference"),
  items: jsonb("items").notNull(),
  customer_details: jsonb("customer_details").notNull(),
  tracking_number: text("tracking_number"),
  shipping_carrier: text("shipping_carrier"),
  estimated_delivery_date: date("estimated_delivery_date"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});



// Discount Codes table
export const discount_codes = pgTable("discount_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  discount_percentage: integer("discount_percentage").notNull(),
  usage_limit: integer("usage_limit"),
  used_count: integer("used_count").default(0),
  active: boolean("active").default(true),
  expires_at: timestamp("expires_at"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Email Verification Tokens table
export const email_verification_tokens = pgTable("email_verification_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => users.id).notNull(),
  token: text("token").notNull().unique(),
  expires_at: timestamp("expires_at").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Password Reset Tokens table
export const password_reset_tokens = pgTable("password_reset_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => users.id).notNull(),
  token: text("token").notNull().unique(),
  reset_code: text("reset_code").notNull(), // 6-digit code for email verification
  expires_at: timestamp("expires_at").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const profilesRelations = relations(profiles, ({ one, many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  profile: one(profiles, {
    fields: [orders.user_id],
    references: [profiles.id],
  }),
}));

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  email_verified: true,
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertDiscountCodeSchema = createInsertSchema(discount_codes).omit({
  id: true,
  created_at: true,
});

export const insertEmailVerificationTokenSchema = createInsertSchema(email_verification_tokens).omit({
  id: true,
  created_at: true,
});

export const insertPasswordResetTokenSchema = createInsertSchema(password_reset_tokens).omit({
  id: true,
  created_at: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type DiscountCode = typeof discount_codes.$inferSelect;
export type InsertDiscountCode = z.infer<typeof insertDiscountCodeSchema>;
export type EmailVerificationToken = typeof email_verification_tokens.$inferSelect;
export type InsertEmailVerificationToken = z.infer<typeof insertEmailVerificationTokenSchema>;
export type PasswordResetToken = typeof password_reset_tokens.$inferSelect;
export type InsertPasswordResetToken = z.infer<typeof insertPasswordResetTokenSchema>;
