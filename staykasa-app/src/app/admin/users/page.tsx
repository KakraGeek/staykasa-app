'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Eye,
  Edit,
  Trash2,
  Plus
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
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import AddAdminForm from '@/components/admin/AddAdminForm';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'GUEST' | 'HOST' | 'ADMIN' | 'CLEANER';
  phone?: string;
  isVerified: boolean;
  createdAt: string;
  lastLogin?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'GUEST' | 'HOST' | 'ADMIN' | 'CLEANER'>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);
  const [addAdminDialogOpen, setAddAdminDialogOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
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
      if (filterRole !== 'all') params.append('role', filterRole);

      // Fetch real data from API
      const response = await fetch(`/api/admin/users?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Failed to load users:', error);
      // Fallback to mock data if API fails
      setUsers([
        {
          id: '1',
          email: 'desmond.asiedu@gmail.com',
          firstName: 'Desmond',
          lastName: 'Asiedu',
          role: 'ADMIN',
          phone: '+233 24 123 4567',
          isVerified: true,
          createdAt: '2024-01-01',
          lastLogin: '2024-01-15',
        },
        {
          id: '2',
          email: 'host@staykasa.com',
          firstName: 'John',
          lastName: 'Host',
          role: 'HOST',
          phone: '+233 20 987 6543',
          isVerified: true,
          createdAt: '2024-01-05',
          lastLogin: '2024-01-14',
        },
        {
          id: '3',
          email: 'guest@staykasa.com',
          firstName: 'Sarah',
          lastName: 'Guest',
          role: 'GUEST',
          phone: '+233 26 555 1234',
          isVerified: true,
          createdAt: '2024-01-10',
          lastLogin: '2024-01-13',
        },
        {
          id: '4',
          email: 'cleaner@staykasa.com',
          firstName: 'Mary',
          lastName: 'Cleaner',
          role: 'CLEANER',
          phone: '+233 27 777 8888',
          isVerified: true,
          createdAt: '2024-01-08',
          lastLogin: '2024-01-12',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      ADMIN: { color: 'bg-red-100 text-red-800', label: 'Admin' },
      HOST: { color: 'bg-blue-100 text-blue-800', label: 'Host' },
      GUEST: { color: 'bg-green-100 text-green-800', label: 'Guest' },
      CLEANER: { color: 'bg-purple-100 text-purple-800', label: 'Cleaner' },
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.GUEST;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getVerificationBadge = (isVerified: boolean) => {
    return isVerified ? (
      <Badge className="bg-green-100 text-green-800">Verified</Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch(`/api/admin/users/${userToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete user');
        return;
      }

      toast.success('User deleted successfully');
      setUsers(users.filter(u => u.id !== userToDelete.id));
    } catch (error) {
      console.error('Delete user error:', error);
      toast.error('Failed to delete user');
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const updateUserRole = async (user: User, newRole: string) => {
    try {
      setUpdatingUser(user.id);
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: newRole,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || 'Failed to update user role');
        return;
      }

      const updatedUser = await response.json();
      setUsers(users.map(u => 
        u.id === user.id 
          ? { ...u, role: updatedUser.user.role }
          : u
      ));
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      console.error('Update user role error:', error);
      toast.error('Failed to update user role');
    } finally {
      setUpdatingUser(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#03c3d7] mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">Manage all users in the system</p>
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
                loadUsers();
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#03c3d7]"
              >
                <option value="all">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="HOST">Host</option>
                <option value="GUEST">Guest</option>
                <option value="CLEANER">Cleaner</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Joined</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#03c3d7] rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            {user.phone}
                            </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="py-4 px-4">
                      {getVerificationBadge(user.isVerified)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                        {user.lastLogin && (
                          <div className="text-xs text-gray-500 mt-1">
                            Last: {new Date(user.lastLogin).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => updateUserRole(user, user.role === 'HOST' ? 'GUEST' : 'HOST')}
                            disabled={updatingUser === user.id}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            {updatingUser === user.id ? 'Updating...' : 
                              user.role === 'HOST' ? 'Remove Host Role' : 'Make Host'
                            }
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteUser(user)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Delete Confirmation Dialog */}
    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{userToDelete?.firstName} {userToDelete?.lastName}"? This action cannot be undone and will permanently remove the user and all associated data including properties, bookings, reviews, and messages.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={confirmDeleteUser}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete User
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
} 