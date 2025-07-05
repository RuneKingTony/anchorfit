# Anchor Fit - E-commerce Application

## Overview

This is a full-stack e-commerce application for "Anchor Fit", a fitness apparel brand specializing in gym wear. The application is built with React frontend, Express backend, and PostgreSQL database using Drizzle ORM. It features user authentication, product management, shopping cart functionality, and payment processing through Paystack.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API for cart and authentication
- **Routing**: React Router for client-side navigation
- **HTTP Client**: TanStack Query for server state management

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Supabase Auth integration
- **Payment Processing**: Paystack payment gateway
- **Email Service**: Resend for transactional emails

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Connection**: Connection pooling with @neondatabase/serverless

## Key Components

### Authentication System
- User registration and login through Supabase
- JWT-based session management
- Profile management with additional user metadata
- Protected routes and role-based access

### E-commerce Features
- Product catalog with multiple variants (sizes, colors, pricing)
- Shopping cart with persistent state
- Order management and tracking
- Promo code system with discount application
- Referral program for user acquisition

### Payment Processing
- Paystack integration for secure payments
- Webhook handling for payment status updates
- Order confirmation emails
- Support for Nigerian Naira currency

### UI/UX Components
- Responsive design with mobile-first approach
- Image zoom functionality for product viewing
- Loading states and error handling
- Toast notifications for user feedback
- Modal dialogs for cart, authentication, and user dashboard

## Data Flow

1. **User Registration/Login**: Users authenticate through Supabase, creating profiles in the database
2. **Product Browsing**: Products are loaded from the database with variant information
3. **Cart Management**: Items are added to cart context, persisted in local state
4. **Checkout Process**: Order details are processed through Paystack payment gateway
5. **Order Fulfillment**: Payment webhooks update order status and trigger confirmation emails
6. **Order Tracking**: Users can view order history and tracking information in their dashboard

## External Dependencies

### Payment Gateway
- **Paystack**: Nigerian payment processor for card transactions
- Webhook integration for real-time payment status updates
- Support for multiple payment methods

### Email Service
- **Resend**: Transactional email service for order confirmations
- Template-based email system for consistent branding

### Database Hosting
- **Neon**: Serverless PostgreSQL database
- Connection pooling for optimal performance
- Automatic backups and scaling

### Authentication Provider
- **Supabase**: Authentication and user management
- Social login support (Instagram integration)
- Real-time database features

### UI Library
- **shadcn/ui**: Pre-built React components with Tailwind CSS
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library for consistent iconography

## Deployment Strategy

### Development Environment
- Vite development server for frontend with hot module replacement
- Express server with TypeScript compilation via tsx
- Environment variables for API keys and database connections

### Production Build
- Frontend: Vite build process generating optimized static assets
- Backend: esbuild bundling for Node.js deployment
- Database migrations: Drizzle Kit for schema management

### Environment Configuration
- Separate development and production environment variables
- Database URL configuration for different environments
- API key management for external services

## Changelog

- July 05, 2025: Production environment setup completed ✅
  - Updated all environment variables with live production keys
  - Configured LIVE Paystack secret key (sk_live_*) for real payment processing
  - Set up Google OAuth with production client credentials
  - Configured Resend email service with production API key
  - Updated database connection with channel_binding for enhanced security
  - Verified automatic order status updates via Paystack webhooks
  - Created comprehensive production deployment guide
  - All systems ready for live production deployment
- July 05, 2025: Migration from Replit Agent to standard Replit completed ✅
  - Fixed admin authentication system with proper JWT tokens
  - Created PostgreSQL database with all required tables
  - Migrated all database schemas and relationships
  - Set up admin user (admin@anchorfit.ng / admin123)
  - Fixed order fetching and promo code generation issues
  - Added sample discount codes for testing
  - Secured all admin endpoints with proper authentication
  - Application now fully functional in standard Replit environment
- July 05, 2025: UI enhancements and product inventory management ✅
  - Updated "Follow Us" section with modern, aesthetic design removing blue overlay
  - Redesigned Instagram follow button with gradient colors and proper Instagram icon
  - Enhanced admin dashboard with colorful stat cards and modern styling
  - Added emoji icons to admin navigation tabs for better visual hierarchy
  - Implemented logout functionality for admin dashboard
  - Fixed acid washed XXL size availability issue with smart size filtering
  - Added automatic size adjustment when switching colors
  - Created visual feedback for unavailable size/color combinations
- July 05, 2025: Migration from Replit Agent to standard Replit completed ✅
  - Fixed foreign key constraint issue in order creation system
  - Successfully migrated application to standard Replit environment
  - Set up PostgreSQL database with proper schema migrations
  - Fixed Google OAuth authentication with proper token handling
  - Resolved profile creation and lookup issues for OAuth users
  - Configured Resend API for all email services (verification, password reset, orders)
  - Enhanced frontend AuthContext to handle OAuth redirects
  - Added email validation to prevent test address failures
  - All authentication methods now working: email/password, Google OAuth, password reset
  - Fixed database foreign key constraint issues for payment processing
  - Resolved email service configuration to work with production Resend API
  - Updated email sender format to comply with Resend requirements
  - Fixed email service initialization with proper environment variable loading
  - All email flows verified working: verification emails, password resets, order confirmations, delivery notifications
  - Email service now properly supports all user registration and order processes
  - **PRODUCTION READY**: Updated all email services to use verified domain `anchorfit.ng`
  - All email endpoints now send to any email address (no longer restricted to sandbox mode)
  - Updated support contact email to use verified domain (`support@anchorfit.ng`)
  - Verified full email functionality: user registration, password reset, order notifications
- July 04, 2025: Production-ready migration to Replit completed ✅
  - Implemented comprehensive email verification system for user registration
  - Added secure password reset functionality with time-limited tokens
  - Enhanced email service with professional templates for all notifications
  - Secured admin dashboard with proper role-based authentication
  - Fixed order confirmation emails for both customers and sellers
  - Implemented Google OAuth authentication alongside email/password
  - Created full admin interface with order management and analytics
  - Set up proper environment variables and database integration
  - Fixed all authentication issues and login functionality working optimally
- July 02, 2025: Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.