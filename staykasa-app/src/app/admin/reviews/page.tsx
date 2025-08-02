'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Star,
  User,
  Home,
  Calendar,
  Eye,
  Trash2,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Review {
  id: string;
  rating: number;
  comment: string;
  isPublic: boolean;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  property: {
    title: string;
    location: string;
  };
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch('/api/admin/reviews');
      // const data = await response.json();
      
      // Mock data for now
      setTimeout(() => {
        setReviews([
          {
            id: '1',
            rating: 5,
            comment: 'Amazing property! The villa was exactly as described and the location was perfect. Highly recommended!',
            isPublic: true,
            createdAt: '2024-01-15T14:30:00Z',
            user: {
              firstName: 'Sarah',
              lastName: 'Guest',
              email: 'guest@staykasa.com',
            },
            property: {
              title: 'Luxury Villa in Accra',
              location: 'East Legon, Accra',
            },
          },
          {
            id: '2',
            rating: 4,
            comment: 'Great location and clean facilities. The only minor issue was the WiFi was a bit slow.',
            isPublic: true,
            createdAt: '2024-01-14T16:45:00Z',
            user: {
              firstName: 'John',
              lastName: 'Traveler',
              email: 'john@example.com',
            },
            property: {
              title: 'Beachfront Apartment',
              location: 'Kokrobite Beach',
            },
          },
          {
            id: '3',
            rating: 5,
            comment: 'Perfect for business travel. Clean, quiet, and well-equipped. Will definitely stay again.',
            isPublic: true,
            createdAt: '2024-01-13T09:15:00Z',
            user: {
              firstName: 'Mary',
              lastName: 'Business',
              email: 'mary@business.com',
            },
            property: {
              title: 'City Center Studio',
              location: 'Osu, Accra',
            },
          },
          {
            id: '4',
            rating: 2,
            comment: 'The property was not as clean as expected and the amenities were outdated.',
            isPublic: false,
            createdAt: '2024-01-12T11:20:00Z',
            user: {
              firstName: 'David',
              lastName: 'Family',
              email: 'david@family.com',
            },
            property: {
              title: 'Luxury Villa in Accra',
              location: 'East Legon, Accra',
            },
          },
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to load reviews:', error);
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = filterRating === 'all' || review.rating.toString() === filterRating;
    
    return matchesSearch && matchesRating;
  });

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#03c3d7] mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
          <p className="text-gray-600">Manage all reviews in the system</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Total Reviews</p>
                <p className="text-xl font-bold">{reviews.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <p className="text-xl font-bold">{averageRating.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Public</p>
                <p className="text-xl font-bold">
                  {reviews.filter(r => r.isPublic).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Hidden</p>
                <p className="text-xl font-bold">
                  {reviews.filter(r => !r.isPublic).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search reviews by user, property, or comment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#03c3d7]"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>All Reviews ({filteredReviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div 
                key={review.id} 
                className={`p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
                  !review.isPublic ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-[#03c3d7] rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {review.user.firstName.charAt(0)}{review.user.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {review.user.firstName} {review.user.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{review.user.email}</p>
                      </div>
                      {!review.isPublic && (
                        <Badge className="bg-red-100 text-red-800">Hidden</Badge>
                      )}
                    </div>
                    
                    <div className="ml-13">
                      <div className="mb-2">
                        {renderStars(review.rating)}
                      </div>
                      
                      <p className="text-gray-700 mb-2">{review.comment}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Home className="h-4 w-4 mr-1" />
                            {review.property.title}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 