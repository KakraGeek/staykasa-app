'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  MoreHorizontal,
  Home,
  Star,
  Calendar,
  Power,
  PowerOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  bedrooms: number;
  baths: number;
  maxGuests: number;
  images: { url: string; isPrimary: boolean }[];
  owner: {
    firstName: string;
    lastName: string;
  };
  createdAt: string;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [updatingProperty, setUpdatingProperty] = useState<string | null>(null);

  useEffect(() => {
            const abortController = new AbortController();
    
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Get auth token
        const token = localStorage.getItem('authToken');
        console.log('🔑 Properties - Auth token found:', !!token);
        
        if (!token) {
          throw new Error('No auth token found');
        }

        // Build query parameters
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (filterStatus !== 'all') params.append('status', filterStatus);
        params.append('t', Date.now().toString()); // Cache busting

        const url = `/api/admin/properties?${params.toString()}`;
        console.log('🌐 Properties - Fetching from:', url);

        // Fetch real data from API
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache',
          },
          signal: abortController.signal,
        });

        console.log('📡 Properties - Response status:', response.status);
        console.log('📡 Properties - Response ok:', response.ok);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Properties API Error Response:', errorText);
          throw new Error(`Failed to fetch properties: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('📊 Properties - Frontend received data:', {
          count: data.properties?.length || 0,
          properties: data.properties?.map((p: Property) => ({ id: p.id, title: p.title })) || []
        });
        setProperties(data.properties);
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('🔄 Properties API call was aborted');
          return;
        }
        console.error('❌ Failed to load properties:', error);
        console.log('🔄 Properties - Falling back to mock data...');
        // Fallback to mock data if API fails
        setProperties([
          {
            id: '1',
            title: 'Luxury Villa in Accra',
            location: 'East Legon, Accra',
            price: 2500,
            rating: 4.9,
            reviewCount: 24,
            isActive: true,
            isFeatured: true,
            bedrooms: 2,
            baths: 2,
            maxGuests: 4,
            images: [{ url: '/Images/properties/luxury-villa-accra.webp', isPrimary: true }],
            owner: { firstName: 'John', lastName: 'Host' },
            createdAt: '2024-01-15',
          },
          {
            id: '2',
            title: 'Beachfront Apartment',
            location: 'Kokrobite Beach',
            price: 1800,
            rating: 4.7,
            reviewCount: 18,
            isActive: true,
            isFeatured: true,
            bedrooms: 3,
            baths: 2,
            maxGuests: 6,
            images: [{ url: '/Images/properties/beachfront-apartment.webp', isPrimary: true }],
            owner: { firstName: 'Sarah', lastName: 'Manager' },
            createdAt: '2024-01-10',
          },
          {
            id: '3',
            title: 'City Center Studio',
            location: 'Osu, Accra',
            price: 1200,
            rating: 4.8,
            reviewCount: 15,
            isActive: true,
            isFeatured: false,
            bedrooms: 1,
            baths: 1,
            maxGuests: 2,
            images: [{ url: '/Images/properties/city-center-studio.webp', isPrimary: true }],
            owner: { firstName: 'David', lastName: 'Owner' },
            createdAt: '2024-01-08',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Cleanup function to abort the request if component unmounts
    return () => {
      abortController.abort();
    };
  }, []); // Empty dependency array to run only once

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && property.isActive) ||
                         (filterStatus === 'inactive' && !property.isActive);
    return matchesSearch && matchesFilter;
  });

  // Debug: Log the properties being rendered
  console.log('🔍 Properties being rendered:', {
    totalProperties: properties.length,
    filteredProperties: filteredProperties.length,
    propertyIds: filteredProperties.map(p => p.id),
    propertyTitles: filteredProperties.map(p => p.title)
  });

  // Check for duplicates in the filtered properties
  const duplicateIds = filteredProperties.filter((property, index, arr) => 
    arr.findIndex(p => p.id === property.id) !== index
  );
  
  if (duplicateIds.length > 0) {
    console.log('⚠️  Found duplicate properties in filtered results:', duplicateIds.map(p => ({ id: p.id, title: p.title })));
  }

  const getStatusBadge = (property: Property) => {
    if (!property.isActive) {
      return <Badge variant="destructive">Inactive</Badge>;
    }
    if (property.isFeatured) {
      return <Badge variant="default" className="bg-[#03c3d7]">Featured</Badge>;
    }
    return <Badge variant="secondary">Active</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#03c3d7] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  const handleDeleteProperty = (property: Property) => {
    setPropertyToDelete(property);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteProperty = async () => {
    if (!propertyToDelete) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch(`/api/admin/properties/${propertyToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete property');
        return;
      }

      toast.success('Property deleted successfully');
      setProperties(properties.filter(p => p.id !== propertyToDelete.id));
    } catch (error) {
      console.error('Delete property error:', error);
      toast.error('Failed to delete property');
    } finally {
      setDeleteDialogOpen(false);
      setPropertyToDelete(null);
    }
  };

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

  return (
    <>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600 mt-2">Manage all properties on the platform</p>
        </div>
        <Link href="/admin/properties/new">
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
        {filteredProperties.map((property, index) => (
          <Card key={`${property.id}-${index}`} className="hover:shadow-lg transition-shadow">
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
                  <p className="text-sm text-gray-600">{property.location}</p>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Home className="h-4 w-4" />
                      <span>{property.bedrooms} bed</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{property.maxGuests} guests</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{property.rating}</span>
                    <span className="text-gray-400">({property.reviewCount})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Owner: {property.owner.firstName} {property.owner.lastName}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Link href={`/property/${property.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin/properties/${property.id}/edit`}>
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
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteProperty(property)}
                      className="text-red-600 hover:text-red-700"
                      title="Delete property"
                    >
                      <Trash2 className="h-4 w-4" />
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
            <Link href="/admin/properties/new">
              <Button className="bg-[#03c3d7] hover:bg-[#00abbc]">
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>

    {/* Delete Confirmation Dialog */}
    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Property</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{propertyToDelete?.title}&quot;? This action cannot be undone and will permanently remove the property and all associated data including bookings, reviews, and images.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={confirmDeleteProperty}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete Property
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
} 