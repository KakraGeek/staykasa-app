'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, User, Mail, Phone, FileText, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface HostApplicationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function HostApplicationForm({ onSuccess, onCancel }: HostApplicationFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: '',
    businessType: '',
    experience: '',
    properties: '',
    reason: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.firstName.trim()) errors.push('First name is required');
    if (!formData.lastName.trim()) errors.push('Last name is required');
    if (!formData.email.trim()) errors.push('Email is required');
    if (!formData.phone.trim()) errors.push('Phone number is required');
    if (!formData.businessName.trim()) errors.push('Business name is required');
    if (!formData.businessType) errors.push('Business type is required');
    if (!formData.experience.trim()) errors.push('Experience description is required');
    if (!formData.properties.trim()) errors.push('Number of properties is required');
    if (!formData.reason.trim()) errors.push('Reason for applying is required');

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    // Phone validation
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      errors.push('Please enter a valid phone number');
    }

    // Properties validation
    const propertiesNum = parseInt(formData.properties);
    if (formData.properties && (isNaN(propertiesNum) || propertiesNum < 1)) {
      errors.push('Please enter a valid number of properties (minimum 1)');
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/host-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      toast.success('Host application submitted successfully!');
      setIsSubmitted(true);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Application submission error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit application');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
            <p className="text-gray-600 mb-6">
              Thank you for your interest in becoming a host. We've received your application and will review it within 2-3 business days. You'll receive an email notification once your application has been processed.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => router.push('/')}
                className="w-full"
              >
                Back to Home
              </Button>
              <Button 
                variant="outline"
                onClick={() => setIsSubmitted(false)}
                className="w-full"
              >
                Submit Another Application
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Image
                src="/Images/logo.webp"
                alt="StayKasa Logo"
                width={40}
                height={40}
                className="rounded-lg shadow-md"
              />
              <span className="text-2xl font-bold text-[#133736]">StayKasa</span>
            </div>
            <CardTitle className="text-3xl font-bold text-[#133736] mb-2">
              Become a Host
            </CardTitle>
            <CardDescription className="text-lg">
              Join StayKasa as a host and start earning from your properties
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#133736] flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+233 20 123 4567"
                    />
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#133736] flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Business Information
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Your Business Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type *</Label>
                  <Select
                    value={formData.businessType}
                    onValueChange={(value) => handleSelectChange('businessType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INDIVIDUAL">Individual Property Owner</SelectItem>
                      <SelectItem value="PROPERTY_MANAGEMENT">Property Management Company</SelectItem>
                      <SelectItem value="REAL_ESTATE">Real Estate Agency</SelectItem>
                      <SelectItem value="HOTEL">Hotel/Hospitality Business</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="properties">Number of Properties *</Label>
                  <Input
                    id="properties"
                    name="properties"
                    type="number"
                    min="1"
                    required
                    value={formData.properties}
                    onChange={handleChange}
                    placeholder="1"
                  />
                </div>
              </div>

              {/* Experience & Reason */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#133736] flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Experience & Motivation
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="experience">Property Management Experience *</Label>
                  <Textarea
                    id="experience"
                    name="experience"
                    required
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="Describe your experience in property management, hosting, or real estate..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Why do you want to become a host? *</Label>
                  <Textarea
                    id="reason"
                    name="reason"
                    required
                    value={formData.reason}
                    onChange={handleChange}
                    placeholder="Tell us why you want to join StayKasa as a host..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6">
                {onCancel && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  className="flex-1 bg-[#03c3d7] hover:bg-[#00abbc] text-white font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>

              <p className="text-sm text-gray-500 text-center">
                By submitting this application, you agree to our terms of service and privacy policy. 
                We'll review your application and contact you within 2-3 business days.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 