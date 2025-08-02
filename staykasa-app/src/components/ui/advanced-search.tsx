'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, MapPin, Calendar, Users, Filter, X } from 'lucide-react';

interface SearchFilters {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  minPrice: number;
  maxPrice: number;
  bedrooms: number;
  propertyType: string;
  amenities: string[];
  rating: number;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
  initialFilters?: Partial<SearchFilters>;
}

const propertyTypes = [
  'All Types',
  'Apartment',
  'House',
  'Villa',
  'Studio',
  'Condo',
  'Cottage',
  'Cabin',
];

const amenitiesList = [
  'WiFi',
  'Kitchen',
  'Air Conditioning',
  'Pool',
  'Parking',
  'Gym',
  'Beach Access',
  'Mountain View',
  'Pet Friendly',
  'Wheelchair Accessible',
];

export default function AdvancedSearch({
  onSearch,
  onClear,
  initialFilters
}: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    location: initialFilters?.location || '',
    checkIn: initialFilters?.checkIn || '',
    checkOut: initialFilters?.checkOut || '',
    guests: initialFilters?.guests || 1,
    minPrice: initialFilters?.minPrice || 0,
    maxPrice: initialFilters?.maxPrice || 10000,
    bedrooms: initialFilters?.bedrooms || 0,
    propertyType: initialFilters?.propertyType || 'All Types',
    amenities: initialFilters?.amenities || [],
    rating: initialFilters?.rating || 0,
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClear = () => {
    const clearedFilters: SearchFilters = {
      location: '',
      checkIn: '',
      checkOut: '',
      guests: 1,
      minPrice: 0,
      maxPrice: 10000,
      bedrooms: 0,
      propertyType: 'All Types',
      amenities: [],
      rating: 0,
    };
    setFilters(clearedFilters);
    onClear();
  };

  const hasActiveFilters = () => {
    return (
      filters.location ||
      filters.checkIn ||
      filters.checkOut ||
      filters.guests > 1 ||
      filters.minPrice > 0 ||
      filters.maxPrice < 10000 ||
      filters.bedrooms > 0 ||
      filters.propertyType !== 'All Types' ||
      filters.amenities.length > 0 ||
      filters.rating > 0
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Advanced Search
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters() && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Filter className="h-4 w-4 mr-1" />
              {isExpanded ? 'Hide' : 'Show'} Filters
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Basic Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="location"
                placeholder="Where do you want to stay?"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="checkIn">Check-in</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="checkIn"
                type="date"
                value={filters.checkIn}
                onChange={(e) => handleFilterChange('checkIn', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="checkOut">Check-out</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="checkOut"
                type="date"
                value={filters.checkOut}
                onChange={(e) => handleFilterChange('checkOut', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="guests">Guests</Label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="guests"
                type="number"
                min="1"
                max="20"
                value={filters.guests}
                onChange={(e) => handleFilterChange('guests', parseInt(e.target.value))}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {isExpanded && (
          <div className="space-y-6 border-t pt-6">
            {/* Price Range */}
            <div className="space-y-4">
              <Label>Price Range (₵ per night)</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value) || 0)}
                    className="w-24"
                  />
                  <span>to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value) || 10000)}
                    className="w-24"
                  />
                </div>
                <Slider
                  value={[filters.minPrice, filters.maxPrice]}
                  onValueChange={(value) => {
                    handleFilterChange('minPrice', value[0]);
                    handleFilterChange('maxPrice', value[1]);
                  }}
                  max={10000}
                  step={100}
                  className="w-full"
                />
              </div>
            </div>

            {/* Property Type and Bedrooms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Property Type</Label>
                <Select
                  value={filters.propertyType}
                  onValueChange={(value) => handleFilterChange('propertyType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Bedrooms</Label>
                <Select
                  value={filters.bedrooms.toString()}
                  onValueChange={(value) => handleFilterChange('bedrooms', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-3">
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {amenitiesList.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={filters.amenities.includes(amenity)}
                      onCheckedChange={() => handleAmenityToggle(amenity)}
                    />
                    <Label htmlFor={amenity} className="text-sm">
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div className="space-y-3">
              <Label>Minimum Rating</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[filters.rating]}
                  onValueChange={(value) => handleFilterChange('rating', value[0])}
                  max={5}
                  step={0.5}
                  className="flex-1"
                />
                <span className="text-sm font-medium">{filters.rating}+ stars</span>
              </div>
            </div>
          </div>
        )}

        {/* Search Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleSearch}
            className="bg-[#03c3d7] hover:bg-[#00abbc] text-white px-8"
            size="lg"
          >
            <Search className="h-4 w-4 mr-2" />
            Find Stays
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 