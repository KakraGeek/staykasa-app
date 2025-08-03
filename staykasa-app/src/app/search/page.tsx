'use client';

import { useEffect, useState, useCallback } from 'react';
import { PropertyCard } from "@/components/ui/property-card";
import { propertyApi, type Property } from "@/lib/api";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

export default function SearchPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedGuests, setSelectedGuests] = useState('any');
  const [priceRange, setPriceRange] = useState('any');

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    document.title = 'StayKasa - Search';
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await propertyApi.getProperties();
      setProperties(data || []);
      setFilteredProperties(data || []);
    } catch (error) {
      console.error('Failed to load properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const filterProperties = useCallback(() => {
    let filtered = [...properties];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by city
    if (selectedCity && selectedCity !== 'all') {
      filtered = filtered.filter(property =>
        property.city.toLowerCase() === selectedCity.toLowerCase()
      );
    }

    // Filter by guests
    if (selectedGuests && selectedGuests !== 'any') {
      const guestCount = parseInt(selectedGuests);
      filtered = filtered.filter(property => property.maxGuests >= guestCount);
    }

    // Filter by price range
    if (priceRange && priceRange !== 'any') {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(property => {
        if (max) {
          return property.price >= min && property.price <= max;
        }
        return property.price >= min;
      });
    }

    setFilteredProperties(filtered);
  }, [properties, searchTerm, selectedCity, selectedGuests, priceRange]);

  useEffect(() => {
    filterProperties();
  }, [filterProperties]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCity('all');
    setSelectedGuests('any');
    setPriceRange('any');
    toast.success('Search filters cleared');
  };



  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#03c3d7]/10 via-[#84a9ae]/5 to-[#133736]/10">
        <div className="container mx-auto px-4 py-8">
          {/* Search Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#03c3d7] to-[#84a9ae] bg-clip-text text-transparent">
              Find Your Perfect Stay in Ghana
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover beautiful vacation rentals across Ghana with instant booking and local payment support
            </p>
          </div>

          {/* Search Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Filters
              </CardTitle>
              <CardDescription>
                Filter properties by location, guests, and price range
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search Term */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      placeholder="Search properties..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* City Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">City</label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      <SelectItem value="Accra">Accra</SelectItem>
                      <SelectItem value="Kumasi">Kumasi</SelectItem>
                      <SelectItem value="Cape Coast">Cape Coast</SelectItem>
                      <SelectItem value="Takoradi">Takoradi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Guests Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Guests</label>
                  <Select value={selectedGuests} onValueChange={setSelectedGuests}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any guests" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any guests</SelectItem>
                      <SelectItem value="1">1 guest</SelectItem>
                      <SelectItem value="2">2 guests</SelectItem>
                      <SelectItem value="4">4 guests</SelectItem>
                      <SelectItem value="6">6+ guests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price Range</label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any price</SelectItem>
                      <SelectItem value="0-1000">Under ₵1,000</SelectItem>
                      <SelectItem value="1000-2000">₵1,000 - ₵2,000</SelectItem>
                      <SelectItem value="2000-5000">₵2,000 - ₵5,000</SelectItem>
                      <SelectItem value="5000-999999">₵5,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="text-[#03c3d7] border-[#03c3d7] hover:bg-[#03c3d7] hover:text-white"
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-[#133736]">
                {loading ? 'Loading...' : `${filteredProperties.length} Properties Found`}
              </h2>
              {!loading && filteredProperties.length > 0 && (
                <Badge variant="secondary" className="bg-[#03c3d7]/10 text-[#03c3d7]">
                  {filteredProperties.length} results
                </Badge>
              )}
            </div>
          </div>

          {/* Properties Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-8 w-8 animate-spin text-[#03c3d7]" />
                <span className="text-lg text-[#50757c]">Loading properties...</span>
              </div>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-[#133736]">No properties found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search filters or browse all available properties
                </p>
                <Button
                  onClick={clearFilters}
                  className="bg-[#03c3d7] hover:bg-[#00abbc] text-white"
                >
                  View All Properties
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  badge={property.isFeatured ? { text: "Featured", variant: "default" } : undefined}
                  imagePath={property.images[0]?.url || ''}
                  placeholderType="default"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
} 