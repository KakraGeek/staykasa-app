import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PropertyPlaceholder } from "./property-placeholder";
import { MapPin, Star } from "lucide-react";

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: string;
  guests: number;
  bedrooms: number;
  baths: number;
  rating: number;
  badge?: {
    text: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  };
  imagePath?: string;
  placeholderType: 'luxury' | 'beachfront' | 'city' | 'default';
}

export function PropertyCard({
  id,
  title,
  location,
  price,
  guests,
  bedrooms,
  baths,
  rating,
  badge,
  imagePath,
  placeholderType
}: PropertyCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative h-64">
        <div className="absolute inset-4">
          {imagePath ? (
            <img
              src={imagePath}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-lg"
            />
          ) : (
            <PropertyPlaceholder type={placeholderType} className="h-full rounded-lg" />
          )}
        </div>
        
        {badge && (
          <Badge className={`absolute top-4 left-4 ${badge.variant === 'default' ? 'bg-primary text-white' : 
            badge.variant === 'secondary' ? 'bg-secondary text-white' : 
            badge.variant === 'destructive' ? 'bg-destructive text-white' : 
            'bg-accent text-white'}`}>
            {badge.text}
          </Badge>
        )}
      </div>
      
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">{title}</span>
          <span className="text-primary font-bold text-lg">{price}</span>
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <MapPin size={16} />
          {location}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <span>{guests} guests • {bedrooms} bedrooms • {baths} baths</span>
          <div className="flex items-center gap-1">
            <Star className="text-yellow-500" size={14} />
            <span>{rating}</span>
          </div>
        </div>
        <Link href={`/property/${id}`}>
          <button className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-all duration-300 font-medium shadow-lg hover:shadow-xl">
            View Details
          </button>
        </Link>
      </CardContent>
    </Card>
  );
} 