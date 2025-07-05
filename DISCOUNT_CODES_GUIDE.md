# Discount Codes System - Anchor Fit

## 🎯 Simple Marketing Tool

Your discount code system is designed for marketing campaigns - no complex referrals, just simple codes you can share with customers.

## 🚀 How to Create Discount Codes

### **Option 1: Admin Panel (Easy)**
Visit: `https://your-app.replit.dev/admin`

1. Enter a code name (e.g., "WELCOME20")
2. Set discount percentage (e.g., 20)
3. Optional: Set usage limit (e.g., 100 people)
4. Optional: Set expiration date
5. Click "Generate Promo Code"

### **Option 2: API Call (Advanced)**
```bash
curl -X POST https://your-app.replit.dev/api/admin/generate-promo \
  -H "Content-Type: application/json" \
  -d '{
    "code": "SUMMER25",
    "discount_percentage": 25,
    "usage_limit": 200,
    "expires_at": "2025-08-31"
  }'
```

## 💡 Marketing Campaign Ideas

### **Welcome Series**
- `WELCOME10` - 10% off for new customers
- `FIRSTBUY15` - 15% off first purchase

### **Seasonal Campaigns**
- `SUMMER25` - Summer sale
- `NEWYEAR30` - New Year promotion
- `BLACKFRI50` - Black Friday special

### **Social Media**
- `INSTA20` - Instagram followers
- `TIKTOK15` - TikTok audience
- `YOUTUBE25` - YouTube subscribers

### **Influencer Partnerships**
- `JANE20` - Influencer Jane's audience
- `FITGURU15` - Fitness guru collaboration

### **Limited Time Offers**
- `FLASH50` - 24-hour flash sale
- `WEEKEND20` - Weekend special
- `HOURLY30` - Limited hour deal

## 📊 How It Works

1. **You create** a discount code with your chosen settings
2. **You share** the code via:
   - Social media posts
   - Email campaigns
   - Influencer partnerships
   - Text messages
   - Website banners
   - Print materials

3. **Customer applies** the code during checkout
4. **System validates** the code automatically:
   - Checks if code exists
   - Verifies it's still active
   - Confirms it hasn't exceeded usage limit
   - Ensures it hasn't expired

5. **Discount applied** and order processed
6. **Usage tracked** for your analytics

## 🔧 Code Settings Explained

### **Discount Percentage**
- Enter whole numbers (e.g., 20 for 20% off)
- Applied to subtotal before shipping

### **Usage Limit**
- Controls how many people can use the code
- Leave empty for unlimited use
- Tracks usage automatically

### **Expiration Date**
- Set end date for time-sensitive campaigns
- Leave empty for permanent codes
- Automatically becomes invalid after date

## 📈 Best Practices

### **Code Naming**
- Keep it short and memorable
- Use ALL CAPS for consistency
- Make it relevant to the campaign
- Avoid confusing characters (0, O, 1, I)

### **Campaign Strategy**
- Start with smaller discounts (10-15%)
- Use urgency for higher discounts (limited time/quantity)
- Test different percentages to find sweet spot
- Track which codes perform best

### **Distribution**
- Share on your most active social media
- Include in email newsletters
- Partner with influencers in fitness niche
- Use on promotional materials

## 🎯 Ready to Use

Your discount code system is fully functional and ready for marketing campaigns. Create your first code and start driving sales!

### **Quick Start:**
1. Go to `/admin` on your app
2. Create code "LAUNCH20" with 20% discount
3. Share with your first customers
4. Watch orders come in with automatic discounts applied! 🚀