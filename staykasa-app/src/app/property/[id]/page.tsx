'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, Star, MapPin, Users, Bed, Bath } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BookingForm from '@/components/ui/booking-form';
import { PropertyPlaceholder } from '@/components/ui/property-placeholder';
import { ReviewsSection } from '@/components/ui/reviews-section';
import { ContactHost } from '@/components/ui/contact-host';
import Link from 'next/link';
import { toast } from 'sonner';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  maxGuests: number;
  bedrooms: number;
  baths: number;
  rating: number;
  reviewCount: number;
  description: string;
  amenities: string[];
  images: Array<{ url: string; alt?: string; isPrimary: boolean }>;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface PropertyDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [propertyId, setPropertyId] = useState<string>('');

  useEffect(() => {
    const getPropertyId = async () => {
      const { id } = await params;
      setPropertyId(id);
    };
    getPropertyId();
  }, [params]);

  useEffect(() => {
    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${propertyId}`);
      if (!response.ok) {
        throw new Error('Property not found');
      }
      const data = await response.json();
      setProperty(data.property);
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSuccess = () => {
    setShowBookingSuccess(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="h-96 bg-gray-200 rounded-2xl"></div>
                <div className="h-64 bg-gray-200 rounded-2xl"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#133736] mb-4">Property Not Found</h1>
            <p className="text-muted-foreground mb-6">The property you're looking for doesn't exist.</p>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-transparent">
      {/* Header */}
      <div className="bg-white/95 border-b border-primary/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Images */}
            <div className="space-y-4">
              <div className="relative h-96 rounded-2xl overflow-hidden">
                {property.images.length > 0 ? (
                  <Image
                    src={property.images[selectedImage]?.url || '/Images/properties/placeholder.webp'}
                    alt={property.images[selectedImage]?.alt || property.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 66vw"
                    priority
                  />
                ) : (
                  <PropertyPlaceholder type="luxury" className="h-full" />
                )}
              </div>
              
              {/* Image Thumbnails */}
              {property.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                        selectedImage === index 
                          ? 'border-primary' 
                          : 'border-transparent hover:border-primary/50'
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={image.alt || `${property.title} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-primary/20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-[#133736] mb-2">{property.title}</h1>
                  <div className="flex items-center gap-2 text-[#50757c] mb-3">
                    <MapPin size={16} />
                    <span className="font-medium">{property.location}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="text-yellow-500" size={16} />
                      <span className="font-semibold">{property.rating}</span>
                      <span className="text-muted-foreground">({property.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    ₵{property.price.toLocaleString()}
                  </div>
                  <div className="text-muted-foreground">per night</div>
                </div>
              </div>

              {/* Property Stats */}
              <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-primary/20 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users size={16} className="text-primary" />
                    <span className="font-semibold">{property.maxGuests}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Guests</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Bed size={16} className="text-primary" />
                    <span className="font-semibold">{property.bedrooms}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Bedrooms</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Bath size={16} className="text-primary" />
                    <span className="font-semibold">{property.baths}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Bathrooms</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-[#133736] mb-3">About this place</h3>
                <p className="text-muted-foreground leading-relaxed">{property.description}</p>
              </div>

              {/* Amenities */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-[#133736] mb-4">What this place offers</h3>
                <div className="grid grid-cols-2 gap-3">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-muted-foreground">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews Section */}
              <div className="border-t border-gray-200 pt-8">
                <ReviewsSection
                  propertyId={property.id}
                  propertyTitle={property.title}
                  currentRating={property.rating}
                  reviewCount={property.reviewCount}
                />
              </div>
            </div>
          </div>

          {/* Booking Form Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <BookingForm 
                propertyId={property.id}
                propertyTitle={property.title}
                price={property.price}
                maxGuests={property.maxGuests}
                onSuccess={handleBookingSuccess}
              />
              
              <ContactHost
                hostId="host-id" // This would come from the property data
                hostName="John Host" // This would come from the property data
                propertyId={property.id}
                propertyTitle={property.title}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Booking Success Modal */}
      {showBookingSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-full"></div>
            </div>
            <h3 className="text-xl font-bold text-[#133736] mb-2">Booking Request Sent!</h3>
            <p className="text-muted-foreground mb-6">
              Your booking request has been sent to the host. You'll receive a confirmation within 24 hours.
            </p>
            <Button 
              onClick={() => setShowBookingSuccess(false)}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Continue Browsing
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 