# Germany Meds - OTP Authentication System

A secure pharmacy management system with OTP-based authentication.

## Features

✅ **Secure OTP Authentication**
- 6-digit OTP generation with 5-minute expiration
- Email-based OTP delivery
- Brute force protection (max 3 attempts)
- JWT token-based session management

✅ **User Flow**
1. **Login Page**: User enters Name and Email
2. **OTP Generation**: System generates secure 6-digit OTP
3. **Email Delivery**: OTP sent to user's email with subject "Your OTP Code"
4. **OTP Verification**: User enters OTP received in email
5. **Dashboard Access**: Protected dashboard opens after successful verification

✅ **Security Features**
- Secure random OTP generation
- OTP expiration (5 minutes)
- Attempt limiting (3 tries max)
- JWT token validation
- Protected routes

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5174

3. **Test the Flow**
   - Go to http://localhost:5173/login
   - Enter your name and email
   - Check server console for OTP (development mode)
   - Enter the OTP to access dashboard

## Email Configuration (Required for Real OTP Delivery)

**⚠️ Important**: Without email configuration, OTPs will only be logged to the console (development mode).

### Quick Setup (Gmail - Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**: Google Account → Security → 2-Step Verification → App passwords
3. **Create `.env` file**:
   ```env
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-16-character-app-password
   JWT_SECRET=your-secret-key-here
   ```

### Alternative Providers

```env
# Custom SMTP
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-password
SMTP_FROM=your-email@domain.com

# SendGrid (Production)
SENDGRID_API_KEY=your-sendgrid-api-key
```

### Test Email Delivery

```bash
# Test with your email address
npm run test:email your-email@example.com
```

📖 **Detailed Setup**: See `EMAIL_SETUP.md` for complete instructions.

## Development Notes

- OTPs are logged to server console in development mode
- Database: SQLite with automatic schema migrations
- Frontend: React + TypeScript + Tailwind CSS
- Backend: Express.js + JWT authentication
- All routes are protected except `/login`

## API Endpoints

- `POST /api/auth/request-otp` - Request OTP for email
- `POST /api/auth/verify-otp` - Verify OTP and get JWT token
- `GET /api/auth/me` - Get current user info (protected)
- `POST /api/email/invoice` - Send invoice emails (protected)
