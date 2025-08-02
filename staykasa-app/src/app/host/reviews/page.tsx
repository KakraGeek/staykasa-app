'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Star,
  Calendar,
  User,
  MessageSquare,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  property: {
    title: string;
  };
  user: {
    firstName: string;
    lastName: string;
  };
  hostResponse?: string;
}

export default function HostReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');
  const [selectedReview, setSelectedReview] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      
      // Mock data for now
      const mockReviews: Review[] = [
        {
          id: '1',
          rating: 5,
          comment: 'Amazing stay! The apartment was spotless and the location was perfect. Highly recommend!',
          createdAt: '2024-01-15T10:30:00Z',
          property: { title: 'Beachfront Apartment' },
          user: { firstName: 'Sarah', lastName: 'Johnson' }
        },
        {
          id: '2',
          rating: 4,
          comment: 'Great location and clean apartment. The only issue was the wifi was a bit slow.',
          createdAt: '2024-01-14T15:20:00Z',
          property: { title: 'City Center Studio' },
          user: { firstName: 'Mike', lastName: 'Davis' },
          hostResponse: 'Thank you for the feedback! We\'ve upgraded the wifi since your stay.'
        },
        {
          id: '3',
          rating: 5,
          comment: 'Perfect weekend getaway! The host was very responsive and helpful.',
          createdAt: '2024-01-13T09:15:00Z',
          property: { title: 'Luxury Villa Accra' },
          user: { firstName: 'Emma', lastName: 'Wilson' }
        }
      ];

      setReviews(mockReviews);
    } catch (error) {
      console.error('Failed to load reviews:', error);
      toast.error('Failed to load reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const sendResponse = async (reviewId: string) => {
    if (!responseText.trim()) return;

    try {
      // For now, just update local state
      setReviews(reviews.map(review => 
        review.id === reviewId 
          ? { ...review, hostResponse: responseText }
          : review
      ));
      setResponseText('');
      setSelectedReview(null);
      toast.success('Response sent!');
    } catch (error) {
      console.error('Failed to send response:', error);
      toast.error('Failed to send response');
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${review.user.firstName} ${review.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = filterRating === 'all' || review.rating.toString() === filterRating;
    
    return matchesSearch && matchesRating;
  });

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

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
          <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
          <p className="text-gray-600 mt-2">Manage guest reviews and respond to feedback</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
                <p className="text-sm text-gray-600">Average Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-2xl font-bold">{reviews.length}</p>
                <p className="text-sm text-gray-600">Total Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-2xl font-bold">{reviews.filter(r => r.rating >= 4).length}</p>
                <p className="text-sm text-gray-600">Positive Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-orange-400" />
              <div>
                <p className="text-2xl font-bold">{reviews.filter(r => r.hostResponse).length}</p>
                <p className="text-sm text-gray-600">Responded</p>
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterRating === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterRating('all')}
                className={filterRating === 'all' ? 'bg-[#03c3d7] hover:bg-[#00abbc]' : ''}
              >
                All
              </Button>
              {[5, 4, 3, 2, 1].map(rating => (
                <Button
                  key={rating}
                  variant={filterRating === rating.toString() ? 'default' : 'outline'}
                  onClick={() => setFilterRating(rating.toString() as any)}
                  className={filterRating === rating.toString() ? 'bg-[#03c3d7] hover:bg-[#00abbc]' : ''}
                >
                  {rating}★
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Review Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#03c3d7] rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {review.user.firstName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {review.user.firstName} {review.user.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{review.property.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Review Comment */}
                <div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>

                {/* Host Response */}
                {review.hostResponse && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 mb-1">Your Response:</p>
                    <p className="text-sm text-blue-800">{review.hostResponse}</p>
                  </div>
                )}

                {/* Response Form */}
                {!review.hostResponse && (
                  <div className="space-y-2">
                    {selectedReview === review.id ? (
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Write your response..."
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          rows={3}
                        />
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => sendResponse(review.id)}
                            disabled={!responseText.trim()}
                            className="bg-[#03c3d7] hover:bg-[#00abbc]"
                          >
                            Send Response
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedReview(null);
                              setResponseText('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => setSelectedReview(review.id)}
                        className="text-[#03c3d7] border-[#03c3d7] hover:bg-[#03c3d7] hover:text-white"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Respond to Review
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
          <p className="text-gray-600">
            {searchTerm || filterRating !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'You haven\'t received any reviews yet'
            }
          </p>
        </div>
      )}
    </div>
  );
} 