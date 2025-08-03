'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Eye,
  Home,
  Star,
  Calendar,
  Power,
  PowerOff,
  Users,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

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
  amenities: string;
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  images: { url: string; isPrimary: boolean; order: number }[];
  bookings: { id: string; checkIn: string; checkOut: string; status: string }[];
  reviews: { id: string; rating: number; comment: string; createdAt: string }[];
  _count: {
    bookings: number;
    reviews: number;
  };
}

export default function HostPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [updatingProperty, setUpdatingProperty] = useState<string | null>(null);

  const loadProperties = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get auth token
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No auth token found');
      }

      // Build query parameters
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      // Fetch real data from API
      const response = await fetch(`/api/host/properties?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }

      const data = await response.json();
      setProperties(data.properties);
    } catch (error) {
      console.error('Failed to load properties:', error);
      toast.error('Failed to load properties');
      // Fallback to empty array
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterStatus]);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const togglePropertyStatus = async (property: Property) => {
    try {
      setUpdatingProperty(property.id);
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch(`/api/admin/properties/${property.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !property.isActive,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || 'Failed to update property');
        return;
      }

      const updatedProperty = await response.json();
      setProperties(properties.map(p => 
        p.id === property.id 
          ? { ...p, isActive: updatedProperty.property.isActive }
          : p
      ));
      toast.success(`Property ${updatedProperty.property.isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Toggle property status error:', error);
      toast.error('Failed to update property status');
    } finally {
      setUpdatingProperty(null);
    }
  };

  const getStatusBadge = (property: Property) => {
    if (!property.isActive) {
      return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
    }
    if (property.isFeatured) {
      return <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">Active</Badge>;
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && property.isActive) ||
      (filterStatus === 'inactive' && !property.isActive);
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#03c3d7] mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
          <p className="text-gray-600 mt-2">Manage your property listings</p>
        </div>
        <Link href="/host/properties/new">
          <Button className="bg-[#03c3d7] hover:bg-[#00abbc]">
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
                className={filterStatus === 'all' ? 'bg-[#03c3d7] hover:bg-[#00abbc]' : ''}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('active')}
                className={filterStatus === 'active' ? 'bg-[#03c3d7] hover:bg-[#00abbc]' : ''}
              >
                Active
              </Button>
              <Button
                variant={filterStatus === 'inactive' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('inactive')}
                className={filterStatus === 'inactive' ? 'bg-[#03c3d7] hover:bg-[#00abbc]' : ''}
              >
                Inactive
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Card key={property.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <div className="relative h-48 rounded-t-lg overflow-hidden">
                <Image
                  src={property.images[0]?.url || '/Images/properties/placeholder.webp'}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  {getStatusBadge(property)}
                </div>
                <div className="absolute bottom-2 left-2">
                  <Badge variant="secondary" className="bg-black/70 text-white">
                    ₵{property.price.toLocaleString()}/night
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 line-clamp-1">{property.title}</h3>
                  <p className="text-sm text-gray-600 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {property.location}
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Home className="h-4 w-4" />
                      <span>{property.bedrooms} bed</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{property.maxGuests} guests</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{property.rating}</span>
                    <span className="text-gray-400">({property.reviewCount})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{property._count.bookings} bookings</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4" />
                      <span>{property._count.reviews} reviews</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Created {new Date(property.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Link href={`/property/${property.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/host/properties/${property.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => togglePropertyStatus(property)}
                      disabled={updatingProperty === property.id}
                      className={property.isActive ? "text-green-600 hover:text-green-700" : "text-gray-600 hover:text-gray-700"}
                      title={property.isActive ? "Deactivate property" : "Activate property"}
                    >
                      {updatingProperty === property.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : property.isActive ? (
                        <PowerOff className="h-4 w-4" />
                      ) : (
                        <Power className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first property'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <Link href="/host/properties/new">
              <Button className="bg-[#03c3d7] hover:bg-[#00abbc]">
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
} 