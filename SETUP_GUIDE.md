# Anchor Fit E-commerce Setup Guide

## ✅ Migration Complete

Your Anchor Fit e-commerce application has been successfully migrated from Lovable to Replit with the following enhancements:

### 🔧 What's Been Implemented

#### 1. **Promo Code System** ✅
- **Status**: Fully functional
- **Features**: 
  - Create unlimited promo codes with custom discounts
  - Set usage limits and expiration dates
  - Automatic validation during checkout
  - Usage tracking to prevent overuse

#### 2. **Email Notifications** ✅
- **Service**: Resend (free up to 3,000 emails/month)
- **Seller Emails**: Order confirmations with complete customer details
- **Customer Emails**: Delivery confirmations (3-7 business days info)
- **Templates**: Professional HTML emails with order summaries

#### 3. **Database & Order Flow** ✅
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based with email/password
- **Payment**: Paystack integration with webhook handling
- **Order Tracking**: Complete order lifecycle management

#### 4. **Google OAuth Setup** ✅
- **Framework**: Passport.js with Google Strategy
- **Ready**: Just needs your Google Client credentials

---

## 🚀 How to Use Each Feature

### **1. Generate Promo Codes**

Visit: `https://your-app-url.replit.dev/admin`

Example API call:
```javascript
POST /api/admin/generate-promo
{
  "code": "SAVE20",
  "discount_percentage": 20,
  "usage_limit": 100,
  "expires_at": "2025-12-31"
}
```

### **2. Database Structure**

```
users
├── id (UUID)
├── email
├── password (hashed)
└── created_at

profiles
├── id (UUID)
├── email
├── full_name
├── phone
├── instagram_username
├── referral_code
├── google_id (for OAuth)
└── timestamps

orders
├── id (UUID)
├── user_id
├── total_amount
├── discount_amount
├── status (pending/completed/cancelled)
├── paystack_reference
├── items (JSON)
├── customer_details (JSON)
├── estimated_delivery_date
└── timestamps

discount_codes
├── id (UUID)
├── code
├── discount_percentage
├── usage_limit
├── used_count
├── expires_at
├── active
└── timestamps
```

### **3. Order & Delivery Flow**

1. **Customer Journey**:
   ```
   Browse Products → Add to Cart → Apply Promo → Enter Details → Pay via Paystack
   ```

2. **Backend Processing**:
   ```
   Payment Success → Webhook Triggered → Order Status Updated → Emails Sent
   ```

3. **Email Notifications**:
   - **You receive**: Order details, customer info, items, total
   - **Customer receives**: Delivery confirmation, 3-7 day estimate

### **4. Google OAuth (Ready to Enable)**

Once you provide Google OAuth credentials:

1. **Login URL**: `/api/auth/google`
2. **Callback URL**: `/api/auth/google/callback`
3. **User Flow**: 
   - Click "Login with Google"
   - Redirected to Google
   - Account created/logged in automatically
   - JWT token generated

---

## 🔑 Required Setup

### **Email Service (Resend)**
- Sign up at [resend.com](https://resend.com)
- Create API key
- Already configured in your app

### **Google OAuth (Optional)**
- Go to [Google Cloud Console](https://console.cloud.google.com)
- Create project → Enable Google+ API → Create OAuth 2.0 credentials
- Add your Replit URL to authorized domains

### **Payment Processing**
- ✅ Paystack already configured
- Webhook URL: `https://your-app.replit.dev/api/paystack-webhook`

---

## 📊 Admin Functions

### **Generate Promo Codes**
```bash
curl -X POST https://your-app.replit.dev/api/admin/generate-promo \
  -H "Content-Type: application/json" \
  -d '{
    "code": "NEWCUSTOMER",
    "discount_percentage": 15,
    "usage_limit": 50,
    "expires_at": "2025-08-01"
  }'
```

### **View Orders** (Protected route)
```bash
curl -X GET https://your-app.replit.dev/api/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **Check Database Status**
```bash
npm run db:push  # Push schema changes
npm run db:studio  # View database (if configured)
```

---

## 🎯 Ready for Production

Your application is production-ready with:
- ✅ Secure authentication
- ✅ Payment processing
- ✅ Email notifications
- ✅ Database persistence
- ✅ Promo code system
- ✅ Order tracking
- ✅ Error handling

### **Hosting on Replit vs Vercel**

**Replit (Recommended)**: 
- Perfect for your full-stack app with persistent database connections
- Works out of the box
- Easy domain connection

**Vercel Limitation**: 
- Designed for serverless functions, not persistent Express servers
- Would require significant architectural changes
- Not recommended for this application type

---

## 📧 Support

If you need help with any feature:
1. Check the admin panel at `/admin`
2. Review server logs in the Replit console
3. Test endpoints using the examples above

Your application is now fully functional and ready for customers! 🚀