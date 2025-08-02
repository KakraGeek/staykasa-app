# StayKasa Payment Integration Documentation

## 🎯 Overview

StayKasa now includes a complete **Paystack payment integration** system that enables secure, real-time payment processing for property bookings. This system handles the entire payment flow from booking creation to payment confirmation.

## 🏗️ Architecture

### **Payment Flow:**
1. **User fills booking form** → Creates booking in database
2. **Payment initialization** → Generates Paystack payment link
3. **User redirected to Paystack** → Completes payment
4. **Payment verification** → Updates booking status
5. **Notifications sent** → User and host notified

### **Key Components:**
- **Payment API Routes** - Handle payment initialization and verification
- **Booking Form Integration** - Seamless payment flow
- **Database Schema** - Payment and booking status tracking
- **Notification System** - Real-time updates

## 🔧 Technical Implementation

### **1. Payment Configuration (`src/lib/payment.ts`)**

```typescript
// Core payment functions
- initializePayment() - Creates Paystack payment session
- verifyPayment() - Verifies payment completion
- generatePaymentReference() - Creates unique payment IDs
- formatAmount() - Converts to Paystack format (kobo)
```

### **2. API Endpoints**

#### **POST `/api/payments/initialize`**
- **Purpose:** Initialize payment with Paystack
- **Input:** Booking details, amount, guest info
- **Output:** Paystack authorization URL
- **Security:** User authentication required

#### **GET `/api/payments/verify`**
- **Purpose:** Verify payment completion
- **Input:** Payment reference from Paystack
- **Output:** Payment status and booking updates
- **Security:** Public endpoint (Paystack callback)

### **3. Database Schema Updates**

#### **Booking Status Enum:**
```prisma
enum BookingStatus {
  PENDING
  PENDING_PAYMENT  // New status
  CONFIRMED
  CANCELLED
  COMPLETED
  REFUNDED
}
```

#### **Payment Method Enum:**
```prisma
enum PaymentMethod {
  PAYSTACK        // New method
  MOBILE_MONEY_MTN
  MOBILE_MONEY_VODAFONE
  MOBILE_MONEY_AIRTELTIGO
  CREDIT_CARD
  DEBIT_CARD
  BANK_TRANSFER
}
```

## 🚀 Setup Instructions

### **1. Environment Variables**

Add to your `.env` file:
```env
# Paystack Configuration
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here

# Application URLs
NEXTAUTH_URL=http://localhost:3000
```

### **2. Database Migration**

```bash
# Generate Prisma client
npx prisma generate

# Apply database changes
npx prisma db push
```

### **3. Install Dependencies**

```bash
npm install paystack @types/paystack axios react-hot-toast
```

## 💳 Payment Flow Details

### **Step 1: Booking Creation**
```typescript
// User submits booking form
const booking = await createBooking({
  propertyId: "property_id",
  checkIn: "2024-01-15",
  checkOut: "2024-01-17",
  guests: 2,
  guestName: "John Doe"
});
```

### **Step 2: Payment Initialization**
```typescript
// Initialize payment with Paystack
const payment = await initializePayment({
  bookingId: booking.id,
  amount: 500.00, // GHS
  email: "user@example.com",
  reference: "STAYKASA_1234567890_ABC123"
});
```

### **Step 3: User Payment**
- User redirected to Paystack payment page
- Completes payment via Mobile Money, Card, or Bank Transfer
- Paystack redirects back to verification endpoint

### **Step 4: Payment Verification**
```typescript
// Verify payment completion
const verification = await verifyPayment(reference);
if (verification.status === 'success') {
  // Update booking to CONFIRMED
  // Send notifications
  // Create payment record
}
```

## 🔒 Security Features

### **1. Payment Security**
- **HTTPS Only** - All payment communications encrypted
- **Reference Validation** - Unique payment references prevent duplicates
- **Amount Verification** - Server-side amount validation
- **User Authentication** - Only authenticated users can create payments

### **2. Data Protection**
- **No Card Data Storage** - Payment details never stored locally
- **Secure API Keys** - Environment variable protection
- **Input Validation** - Zod schema validation for all inputs
- **Error Handling** - Comprehensive error management

## 📱 User Experience

### **Booking Form Integration**
- **Seamless Flow** - Single form for booking and payment
- **Real-time Validation** - Instant form validation
- **Price Calculation** - Dynamic pricing with service fees
- **Payment Methods** - Multiple payment options

