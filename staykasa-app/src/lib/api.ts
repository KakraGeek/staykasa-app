// API service for making requests to the backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

interface Property {
  id: string;
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
  amenities: string; // JSON string of amenities array
  images: PropertyImage[];
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

interface PropertyImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
  order: number;
}

interface Booking {
  id: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'PENDING' | 'PENDING_PAYMENT' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  specialRequests?: string;
  guestName: string;
  propertyId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'GUEST' | 'HOST' | 'ADMIN' | 'CLEANER';
  phone?: string;
  avatar?: string;
  isVerified: boolean;
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      // Don't throw error for database connection issues (503)
      if (response.status === 503) {
        throw new Error('DATABASE_CONNECTION_FAILED');
      }
      throw new Error(data.error || 'API request failed');
    }

    // Handle different response structures
    if (data.data !== undefined) {
      return data; // Response has { data: ... } structure
    } else {
      return { data }; // Response is direct data
    }
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Property API functions
export const propertyApi = {
  // Get all properties with optional filters
  async getProperties(params?: {
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    guests?: number;
    page?: number;
    limit?: number;
  }): Promise<Property[]> {
    try {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString());
          }
        });
      }

      const response = await fetch(`${API_BASE_URL}/api/properties?${searchParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch properties');
      }

      return data.properties || [];
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      return [];
    }
  },

  // Get a single property by ID
  async getProperty(id: string): Promise<Property> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/properties/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch property');
      }

      return data;
    } catch (error) {
      console.error('Failed to fetch property:', error);
      throw error;
    }
  },

  // Get featured properties
  async getFeaturedProperties(): Promise<Property[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/properties?featured=true`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch featured properties');
      }

      return data.properties || [];
    } catch (error) {
      console.error('Failed to fetch featured properties:', error);
      return [];
    }
  },
};

// Booking API functions
export const bookingApi = {
  // Create a new booking
  async createBooking(bookingData: {
    propertyId: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    guestName: string;
    specialRequests?: string;
  }): Promise<Booking> {
    const response = await apiRequest<Booking>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
    return response.data;
  },

  // Get user's bookings
  async getUserBookings(): Promise<Booking[]> {
    const response = await apiRequest<Booking[]>('/api/bookings');
    return response.data;
  },

  // Get a single booking by ID
  async getBooking(id: string): Promise<Booking> {
    const response = await apiRequest<Booking>(`/api/bookings/${id}`);
    return response.data;
  },

  // Cancel a booking
  async cancelBooking(id: string): Promise<Booking> {
    const response = await apiRequest<Booking>(`/api/bookings/${id}/cancel`, {
      method: 'PATCH',
    });
    return response.data;
  },
};

// User API functions
export const userApi = {
  // Get current user profile
  async getCurrentUser(): Promise<User> {
    const response = await apiRequest<User>('/api/auth/me');
    return response.data;
  },

  // Update user profile
  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await apiRequest<User>('/api/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
    return response.data;
  },
};

// Search API functions
export const searchApi = {
  // Search properties
  async searchProperties(query: string): Promise<Property[]> {
    const response = await apiRequest<Property[]>(`/api/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
};

// Export types for use in components
export type { Property, Booking, User, ApiResponse }; 