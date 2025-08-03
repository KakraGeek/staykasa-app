# Real-Time Availability Features for StayKasa

## Overview

This document describes the new real-time availability system implemented for StayKasa, which provides guests with instant visibility into property availability and booking status.

## Features Implemented

### 1. **Availability API Endpoint**
- **Endpoint**: `GET /api/properties/[id]/availability`
- **Purpose**: Fetches real-time availability data for a specific property
- **Parameters**:
  - `startDate` (optional): Start date for availability range
  - `endDate` (optional): End date for availability range
- **Response**: JSON with availability data for each day in the range

### 2. **Availability Calendar Component**
- **File**: `src/components/ui/availability-calendar.tsx`
- **Features**:
  - Visual calendar showing availability status
  - Color-coded dates (green=available, yellow=partially booked, red=fully booked)
  - Real-time availability summary
  - Date range selection
  - Month navigation
  - Loading states and error handling

### 3. **Enhanced Booking Form**
- **File**: `src/components/ui/enhanced-booking-form.tsx`
- **Features**:
  - Integrated availability calendar
  - Real-time date selection
  - Automatic price calculation
  - Guest count validation
  - Special requests handling
  - Booking confirmation

### 4. **Updated Property Detail Page**
- **File**: `src/app/property/[id]/page.tsx`
- **Changes**: Replaced basic booking form with enhanced version

## API Response Format

```json
{
  "propertyId": "string",
  "maxGuests": 4,
  "availability": [
    {
      "date": "2024-01-15",
      "isAvailable": true,
      "bookedGuests": 0,
      "availableGuests": 4,
      "isFullyBooked": false
    },
    {
      "date": "2024-01-16",
      "isAvailable": true,
      "bookedGuests": 2,
      "availableGuests": 2,
      "isFullyBooked": false
    },
    {
      "date": "2024-01-17",
      "isAvailable": false,
      "bookedGuests": 4,
      "availableGuests": 0,
      "isFullyBooked": true
    }
  ],
  "bookedDates": [
    {
      "checkIn": "2024-01-16T00:00:00.000Z",
      "checkOut": "2024-01-18T00:00:00.000Z",
      "guests": 2,
      "status": "CONFIRMED"
    }
  ]
}
```

## Availability Status Types

### 1. **Available (Green)**
- No bookings for that date
- Full capacity available
- Guests can book normally

### 2. **Partially Booked (Yellow)**
- Some guests booked but capacity remaining
- Shows available guest count
- Guests can still book if within capacity

### 3. **Fully Booked (Red)**
- No capacity remaining for that date
- Date is disabled in calendar
- Guests cannot select this date

### 4. **Past Dates (Gray)**
- Dates in the past
- Disabled for selection
- Cannot be booked

## User Experience Flow

### For Guests:
1. **Browse Properties**: View property listings on homepage/search
2. **View Property Details**: Click on property to see full details
3. **Check Availability**: See real-time availability calendar
4. **Select Dates**: Choose check-in and check-out dates
5. **Book Instantly**: Complete booking with confidence

### For Hosts:
1. **Manage Bookings**: View all bookings in host dashboard
2. **Real-time Updates**: See availability changes instantly
3. **Capacity Management**: Understand guest capacity usage

## Technical Implementation

### Database Queries
The availability system uses efficient database queries to:
- Fetch overlapping bookings for date ranges
- Calculate guest capacity per day
- Handle multiple concurrent bookings
- Support different booking statuses

### Performance Optimizations
- **Caching**: Availability data cached for 5 minutes
- **Pagination**: Load availability in 3-month chunks
- **Efficient Queries**: Optimized database queries with proper indexing
- **Lazy Loading**: Load availability data on demand

### Error Handling
- **API Errors**: Graceful error handling with user-friendly messages
- **Network Issues**: Retry mechanisms for failed requests
- **Invalid Dates**: Validation for date ranges and selections
- **Capacity Limits**: Validation for guest count vs. property capacity

## Testing

### Manual Testing
1. Start the development server: `npm run dev`
2. Navigate to a property detail page
3. Test the availability calendar functionality
4. Verify booking creation with selected dates

### API Testing
Use the provided test script:
```bash
node test-availability-api.js
```

### Database Testing
Ensure you have test data with:
- Properties with different guest capacities
- Bookings across various date ranges
- Different booking statuses (PENDING, CONFIRMED, etc.)

## Future Enhancements

### Planned Features:
1. **Dynamic Pricing**: Price variations based on availability
2. **Blocked Dates**: Host ability to block specific dates
3. **Minimum Stay Requirements**: Enforce minimum booking durations
4. **Availability Notifications**: Alert guests when dates become available
5. **Bulk Availability Updates**: Host tools for managing multiple dates

### Performance Improvements:
1. **Redis Caching**: Implement Redis for faster availability lookups
2. **Background Jobs**: Pre-calculate availability data
3. **CDN Integration**: Cache static availability data
4. **Database Optimization**: Add composite indexes for availability queries

## Configuration

### Environment Variables
No additional environment variables required for basic functionality.

### Database Schema
The system uses the existing `Booking` model with the following key fields:
- `checkIn`: Date when booking starts
- `checkOut`: Date when booking ends
- `guests`: Number of guests for this booking
- `status`: Booking status (PENDING, CONFIRMED, etc.)

### API Rate Limiting
Consider implementing rate limiting for the availability API to prevent abuse:
- Limit requests per IP address
- Cache responses for short periods
- Implement request throttling

## Troubleshooting

### Common Issues:

1. **Availability Not Loading**
   - Check database connection
   - Verify property ID exists
   - Check API endpoint is accessible

2. **Calendar Not Displaying**
   - Ensure all dependencies are installed
   - Check browser console for JavaScript errors
   - Verify component imports are correct

3. **Booking Conflicts**
   - Check booking statuses in database
   - Verify date overlap logic
   - Ensure proper timezone handling

### Debug Mode
Enable debug logging by setting:
```javascript
console.log('Availability data:', availability);
```

## Support

For technical support or questions about the availability system:
1. Check the browser console for error messages
2. Review the API response format
3. Verify database connectivity
4. Test with the provided test script

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Author**: StayKasa Development Team 