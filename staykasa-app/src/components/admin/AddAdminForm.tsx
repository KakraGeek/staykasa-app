'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface AddAdminFormProps {
  onSuccess?: () => void;
}

export default function AddAdminForm({ onSuccess }: AddAdminFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          role: 'ADMIN'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('New admin user created successfully!');
        setFormData({ firstName: '', lastName: '', email: '', password: '' });
        onSuccess?.();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to create admin user');
      }
    } catch (error) {
      toast.error('An error occurred while creating the admin user');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form id="add-admin-form" onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder="Enter first name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            required
            placeholder="Enter last name"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Enter email address"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Temporary Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="Enter temporary password"
          minLength={6}
        />
        <p className="text-sm text-muted-foreground">
          The new admin will be prompted to change this password on their first login.
        </p>
      </div>
      
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating Admin...' : 'Create Admin User'}
      </Button>
    </form>
  );
} 