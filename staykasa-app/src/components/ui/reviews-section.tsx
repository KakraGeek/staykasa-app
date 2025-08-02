'use client';

import { useState, useEffect } from 'react';
import { Star, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

interface ReviewsSectionProps {
  propertyId: string;
  propertyTitle: string;
  currentRating: number;
  reviewCount: number;
}

export function ReviewsSection({ propertyId, propertyTitle, currentRating, reviewCount }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadReviews();
  }, [propertyId]);

  const loadReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?propertyId=${propertyId}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error('Please log in to leave a review');
      return;
    }

    if (comment.length < 10) {
      toast.error('Review must be at least 10 characters long');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          propertyId,
          rating,
          comment,
        }),
      });

      if (response.ok) {
        toast.success('Review submitted successfully!');
        setShowReviewForm(false);
        setComment('');
        setRating(5);
        loadReviews(); // Reload reviews to show the new one
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to submit review');
      }
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <span className="text-sm text-muted-foreground">Loading reviews...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Star className="h-5 w-5 text-yellow-500 fill-current" />
            <span className="text-lg font-semibold">{currentRating.toFixed(1)}</span>
          </div>
          <span className="text-muted-foreground">({reviewCount} reviews)</span>
        </div>
        
        {user && (
          <Button
            onClick={() => setShowReviewForm(!showReviewForm)}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-white"
          >
            Write a Review
          </Button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold">Write a Review for {propertyTitle}</h3>
          
          {/* Rating Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= rating
                        ? 'text-yellow-500 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Review</label>
            <Textarea
              value={comment}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
              placeholder="Share your experience with this property..."
              rows={4}
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground text-right">
              {comment.length}/500 characters
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={handleSubmitReview}
              disabled={submitting || comment.length < 10}
              className="bg-primary hover:bg-primary/90"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowReviewForm(false);
                setComment('');
                setRating(5);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No reviews yet. Be the first to review this property!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {review.user.firstName} {review.user.lastName}
                    </p>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 