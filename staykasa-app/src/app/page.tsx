'use client';

import { useEffect, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PropertyCard } from "@/components/ui/property-card";
import { Search, MapPin, Star, Users, Calendar, Loader2 } from "lucide-react";
import { propertyApi, type Property } from "@/lib/api";
import toast from "react-hot-toast";
import Head from 'next/head';

export default function Home() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProperties();
  }, []);

  const loadFeaturedProperties = async () => {
    try {
      setLoading(true);
      // Set a timeout for the API call to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('API_TIMEOUT')), 3000)
      );
      
      // Load all properties instead of just featured ones to show all available properties
      const propertiesPromise = propertyApi.getProperties();
      const properties = await Promise.race([propertiesPromise, timeoutPromise]) as Property[];
      
      console.log('API returned properties:', properties);
      
      // If API returns empty array or no properties, use fallback data
      if (!properties || properties.length === 0) {
        console.log('API returned empty array, using fallback data');
        throw new Error('EMPTY_API_RESPONSE');
      }
      
      setFeaturedProperties(properties);
    } catch (error) {
      console.error('Failed to load properties:', error);
      
      // Check if it's a database connection error, timeout, or empty response
      if (error instanceof Error && (error.message === 'DATABASE_CONNECTION_FAILED' || error.message === 'API_TIMEOUT' || error.message === 'EMPTY_API_RESPONSE')) {
        console.log('Using fallback data due to:', error.message);
      }
      
      console.log('Using fallback data for properties');
      // Silently fallback to mock data if API fails (no error toast)
      const fallbackData = [
        {
          id: "1",
          title: "Luxury Villa in Accra",
          description: "Stunning luxury villa with modern amenities",
          location: "East Legon, Accra",
          address: "123 Luxury Lane",
          city: "Accra",
          country: "Ghana",
          price: 2500,
          maxGuests: 4,
          bedrooms: 2,
          baths: 2,
          amenities: JSON.stringify(["WiFi", "Pool", "Kitchen", "Parking"]),
          images: [{ id: "1", url: "/Images/properties/luxury-villa-accra.webp", isPrimary: true, order: 0 }],
          isActive: true,
          isFeatured: true,
          rating: 4.9,
          reviewCount: 24,
          ownerId: "owner1",
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01"
        },
        {
          id: "2",
          title: "Beachfront Apartment",
          description: "Beautiful beachfront apartment with ocean views",
          location: "Kokrobite Beach",
          address: "456 Beach Road",
          city: "Accra",
          country: "Ghana",
          price: 1800,
          maxGuests: 6,
          bedrooms: 3,
          baths: 2,
          amenities: JSON.stringify(["WiFi", "Kitchen", "Air Conditioning", "Beach Access"]),
          images: [{ id: "2", url: "/Images/properties/beachfront-apartment.webp", isPrimary: true, order: 0 }],
          isActive: true,
          isFeatured: true,
          rating: 4.7,
          reviewCount: 18,
          ownerId: "owner2",
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01"
        },
        {
          id: "3",
          title: "City Center Studio",
          description: "Modern studio in the heart of the city",
          location: "Osu, Accra",
          address: "789 Main Street",
          city: "Accra",
          country: "Ghana",
          price: 1200,
          maxGuests: 2,
          bedrooms: 1,
          baths: 1,
          amenities: JSON.stringify(["WiFi", "Kitchen", "Air Conditioning"]),
          images: [{ id: "3", url: "/Images/properties/city-center-studio.webp", isPrimary: true, order: 0 }],
          isActive: true,
          isFeatured: true,
          rating: 4.8,
          reviewCount: 32,
          ownerId: "owner3",
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01"
        }
      ];
      console.log('Fallback data:', fallbackData);
      console.log('Setting featured properties with fallback data');
      setFeaturedProperties(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "StayKasa",
    "description": "Ghana's premier short-let and vacation rental platform",
    "url": "https://staykasa.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://staykasa.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "sameAs": [
      "https://facebook.com/staykasa",
      "https://twitter.com/staykasa",
      "https://instagram.com/staykasa"
    ]
  };

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "StayKasa",
    "url": "https://staykasa.com",
    "logo": "https://staykasa.com/Images/logo.webp",
    "description": "Ghana's premier vacation rental platform",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "GH",
      "addressLocality": "Accra",
      "addressRegion": "Greater Accra"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+233-20-211-3633",
      "contactType": "customer service",
      "availableLanguage": "English"
    }
  };

  return (
    <>
      <Head>
        <title>StayKasa - Home</title>
        <meta name="description" content="Discover Ghana's finest vacation rentals and short-let accommodations in Accra, Kumasi & beyond. Book directly with local payment support (Mobile Money, Cards). Trusted by 1000+ guests." />
        <meta name="keywords" content="Short let Accra, Vacation rental Ghana, Accra Airbnb, Ghana holiday homes, Accra serviced apartments, Short stay accommodation Ghana" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="StayKasa Team" />
        <meta name="geo.region" content="GH" />
        <meta name="geo.placename" content="Accra, Ghana" />
        <meta name="geo.position" content="5.6145;-0.1869" />
        <meta name="ICBM" content="5.6145, -0.1869" />
        
        {/* Open Graph */}
        <meta property="og:title" content="StayKasa - Ghana's Premier Short-Let & Vacation Rental Platform" />
        <meta property="og:description" content="Book Ghana's finest vacation rentals directly. Support for Mobile Money, VISA, Mastercard. Verified properties in Accra, Kumasi & beyond." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://staykasa.com" />
        <meta property="og:image" content="https://staykasa.com/Images/logo.webp" />
        <meta property="og:site_name" content="StayKasa" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="StayKasa - Ghana Vacation Rental Platform" />
        <meta name="twitter:description" content="Book Ghana's finest vacation rentals directly with local payment support" />
        <meta name="twitter:image" content="https://staykasa.com/Images/logo.webp" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-[#03c3d7]/15 via-[#84a9ae]/10 to-[#133736]/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center bg-gradient-to-b from-[#03c3d7]/10 to-transparent">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#03c3d7] via-[#84a9ae] to-[#00abbc] bg-clip-text text-transparent">
            Your Trusted Short-Stay Platform in Ghana
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Discover beautiful vacation rentals and experience authentic Ghanaian hospitality. 
            Book directly with local payment support including Mobile Money and cards.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex flex-col md:flex-row gap-4 p-6 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 backdrop-blur-sm rounded-2xl shadow-xl border border-primary/20">
              <div className="flex flex-col flex-1">
                <label className="text-xs font-medium text-[#133736] mb-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                  <input
                    type="text"
                    placeholder="Where do you want to stay?"
                    className="w-full pl-10 pr-4 py-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background/50"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-[#133736] mb-1">Start date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                      type="date"
                      className="pl-10 pr-4 py-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background/50 min-w-[140px]"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-[#133736] mb-1">End date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                      type="date"
                      className="pl-10 pr-4 py-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background/50 min-w-[140px]"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-[#133736] mb-1">Guests</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                      type="number"
                      placeholder="Guests"
                      min="1"
                      max="20"
                      className="pl-10 pr-4 py-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background/50 w-24"
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-end">
                  <Button className="px-8 bg-[#03c3d7] hover:bg-[#00abbc] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 h-[42px]">
                    <Search className="mr-2" size={20} />
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
              <Star className="text-yellow-500" size={16} />
              <span className="text-primary font-medium">4.8/5 Guest Rating</span>
            </div>
            <div className="flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full">
              <Users className="text-secondary" size={16} />
              <span className="text-secondary font-medium">1000+ Happy Guests</span>
            </div>
            <div className="flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full">
              <Calendar className="text-accent" size={16} />
              <span className="text-accent font-medium">Instant Booking</span>
            </div>
          </div>
        </div>
      </section>

      {/* Listings Preview */}
      <section id="listings" className="container mx-auto px-4 py-20 bg-gradient-to-b from-secondary/5 to-transparent">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Featured Properties
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Handpicked vacation rentals in Ghana's most beautiful locations
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-lg text-[#50757c]">Loading properties...</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties?.map((property) => {
              const imagePath = property.images && property.images.length > 0 ? property.images[0].url : '';
              console.log('Property:', property.title, 'Image path:', imagePath);
              return (
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
                  badge={{ text: "Featured", variant: "default" }}
                  imagePath={imagePath}
                  placeholderType="default"
                />
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <Button size="lg" className="bg-[#03c3d7] hover:bg-[#00abbc] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
            View All Properties
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/15 py-20 border-t border-b border-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Why Choose StayKasa?
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              We're building the future of short-stay accommodation in Ghana with local expertise and global standards.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm border border-primary/20 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-primary/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-primary">Local Expertise</h3>
                <p className="text-muted-foreground">
                  Deep understanding of Ghanaian hospitality and local payment methods
                </p>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-secondary/10 to-secondary/5 backdrop-blur-sm border border-secondary/20 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Calendar className="text-secondary" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-secondary">Instant Booking</h3>
                <p className="text-muted-foreground">
                  Book directly with secure payments via Mobile Money and cards
                </p>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 backdrop-blur-sm border border-accent/20 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-accent/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Star className="text-accent" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-accent">Quality Assured</h3>
                <p className="text-muted-foreground">
                  All properties verified and maintained to high standards
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-white/95 text-[#133736] py-12 border-t border-[#03c3d7]/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-center md:text-left">
              <h3 className="font-semibold mb-4 text-[#03c3d7]">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/search" className="text-[#50757c] hover:text-[#03c3d7] transition-colors font-medium">Find Stays</Link></li>
                <li><Link href="/become-host" className="text-[#50757c] hover:text-[#03c3d7] transition-colors font-medium">Become a Host</Link></li>
                <li><Link href="/about" className="text-[#50757c] hover:text-[#03c3d7] transition-colors font-medium">About Us</Link></li>
                <li><Link href="/contact" className="text-[#50757c] hover:text-[#03c3d7] transition-colors font-medium">Contact</Link></li>
              </ul>
            </div>
            
            <div className="text-center md:text-left">
              <h3 className="font-semibold mb-4 text-[#03c3d7]">Contact</h3>
              <ul className="space-y-2">
                <li className="text-[#50757c] font-medium">Email: hello@staykasa.com</li>
                <li className="text-[#50757c] font-medium">Phone: +233(0)20.211.3633</li>
                <li className="text-[#50757c] font-medium">WhatsApp: +233(0)20.211.3633</li>
              </ul>
            </div>
          </div>
          
          <div className="text-center mt-8 pt-8 border-t border-[#03c3d7]/20">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-3 rounded-xl shadow-lg">
                <Image
                  src="/Images/logo.webp"
                  alt="StayKasa Logo"
                  width={32}
                  height={32}
                  className="rounded shadow-md filter drop-shadow-md"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-[#03c3d7] to-[#00abbc] bg-clip-text text-transparent drop-shadow-sm">
                  StayKasa
                </span>
              </div>
            </div>
            <p className="text-[#50757c] font-medium mb-4">
              Your trusted short-stay platform in Ghana
            </p>
            <p className="text-[#50757c] font-medium">&copy; 2025 StayKasa. All rights reserved. | Powered by The Geek Toolbox</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
