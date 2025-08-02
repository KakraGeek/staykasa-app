'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, User, Mail, Phone, Building2, Calendar, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface HostApplication {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  experience: string;
  properties: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export default function HostApplicationsPage() {
  const [applications, setApplications] = useState<HostApplication[]>([]);
  const [loading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<HostApplication | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadApplications();
  }, [statusFilter]);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch(`/api/host-applications?status=${statusFilter}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const data = await response.json();
      setApplications(data.applications || []);
    } catch (error) {
      console.error('Error loading applications:', error);
      toast.error('Failed to load host applications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplicationAction = async (applicationId: string, action: 'approve' | 'reject') => {
    try {
      setActionLoading(applicationId);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch(`/api/host-applications/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update application');
      }

      const data = await response.json();
      toast.success(`Application ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      
      // Reload applications
      loadApplications();
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'APPROVED':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive" className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getBusinessTypeLabel = (type: string) => {
    switch (type) {
      case 'INDIVIDUAL': return 'Individual Property Owner';
      case 'PROPERTY_MANAGEMENT': return 'Property Management Company';
      case 'REAL_ESTATE': return 'Real Estate Agency';
      case 'HOTEL': return 'Hotel/Hospitality Business';
      case 'OTHER': return 'Other';
      default: return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredApplications = applications.filter(app => 
    statusFilter === 'all' || app.status === statusFilter
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#133736] mb-2">Host Applications</h1>
          <p className="text-[#50757c]">Review and manage host applications</p>
        </div>
        <Button
          onClick={loadApplications}
          disabled={loading}
          className="bg-[#03c3d7] hover:bg-[#00abbc] text-white"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#133736]">Filter by status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-[#50757c]">
            {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin text-[#03c3d7]" />
            <span className="text-lg text-[#50757c]">Loading applications...</span>
          </div>
        </div>
      ) : filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-[#50757c] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#133736] mb-2">No applications found</h3>
            <p className="text-[#50757c]">
              {statusFilter === 'all' 
                ? 'No host applications have been submitted yet.'
                : `No ${statusFilter.toLowerCase()} applications found.`
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredApplications.map((application) => (
            <Card key={application.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#03c3d7] rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {application.firstName} {application.lastName}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {application.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {application.phone}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(application.status)}
                    <span className="text-sm text-[#50757c]">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      {formatDate(application.createdAt)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-[#133736] mb-2 flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Business Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Business Name:</span> {application.businessName}</p>
                        <p><span className="font-medium">Business Type:</span> {getBusinessTypeLabel(application.businessType)}</p>
                        <p><span className="font-medium">Properties:</span> {application.properties}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-[#133736] mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Experience & Motivation
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Experience:</span></p>
                        <p className="text-[#50757c] bg-gray-50 p-2 rounded">{application.experience}</p>
                        <p><span className="font-medium">Reason:</span></p>
                        <p className="text-[#50757c] bg-gray-50 p-2 rounded">{application.reason}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {application.status === 'PENDING' && (
                  <div className="flex gap-3 mt-6 pt-6 border-t">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          onClick={() => setSelectedApplication(application)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve Application
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Approve Host Application</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to approve this host application? This will create a new host account for {application.firstName} {application.lastName} and send them login credentials.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleApplicationAction(application.id, 'approve')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Approve
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          onClick={() => setSelectedApplication(application)}
                          variant="destructive"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject Application
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reject Host Application</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to reject this host application? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleApplicationAction(application.id, 'reject')}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Reject
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 