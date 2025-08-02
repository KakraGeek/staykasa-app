'use client';

import { useState } from 'react';
import { 
  Settings,
  Save,
  Globe,
  Mail,
  Shield,
  CreditCard,
  Bell,
  Database,
  Key,
  Users,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import ChangePasswordForm from '@/components/admin/ChangePasswordForm';
import AddAdminForm from '@/components/admin/AddAdminForm';

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [addAdminDialogOpen, setAddAdminDialogOpen] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'StayKasa',
    siteDescription: 'Premium vacation rentals in Ghana',
    contactEmail: 'support@staykasa.com',
    contactPhone: '+233 24 123 4567',
    address: 'Accra, Ghana',
    commissionRate: 15,
    maxImagesPerProperty: 10,
    autoApproveProperties: false,
    requireEmailVerification: true,
    enableReviews: true,
    enableMessaging: true,
    maintenanceMode: false,
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // await fetch('/api/admin/settings', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings),
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage system settings and configurations</p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={isLoading}
          className="bg-[#03c3d7] hover:bg-[#00abbc]"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Name
              </label>
              <Input
                value={settings.siteName}
                onChange={(e) => handleInputChange('siteName', e.target.value)}
                placeholder="Enter site name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Description
              </label>
              <Textarea
                value={settings.siteDescription}
                onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                placeholder="Enter site description"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              <Input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                placeholder="Enter contact email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Phone
              </label>
              <Input
                value={settings.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                placeholder="Enter contact phone"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <Input
                value={settings.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter address"
              />
            </div>
          </CardContent>
        </Card>

        {/* Business Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Business Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commission Rate (%)
              </label>
              <Input
                type="number"
                value={settings.commissionRate}
                onChange={(e) => handleInputChange('commissionRate', Number(e.target.value))}
                placeholder="Enter commission rate"
                min="0"
                max="100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Images Per Property
              </label>
              <Input
                type="number"
                value={settings.maxImagesPerProperty}
                onChange={(e) => handleInputChange('maxImagesPerProperty', Number(e.target.value))}
                placeholder="Enter max images"
                min="1"
                max="50"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Auto Approve Properties
                </label>
                <p className="text-xs text-gray-500">
                  Automatically approve new property listings
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoApproveProperties}
                onChange={(e) => handleInputChange('autoApproveProperties', e.target.checked)}
                className="h-4 w-4 text-[#03c3d7] focus:ring-[#03c3d7] border-gray-300 rounded"
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Require Email Verification
                </label>
                <p className="text-xs text-gray-500">
                  Users must verify their email before using the platform
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.requireEmailVerification}
                onChange={(e) => handleInputChange('requireEmailVerification', e.target.checked)}
                className="h-4 w-4 text-[#03c3d7] focus:ring-[#03c3d7] border-gray-300 rounded"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Maintenance Mode
                </label>
                <p className="text-xs text-gray-500">
                  Temporarily disable the platform for maintenance
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
                className="h-4 w-4 text-[#03c3d7] focus:ring-[#03c3d7] border-gray-300 rounded"
              />
            </div>
          </CardContent>
        </Card>

        {/* Feature Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Feature Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Enable Reviews
                </label>
                <p className="text-xs text-gray-500">
                  Allow users to leave reviews for properties
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.enableReviews}
                onChange={(e) => handleInputChange('enableReviews', e.target.checked)}
                className="h-4 w-4 text-[#03c3d7] focus:ring-[#03c3d7] border-gray-300 rounded"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Enable Messaging
                </label>
                <p className="text-xs text-gray-500">
                  Allow users to send messages to hosts
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.enableMessaging}
                onChange={(e) => handleInputChange('enableMessaging', e.target.checked)}
                className="h-4 w-4 text-[#03c3d7] focus:ring-[#03c3d7] border-gray-300 rounded"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Database className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Database</p>
                  <p className="text-xs text-gray-500">SQLite (Development)</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Key className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Environment</p>
                  <p className="text-xs text-gray-500">Development</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-purple-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Version</p>
                  <p className="text-xs text-gray-500">1.0.0</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Account Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <ChangePasswordForm />
          </div>
        </CardContent>
      </Card>

      {/* Admin User Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Admin User Management
            </div>
            <Dialog open={addAdminDialogOpen} onOpenChange={setAddAdminDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#03c3d7] hover:bg-[#00abbc] text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Admin
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Admin User</DialogTitle>
                  <DialogDescription>
                    Create a new admin user account. The new admin will receive an email with their login credentials.
                  </DialogDescription>
                </DialogHeader>
                <AddAdminForm 
                  onSuccess={() => {
                    setAddAdminDialogOpen(false);
                  }} 
                />
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setAddAdminDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    form="add-admin-form"
                    className="bg-[#03c3d7] hover:bg-[#00abbc]"
                  >
                    Create Admin
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Manage Admin Users</h3>
            <p className="text-gray-600 mb-4">
              Add new administrators to help manage the platform. Click the "Add Admin" button above to create a new admin account.
            </p>
            <p className="text-sm text-gray-500">
              You can also manage all users from the Users page in the admin dashboard.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 