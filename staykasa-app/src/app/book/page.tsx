"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PropertyCard } from "@/components/ui/property-card";

import Link from "next/link";
import toast from "react-hot-toast";

// Define the Property interface
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
  isFeatured: boolean;
  images: Array<{ url: string; alt?: string; isPrimary: boolean }>;
}

export default function BookPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    document.title = "StayKasa - Book";
    fetchProperties();
  }, []);

  // Fetch properties from the API
  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/properties');
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      const data = await response.json();
      setProperties(data.properties || []);
      setFilteredProperties(data.properties || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search
  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue);
    const filtered = properties.filter(property =>
      property.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      property.location.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredProperties(filtered);
  };

  // Get badge for property
  const getPropertyBadge = (property: Property) => {
    if (property.isFeatured) {
      return { text: "Featured", variant: "default" as const };
    }
    if (property.rating >= 4.8) {
      return { text: "Popular", variant: "secondary" as const };
    }
    if (property.price >= 3000) {
      return { text: "Premium", variant: "outline" as const };
    }
    return undefined;
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-transparent">
      {/* Header */}
      <div className="bg-white/95 border-b border-primary/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#133736] mb-4">
              Find Your Perfect Stay
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover beautiful vacation rentals across Ghana
            </p>
          </div>

          {/* Simple Search */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search properties..."
                  className="w-full"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <Button
                onClick={() => handleSearch(searchTerm)}
                className="bg-[#03c3d7] hover:bg-[#00abbc]"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Available Properties */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#133736] mb-6 text-center">
            {isLoading ? 'Loading...' : `Available Properties (${filteredProperties.length})`}
          </h2>
          
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#03c3d7]"></div>
                <span className="text-lg text-[#50757c]">Loading properties...</span>
              </div>
            </div>
          )}
          
          {!isLoading && filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <div className="text-[#50757c] mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[#133736] mb-2">No properties found</h3>
              <p className="text-[#50757c] mb-4">
                {searchTerm ? 'Try adjusting your search criteria' : 'No properties available at the moment'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilteredProperties(properties);
                  }}
                  className="text-[#03c3d7] hover:text-[#00abbc] font-medium"
                >
                  View all properties
                </button>
              )}
            </div>
          )}
          
          {!isLoading && filteredProperties.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  title={property.title}
                  location={property.location}
                  price={`₵${property.price.toLocaleString()}/night`}
                  guests={property.maxGuests}
                  bedrooms={property.bedrooms}
                  baths={property.baths}
                  rating={property.rating}
                  badge={getPropertyBadge(property)}
                  imagePath={property.images.find(img => img.isPrimary)?.url || property.images[0]?.url}
                  placeholderType="luxury"
                />
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20">
          <h3 className="text-2xl font-bold text-[#133736] mb-4">
            Can't find what you're looking for?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We're constantly adding new properties. Contact us to find the perfect accommodation for your stay in Ghana.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="bg-[#03c3d7] hover:bg-[#00abbc] shadow-lg hover:shadow-xl transition-all duration-300 text-white font-semibold px-6 py-2 rounded-lg border-0 hover:scale-105 inline-block text-center"
            >
              Contact Support
            </Link>
            <Link 
              href="/become-host"
              className="border-[#03c3d7] hover:bg-[#03c3d7] hover:text-white text-[#133736] bg-transparent transition-all duration-300 font-semibold hover:shadow-md px-6 py-2 rounded-lg border hover:scale-105"
            >
              Become a Host
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
} 