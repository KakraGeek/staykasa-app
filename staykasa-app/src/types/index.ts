// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  resetToken?: string;
  resetTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'GUEST' | 'HOST' | 'ADMIN' | 'CLEANER';

// Property Types
export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  address: string;
  city: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  price: number;
  maxGuests: number;
  bedrooms: number;
  baths: number;
  amenities: string; // JSON string
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  owner?: User;
  images?: PropertyImage[];
  reviews?: Review[];
  bookings?: Booking[];
}

export interface PropertyImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
  order: number;
  createdAt: Date;
  propertyId: string;
}

// Booking Types
export interface Booking {
  id: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  status: BookingStatus;
  specialRequests: string | null;
  createdAt: Date;
  updatedAt: Date;
  propertyId: string;
  guestId: string;
  property?: Property;
  guest?: User;
}

export type BookingStatus = 'PENDING' | 'PENDING_PAYMENT' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REFUNDED';

// Review Types
export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  propertyId: string;
  user?: User;
  property?: Property;
}

// Host Application Types
export interface HostApplication {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  experience: string;
  properties: number;
  reason: string;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type BusinessType = 'INDIVIDUAL' | 'SMALL_BUSINESS' | 'PROPERTY_MANAGEMENT' | 'CORPORATE';
export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// Message Types
export interface Message {
  id: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  senderId: string;
  receiverId: string;
  sender?: User;
  receiver?: User;
}

// Notification Types
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user?: User;
}

export type NotificationType = 'BOOKING_CONFIRMED' | 'BOOKING_CANCELLED' | 'PAYMENT_RECEIVED' | 'REVIEW_RECEIVED' | 'MESSAGE_RECEIVED' | 'HOST_APPLICATION';

// Payment Types
export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  transactionId?: string;
  metadata?: string; // JSON string
  createdAt: Date;
  updatedAt: Date;
  bookingId: string;
  userId: string;
  booking?: Booking;
  user?: User;
}

export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'PAYSTACK' | 'MOBILE_MONEY_MTN' | 'MOBILE_MONEY_VODAFONE' | 'MOBILE_MONEY_AIRTELTIGO' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER';

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface BookingFormData {
  propertyId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequests?: string;
}

export interface PropertyFormData {
  title: string;
  description: string;
  location: string;
  address: string;
  city: string;
  country: string;
  price: number;
  maxGuests: number;
  bedrooms: number;
  baths: number;
  amenities: string[];
  isActive: boolean;
  isFeatured: boolean;
}

// Search and Filter Types
export interface SearchFilters {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  rating?: number;
}

export interface AvailabilityData {
  date: string;
  isAvailable: boolean;
  bookedGuests: number;
  availableGuests: number;
  maxGuests: number;
  isFullyBooked: boolean;
}

// Email Types
export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface BookingEmailData {
  email: string;
  firstName: string;
  booking: Booking;
  property: Property;
}

export interface HostApplicationEmailData {
  adminEmails: string[];
  application: HostApplication;
}

// Dashboard Stats Types
export interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  totalProperties: number;
  totalReviews: number;
  recentBookings: Booking[];
  recentReviews: Review[];
}

export interface HostDashboardStats {
  totalBookings: number;
  totalRevenue: number;
  totalProperties: number;
  totalReviews: number;
  averageRating: number;
  monthlyRevenue: MonthlyRevenue[];
  recentBookings: Booking[];
  recentReviews: Review[];
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  bookings: number;
}

// Event Types
export interface FormEvent {
  preventDefault: () => void;
}

export interface InputChangeEvent {
  target: {
    name: string;
    value: string | number;
  };
}

export interface SelectChangeEvent {
  target: {
    value: string;
  };
}

// Prisma Query Types
export interface PrismaWhereClause {
  [key: string]: unknown;
}

export interface PrismaIncludeClause {
  [key: string]: boolean | object;
}

// Component Props Types
export interface AuthSuccessCallback {
  (user: User): void;
}

export interface BookingSuccessCallback {
  (booking: Booking): void;
}

export interface PropertySuccessCallback {
  (property: Property): void;
}

// Error Types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
} 