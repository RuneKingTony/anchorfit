# Google OAuth Setup Guide for Anchor Fit

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Create Project" or select an existing project
3. Give your project a name (e.g., "Anchor Fit Auth")
4. Click "Create"

## Step 2: Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"
4. Also enable "Google OAuth2 API"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen first:
   - Choose "External" for user type
   - Fill in the required fields:
     - App name: "Anchor Fit"
     - User support email: your email
     - Developer contact email: your email
   - Add scopes: `email`, `profile`, `openid`
   - Add test users (your email and any test emails)

## Step 4: Configure OAuth Client ID

1. Choose "Web application" as the application type
2. Give it a name (e.g., "Anchor Fit Web Client")
3. Add Authorized JavaScript origins:
   - `https://YOUR-REPLIT-URL.replit.app` (your actual Replit URL)
   - `http://localhost:5000` (for local development)
4. Add Authorized redirect URIs:
   - `https://YOUR-REPLIT-URL.replit.app/api/auth/google/callback`
   - `http://localhost:5000/api/auth/google/callback`
5. Click "Create"

## Step 5: Get Your Credentials

1. Copy the "Client ID" and "Client Secret"
2. You'll need these for the next step

## Step 6: Set Environment Variables in Replit

1. In your Replit environment, go to the "Secrets" tab
2. Add these environment variables:
   - `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth Client Secret
   - `GOOGLE_REDIRECT_URI`: `https://YOUR-REPLIT-URL.replit.app/auth/google/callback`

## Step 7: Update Your Domain

Replace `YOUR-REPLIT-URL.replit.app` with your actual Replit application URL.

## Important Notes

- Make sure your Replit URL is correct in both the Google Console and your environment variables
- The redirect URI must match exactly between Google Console and your environment variables
- If you change your Replit URL, you'll need to update both places
- Test with your email first before making the app public

## Common Issues and Solutions

### Issue: "redirect_uri_mismatch" error
**Solution**: Make sure the redirect URI in Google Console exactly matches the one in your environment variables

### Issue: "invalid_client" error
**Solution**: Double-check your Client ID and Client Secret are correct

### Issue: "access_denied" error
**Solution**: Make sure you've added your email as a test user in the OAuth consent screen

## Testing Your Setup

1. Go to your application
2. Click "Sign in with Google"
3. You should be redirected to Google's login page
4. After successful login, you should be redirected back to your app

## Order Confirmation Process

Your application has two types of order confirmations:

### 1. For Customers (Buyers)
- Sent automatically when an order is placed
- Contains order details, delivery timeline
- Shows payment confirmation
- Includes support contact information

### 2. For Sellers (Admin)
- Sent to admin@anchorfit.com
- Contains full order details for fulfillment
- Shows customer contact information
- Includes preparation instructions

### How to Confirm Orders (Admin Process)

1. **Access Admin Dashboard**:
   - Go to your app URL + `/admin`
   - Sign in with admin credentials
   - Must be marked as admin in database

2. **View Orders**:
   - All orders appear in the admin dashboard
   - Shows order status, customer details, items

3. **Update Order Status**:
   - Click on any order to view details
   - Change status from "pending" to "processing" to "shipped" to "delivered"
   - Customer gets notified of status changes

4. **Manual Order Confirmation**:
   - Use the admin dashboard to mark orders as "confirmed"
   - Send additional emails if needed through the dashboard

The system automatically handles most confirmations, but you can manually manage them through the admin interface.