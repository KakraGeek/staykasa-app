'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Shield,
  Bell,
  Globe,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function HostSettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [notifications, setNotifications] = useState({
    newBookings: true,
    bookingUpdates: true,
    newReviews: true,
    messages: true,
    earnings: false,
  });
  const [preferences, setPreferences] = useState({
    autoConfirmBookings: false,
    instantBooking: true,
    flexibleCancellation: true,
    showContactInfo: true,
  });

  const handleProfileSave = async () => {
    try {
      setLoading(true);
      // TODO: Implement profile update API
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    toast.success('Notification settings updated!');
  };

  const handlePreferenceChange = (key: string, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    toast.success('Preference updated!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your profile and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profile Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <Button 
              onClick={handleProfileSave} 
              disabled={loading}
              className="w-full bg-[#03c3d7] hover:bg-[#00abbc]"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">New Bookings</Label>
                <p className="text-xs text-gray-600">Get notified when someone books your property</p>
              </div>
              <Switch
                checked={notifications.newBookings}
                onCheckedChange={(checked: boolean) => handleNotificationChange('newBookings', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Booking Updates</Label>
                <p className="text-xs text-gray-600">Notifications about booking changes</p>
              </div>
              <Switch
                checked={notifications.bookingUpdates}
                onCheckedChange={(checked: boolean) => handleNotificationChange('bookingUpdates', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">New Reviews</Label>
                <p className="text-xs text-gray-600">When guests leave reviews</p>
              </div>
              <Switch
                checked={notifications.newReviews}
                onCheckedChange={(checked: boolean) => handleNotificationChange('newReviews', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Messages</Label>
                <p className="text-xs text-gray-600">Guest messages and inquiries</p>
              </div>
              <Switch
                checked={notifications.messages}
                onCheckedChange={(checked: boolean) => handleNotificationChange('messages', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Earnings Reports</Label>
                <p className="text-xs text-gray-600">Weekly and monthly earnings summaries</p>
              </div>
              <Switch
                checked={notifications.earnings}
                onCheckedChange={(checked: boolean) => handleNotificationChange('earnings', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Booking Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Booking Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Auto-Confirm Bookings</Label>
                <p className="text-xs text-gray-600">Automatically accept booking requests</p>
              </div>
              <Switch
                checked={preferences.autoConfirmBookings}
                onCheckedChange={(checked: boolean) => handlePreferenceChange('autoConfirmBookings', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Instant Booking</Label>
                <p className="text-xs text-gray-600">Allow guests to book without approval</p>
              </div>
              <Switch
                checked={preferences.instantBooking}
                onCheckedChange={(checked: boolean) => handlePreferenceChange('instantBooking', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Flexible Cancellation</Label>
                <p className="text-xs text-gray-600">Allow free cancellation up to 24h before</p>
              </div>
              <Switch
                checked={preferences.flexibleCancellation}
                onCheckedChange={(checked: boolean) => handlePreferenceChange('flexibleCancellation', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Show Contact Info</Label>
                <p className="text-xs text-gray-600">Display your contact information to guests</p>
              </div>
              <Switch
                checked={preferences.showContactInfo}
                onCheckedChange={(checked: boolean) => handlePreferenceChange('showContactInfo', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Change Password</Label>
              <p className="text-xs text-gray-600 mb-2">Update your account password</p>
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
            </div>
            <div>
              <Label className="text-sm font-medium">Two-Factor Authentication</Label>
              <p className="text-xs text-gray-600 mb-2">Add an extra layer of security</p>
              <Button variant="outline" className="w-full">
                Enable 2FA
              </Button>
            </div>
            <div>
              <Label className="text-sm font-medium">Account Verification</Label>
              <p className="text-xs text-gray-600 mb-2">Verify your identity for better trust</p>
              <Button variant="outline" className="w-full">
                Verify Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-red-600">Delete Account</Label>
            <p className="text-xs text-gray-600 mb-2">Permanently delete your account and all data</p>
            <Button variant="destructive" className="w-full">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 