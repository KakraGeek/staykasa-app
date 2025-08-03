'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar as CalendarIcon, Users, X, Check } from 'lucide-react';
import { addMonths, startOfMonth, endOfMonth } from 'date-fns';
import type { DateRange } from 'react-day-picker';

interface AvailabilityData {
  date: string;
  isAvailable: boolean;
  bookedGuests: number;
  availableGuests: number;
  isFullyBooked: boolean;
}

interface AvailabilityCalendarProps {
  propertyId: string;
  maxGuests: number;
  onDateSelect?: (date: Date) => void;
  selectedDates?: DateRange;
  onDateRangeSelect?: (range: DateRange) => void;
  className?: string;
}

export function AvailabilityCalendar({
  propertyId,
  onDateSelect,
  selectedDates,
  onDateRangeSelect,
  className
}: AvailabilityCalendarProps) {
  const [availability, setAvailability] = useState<AvailabilityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [error, setError] = useState<string | null>(null);

  // Fetch availability data
  const fetchAvailability = useCallback(async (startDate: Date, endDate: Date) => {
    try {
      setLoading(true);
      setError(null);

      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      const response = await fetch(
        `/api/properties/${propertyId}/availability?startDate=${startDateStr}&endDate=${endDateStr}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch availability');
      }

      const data = await response.json();
      setAvailability(data.availability);
    } catch (err) {
      console.error('Error fetching availability:', err);
      setError('Failed to load availability data');
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  // Load availability when component mounts or month changes
  useEffect(() => {
    const startDate = startOfMonth(currentMonth);
    const endDate = endOfMonth(addMonths(currentMonth, 2)); // Load 3 months of data
    fetchAvailability(startDate, endDate);
  }, [propertyId, currentMonth, fetchAvailability]);

  // Create a map for quick availability lookup
  const availabilityMap = new Map(
    availability.map(item => [item.date, item])
  );

  // Handle month navigation
  const handleMonthChange = (month: Date) => {
    setCurrentMonth(month);
  };

  // Handle date selection
  const handleDateSelect = (range: DateRange | undefined) => {
    if (!range) return;

    if (onDateRangeSelect) {
      onDateRangeSelect(range);
    }

    // For single date selection, use the from date
    if (onDateSelect && range.from) {
      onDateSelect(range.from);
    }
  };

  // Calculate availability summary
  const availabilitySummary = {
    available: availability.filter(d => d.isAvailable && !d.isFullyBooked).length,
    partiallyBooked: availability.filter(d => d.bookedGuests > 0 && !d.isFullyBooked).length,
    fullyBooked: availability.filter(d => d.isFullyBooked).length,
  };

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Availability Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-red-500 mb-2">⚠️</div>
            <p className="text-sm text-gray-600">{error}</p>
            <button
              onClick={() => fetchAvailability(startOfMonth(currentMonth), endOfMonth(addMonths(currentMonth, 2)))}
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Availability Calendar
        </CardTitle>
        <CardDescription>
          Select your preferred dates to check availability
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="ml-2 text-sm text-gray-600">Loading availability...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Availability Summary */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <Check className="h-3 w-3 mr-1" />
                {availabilitySummary.available} Available
              </Badge>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                <Users className="h-3 w-3 mr-1" />
                {availabilitySummary.partiallyBooked} Partially Booked
              </Badge>
              <Badge variant="secondary" className="bg-red-100 text-red-700">
                <X className="h-3 w-3 mr-1" />
                {availabilitySummary.fullyBooked} Fully Booked
              </Badge>
            </div>

            {/* Calendar */}
            <Calendar
              mode="range"
              selected={selectedDates}
              onSelect={handleDateSelect}
              onMonthChange={handleMonthChange}
              disabled={(date) => {
                const dateString = date.toISOString().split('T')[0];
                const dayData = availabilityMap.get(dateString);
                return date < new Date() || (dayData?.isFullyBooked ?? false);
              }}
              className="rounded-md border"
              classNames={{
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                day_selected: "bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-500",
                day_today: "bg-blue-100 text-blue-900",
                day_outside: "text-gray-400 opacity-50",
                day_disabled: "text-gray-400 opacity-50",
                day_range_middle: "aria-selected:bg-blue-100 aria-selected:text-blue-900",
                day_range_end: "bg-blue-500 text-white",
                day_range_start: "bg-blue-500 text-white",
              }}
            />

            {/* Legend */}
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Legend:</strong></p>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
                <span>Partially Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                <span>Fully Booked</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 