### **Payment Confirmation**
- **Success Page** - Clear payment confirmation
- **Email Notifications** - Booking confirmation emails
- **SMS Notifications** - Mobile payment confirmations
- **Booking Management** - Easy booking tracking

## 🧪 Testing

### **Test Payment Page**
Visit `/test-payment` to test the payment integration:

```typescript
// Test payment initialization
const response = await fetch('/api/payments/initialize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    bookingId: 'test-booking-id',
    amount: 100,
    email: 'test@example.com',
    guestName: 'Test User'
  })
});
```

### **Paystack Test Cards**
- **Success:** 4084 0840 8408 4081
- **Declined:** 4084 0840 8408 4082
- **Expired:** 4084 0840 8408 4083

## 📊 Monitoring & Analytics

### **Payment Tracking**
- **Transaction Logs** - Complete payment history
- **Success Rates** - Payment success analytics
- **Error Monitoring** - Failed payment tracking
- **Revenue Reports** - Booking revenue analytics

### **Database Records**
```sql
-- Payment records
SELECT * FROM payments WHERE status = 'COMPLETED';

-- Booking analytics
SELECT 
  COUNT(*) as total_bookings,
  SUM(total_price) as total_revenue
FROM bookings 
WHERE status = 'CONFIRMED';
```

## 🔄 Error Handling

### **Common Error Scenarios**
1. **Payment Failed** - User notified, booking cancelled
2. **Network Issues** - Retry mechanism with user feedback
3. **Invalid Amount** - Server-side validation prevents errors
4. **Duplicate Payments** - Reference validation prevents duplicates

### **Error Recovery**
```typescript
try {
  const payment = await initializePayment(data);
} catch (error) {
  // Log error for monitoring
  console.error('Payment error:', error);
  
  // Notify user
  toast.error('Payment failed. Please try again.');
  
  // Update booking status
  await updateBookingStatus(bookingId, 'CANCELLED');
}
```

## 🚀 Production Deployment

### **1. Environment Setup**
```env
# Production Paystack Keys
PAYSTACK_SECRET_KEY=sk_live_your_live_secret_key
PAYSTACK_PUBLIC_KEY=pk_live_your_live_public_key

# Production URLs
NEXTAUTH_URL=https://yourdomain.com
```

### **2. SSL Certificate**
- **Required** - Paystack requires HTTPS
- **Domain Validation** - Valid SSL certificate
- **Callback URLs** - Secure payment verification

### **3. Database Backup**
- **Regular Backups** - Payment data protection
- **Transaction Logs** - Complete audit trail
- **Disaster Recovery** - Payment data recovery

## 📈 Performance Optimization

### **1. Payment Processing**
- **Async Operations** - Non-blocking payment processing
- **Caching** - Payment status caching
- **Queue System** - Background payment verification

### **2. Database Optimization**
- **Indexed Queries** - Fast payment lookups
- **Connection Pooling** - Efficient database connections
- **Query Optimization** - Optimized payment queries

## 🔮 Future Enhancements

### **Planned Features**
1. **Multiple Payment Providers** - Flutterwave integration
2. **Subscription Payments** - Recurring booking payments
3. **Refund System** - Automated refund processing
4. **Payment Analytics** - Advanced revenue analytics
5. **Mobile App Integration** - Native payment flows

### **API Extensions**
```typescript
// Future payment methods
enum PaymentMethod {
  PAYSTACK
  FLUTTERWAVE
  STRIPE
  PAYPAL
  CRYPTO
}
```

## 📞 Support & Troubleshooting

### **Common Issues**
1. **Payment Not Processing** - Check Paystack API keys
2. **Callback Not Working** - Verify callback URLs
3. **Database Errors** - Check Prisma schema
4. **Authentication Issues** - Verify JWT tokens

### **Debug Mode**
```typescript
// Enable debug logging
const DEBUG_PAYMENT = process.env.NODE_ENV === 'development';

if (DEBUG_PAYMENT) {
  console.log('Payment data:', paymentData);
  console.log('Paystack response:', response);
}
```

---

## ✅ **Payment Integration Complete!**

The StayKasa platform now has a **complete, production-ready payment system** that:

- ✅ **Processes real payments** via Paystack
- ✅ **Handles multiple payment methods** (Mobile Money, Cards, Bank Transfer)
- ✅ **Provides secure transactions** with encryption
- ✅ **Sends real-time notifications** to users and hosts
- ✅ **Tracks payment status** in the database
- ✅ **Includes comprehensive error handling**
- ✅ **Supports testing and development**

**Ready for production deployment!** 🚀 