'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  MessageSquare,
  User,
  Calendar,
  Eye,
  Reply,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender: {
    firstName: string;
    lastName: string;
    email: string;
  };
  recipient: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch('/api/admin/messages');
      // const data = await response.json();
      
      // Mock data for now
      setTimeout(() => {
        setMessages([
          {
            id: '1',
            content: 'Hi, I have a question about my booking for the Luxury Villa. Can you help me with the check-in process?',
            isRead: false,
            createdAt: '2024-01-15T10:30:00Z',
            sender: {
              firstName: 'Sarah',
              lastName: 'Guest',
              email: 'guest@staykasa.com',
            },
            recipient: {
              firstName: 'John',
              lastName: 'Host',
              email: 'host@staykasa.com',
            },
          },
          {
            id: '2',
            content: 'Thank you for the wonderful stay! The apartment was perfect and the location was amazing.',
            isRead: true,
            createdAt: '2024-01-14T15:45:00Z',
            sender: {
              firstName: 'Mary',
              lastName: 'Business',
              email: 'mary@business.com',
            },
            recipient: {
              firstName: 'John',
              lastName: 'Host',
              email: 'host@staykasa.com',
            },
          },
          {
            id: '3',
            content: 'Is there parking available at the Beachfront Apartment? I\'m planning to drive there.',
            isRead: false,
            createdAt: '2024-01-13T09:15:00Z',
            sender: {
              firstName: 'David',
              lastName: 'Family',
              email: 'david@family.com',
            },
            recipient: {
              firstName: 'Sarah',
              lastName: 'Manager',
              email: 'sarah@staykasa.com',
            },
          },
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.sender.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.sender.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.sender.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const unreadCount = messages.filter(message => !message.isRead).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#03c3d7] mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Manage all messages in the system</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge className="bg-red-100 text-red-800">
            {unreadCount} unread
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Messages</p>
                <p className="text-xl font-bold">{messages.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Read</p>
                <p className="text-xl font-bold">
                  {messages.filter(m => m.isRead).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-xl font-bold">{unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search messages by sender or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <Card>
        <CardHeader>
          <CardTitle>All Messages ({filteredMessages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <div 
                key={message.id} 
                className={`p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
                  !message.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-[#03c3d7] rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {message.sender.firstName.charAt(0)}{message.sender.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {message.sender.firstName} {message.sender.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{message.sender.email}</p>
                      </div>
                      {!message.isRead && (
                        <Badge className="bg-red-100 text-red-800">Unread</Badge>
                      )}
                    </div>
                    
                    <div className="ml-13">
                      <p className="text-gray-700 mb-2">{message.content}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            To: {message.recipient.firstName} {message.recipient.lastName}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(message.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Reply className="h-4 w-4 mr-1" />
                            Reply
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 