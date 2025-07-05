# Resend Email Service Setup Guide

## What is Resend?
Resend is a modern email service that allows you to send transactional emails programmatically. It's used in your Anchor Fit application to send:
- Email verification for new users
- Password reset emails
- Order confirmations to customers
- Order notifications to sellers/admins

## Step 1: Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address
4. Complete your profile setup

## Step 2: Get Your API Key

1. Log into your Resend dashboard
2. Go to "API Keys" section
3. Click "Create API Key"
4. Give it a name like "Anchor Fit Production"
5. Copy the API key (starts with `re_...`)

## Step 3: Add API Key to Replit

1. In your Replit project, go to the "Secrets" tab
2. Add a new secret:
   - Key: `RESEND_API_KEY`
   - Value: Your API key from Resend (paste the full key)
3. Save the secret

## Step 4: Domain Setup (Optional but Recommended)

### For Professional Emails (Recommended)
1. In Resend dashboard, go to "Domains"
2. Click "Add Domain"
3. Enter your domain (e.g., anchorfit.com)
4. Add the DNS records to your domain provider
5. Wait for verification

### For Testing (Quick Start)
- Use the default `resend.dev` domain
- Your emails will come from `noreply@resend.dev`
- This works immediately but looks less professional

## Current Email Configuration in Your App

Your application is configured to send emails using these templates:

### 1. Email Verification
```javascript
// Sent when user signs up
sendEmailVerification(email, token)
```
- **From**: `Anchor Fit <noreply@resend.dev>`
- **Subject**: "Verify Your Email - Anchor Fit"
- **Content**: Professional verification link
- **Expires**: 24 hours

### 2. Password Reset
```javascript
// Sent when user requests password reset
sendPasswordReset(email, token)
```
- **From**: `Anchor Fit <noreply@resend.dev>`
- **Subject**: "Reset Your Password - Anchor Fit"
- **Content**: Secure reset link
- **Expires**: 1 hour

### 3. Order Confirmation (Customer)
```javascript
// Sent when customer places order
sendDeliveryConfirmationToBuyer(orderData)
```
- **From**: `Anchor Fit <orders@resend.dev>`
- **Subject**: "Order Confirmed #[ORDER_ID] - Delivery in 3-7 Days"
- **Content**: Order details, timeline, support info

### 4. Order Notification (Seller)
```javascript
// Sent to admin when order is placed
sendOrderConfirmationToSeller(orderData)
```
- **From**: `Anchor Fit <orders@resend.dev>`
- **To**: `admin@anchorfit.com`
- **Subject**: "New Order Alert #[ORDER_ID] - Action Required"
- **Content**: Full order details for fulfillment

## Email Flow Logic

### User Registration Flow
1. User fills signup form
2. Server creates user account (email_verified = false)
3. Server generates verification token
4. Server calls `sendEmailVerification(email, token)`
5. User clicks link in email
6. Server verifies token and sets email_verified = true
7. User can now login

### Password Reset Flow
1. User clicks "Forgot Password?"
2. User enters email address
3. Server generates reset token (expires in 1 hour)
4. Server calls `sendPasswordReset(email, token)`
5. User clicks link in email
6. User enters new password
7. Server updates password and deletes token

### Order Confirmation Flow
1. Customer completes payment
2. Server creates order record
3. Server calls `sendDeliveryConfirmationToBuyer(orderData)`
4. Server calls `sendOrderConfirmationToSeller(orderData)`
5. Both customer and admin receive emails

## Testing Your Email Setup

### Method 1: Use Your Application
1. Try signing up with your real email
2. Check if you receive verification email
3. Try password reset with your email
4. Check if you receive reset email

### Method 2: Check Logs
1. Watch the server console for email logs
2. Look for messages like:
   - "Sending password reset email to: [email]"
   - "Password reset email sent successfully"
   - "Failed to send password reset email"

### Method 3: Check Resend Dashboard
1. Log into Resend dashboard
2. Go to "Logs" section
3. See all sent emails and their status

## Common Issues and Solutions

### Issue: "RESEND_API_KEY not configured"
**Solution**: Make sure you've added the API key to Replit secrets

### Issue: "Failed to send email"
**Solution**: Check your API key is valid and account is in good standing

### Issue: "Emails not arriving"
**Solutions**:
- Check spam/junk folder
- Verify email address is correct
- Try different email provider
- Check Resend logs for delivery status

### Issue: "Domain not verified"
**Solution**: Either verify your domain or use resend.dev for testing

## Email Templates Customization

All email templates are in `server/email.ts`. You can customize:
- **Colors**: Change the style attributes
- **Logo**: Add your logo image URL
- **Content**: Modify the text and messaging
- **From Address**: Change after domain verification

## Production Recommendations

1. **Verify Your Domain**: Use your own domain instead of resend.dev
2. **Monitor Deliverability**: Check Resend analytics regularly
3. **Test Thoroughly**: Test all email flows before going live
4. **Set Up Webhooks**: Get delivery notifications (advanced)
5. **Consider Email Lists**: For marketing emails (separate from transactional)

## Troubleshooting Checklist

- [ ] API key is correctly added to Replit secrets
- [ ] Server is restarted after adding API key
- [ ] Email address is spelled correctly
- [ ] Check spam folder
- [ ] Verify Resend account is active
- [ ] Check server logs for error messages
- [ ] Test with different email providers

## Support

If you continue having issues:
1. Check the server console logs
2. Look at Resend dashboard logs
3. Try a different email address
4. Contact Resend support if needed

The email service is working correctly based on the server logs. If you're not receiving emails, the issue is likely with email delivery or your email provider's spam filters.