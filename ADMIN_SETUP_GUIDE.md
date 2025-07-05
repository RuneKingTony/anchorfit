# Admin Setup Guide - Anchor Fit

## ✅ Admin Dashboard is Ready!

Your admin dashboard has been successfully migrated and configured with proper authentication.

## 🔑 Admin Login Credentials

**Email:** `admin@aft.ng`  
**Password:** `admin123`

## 🎯 How to Access Admin Features

### 1. **Access the Admin Dashboard**
- Visit: `your-app-url/admin`
- Enter the admin credentials above
- You'll be logged in with a secure JWT token

### 2. **View All Orders**
- **Tab:** 📦 Orders
- **Features:** View all customer orders with details
- **Info:** Customer contact, items, pricing, status

### 3. **Create Promo Codes**
- **Tab:** 🎫 Promo Codes
- **Features:** Generate unlimited discount codes
- **Options:** 
  - Custom discount percentage (1-99%)
  - Usage limits (optional)
  - Expiration dates (optional)

### 4. **Monitor Stats**
- **Tab:** 📊 Overview
- **Metrics:** Total orders, revenue, pending/completed status
- **Charts:** Real-time business analytics

## 🎉 Pre-loaded Test Promo Codes

These codes are ready for immediate use:

- **WELCOME10** → 10% discount (100 uses available)
- **SAVE20** → 20% discount (50 uses available)
- **FREESHIP** → 15% discount (unlimited uses)

*All codes expire December 31, 2025*

## 🔧 Technical Details

### Authentication System
- **Method:** JWT tokens with 7-day expiration
- **Security:** Bcrypt password hashing
- **Storage:** Local storage with automatic session management

### Database Integration
- **Database:** PostgreSQL with Drizzle ORM
- **Tables:** Full migration completed
- **Relationships:** Orders linked to user profiles

### API Endpoints
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/orders` - Fetch all orders
- `POST /api/admin/generate-promo` - Create promo codes

## 🚀 Ready for Production

Your admin dashboard is fully functional and secure. You can:
- Create unlimited promo codes
- Track all customer orders
- Monitor business performance
- Manage your e-commerce operations

**Important:** Change the admin password for production use by creating a new admin user with your preferred credentials.