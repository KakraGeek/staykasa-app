'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Send,
  User,
  Calendar,
  MessageSquare,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  content: string;
  isFromHost: boolean;
  createdAt: string;
  booking?: {
    id: string;
    property: {
      title: string;
    };
    guest: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

export default function HostMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      
      // Get auth token
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No auth token found');
      }

      // For now, use mock data since we haven't implemented the messages API yet
      const mockMessages: Message[] = [
        {
          id: '1',
          content: 'Hi! I\'m interested in your beachfront apartment. Is it available for next weekend?',
          isFromHost: false,
          createdAt: '2024-01-15T10:30:00Z',
          booking: {
            id: 'booking1',
            property: { title: 'Beachfront Apartment' },
            guest: { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@example.com' }
          }
        },
        {
          id: '2',
          content: 'Yes, it\'s available! The weekend rate is ₵500 per night. Would you like to book it?',
          isFromHost: true,
          createdAt: '2024-01-15T11:00:00Z',
          booking: {
            id: 'booking1',
            property: { title: 'Beachfront Apartment' },
            guest: { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@example.com' }
          }
        },
        {
          id: '3',
          content: 'Perfect! I\'ll book it now. What time is check-in?',
          isFromHost: false,
          createdAt: '2024-01-15T11:15:00Z',
          booking: {
            id: 'booking1',
            property: { title: 'Beachfront Apartment' },
            guest: { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@example.com' }
          }
        },
        {
          id: '4',
          content: 'Check-in is at 3 PM. I\'ll send you the key code closer to your arrival date.',
          isFromHost: true,
          createdAt: '2024-01-15T11:30:00Z',
          booking: {
            id: 'booking1',
            property: { title: 'Beachfront Apartment' },
            guest: { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@example.com' }
          }
        },
        {
          id: '5',
          content: 'Hello! I have a question about the city center studio. Is parking included?',
          isFromHost: false,
          createdAt: '2024-01-14T09:00:00Z',
          booking: {
            id: 'booking2',
            property: { title: 'City Center Studio' },
            guest: { firstName: 'Mike', lastName: 'Davis', email: 'mike@example.com' }
          }
        },
        {
          id: '6',
          content: 'Hi Mike! Yes, parking is included. There\'s a dedicated parking spot in the building.',
          isFromHost: true,
          createdAt: '2024-01-14T09:30:00Z',
          booking: {
            id: 'booking2',
            property: { title: 'City Center Studio' },
            guest: { firstName: 'Mike', lastName: 'Davis', email: 'mike@example.com' }
          }
        }
      ];

      setMessages(mockMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
      toast.error('Failed to load messages');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      // For now, just add to local state
      const newMsg: Message = {
        id: Date.now().toString(),
        content: newMessage,
        isFromHost: true,
        createdAt: new Date().toISOString(),
        booking: messages.find(m => m.booking?.id === selectedConversation)?.booking
      };

      setMessages([...messages, newMsg]);
      setNewMessage('');
      toast.success('Message sent!');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  // Group messages by booking/conversation
  const conversations = messages.reduce((acc, message) => {
    const bookingId = message.booking?.id || 'general';
    if (!acc[bookingId]) {
      acc[bookingId] = {
        bookingId,
        property: message.booking?.property.title || 'General Inquiry',
        guest: message.booking?.guest || { firstName: 'Guest', lastName: '', email: '' },
        messages: [],
        lastMessage: message,
      };
    }
    acc[bookingId].messages.push(message);
    return acc;
  }, {} as Record<string, any>);

  const filteredConversations = Object.values(conversations).filter((conv: any) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      conv.property.toLowerCase().includes(searchLower) ||
      `${conv.guest.firstName} ${conv.guest.lastName}`.toLowerCase().includes(searchLower) ||
      conv.guest.email.toLowerCase().includes(searchLower)
    );
  });

  const selectedConv = selectedConversation ? conversations[selectedConversation] : null;

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
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-2">Communicate with your guests</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1 max-h-[500px] overflow-y-auto">
              {filteredConversations.map((conversation: any) => (
                <div
                  key={conversation.bookingId}
                  onClick={() => setSelectedConversation(conversation.bookingId)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 border-l-4 transition-colors ${
                    selectedConversation === conversation.bookingId
                      ? 'border-[#03c3d7] bg-blue-50'
                      : 'border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#03c3d7] rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {conversation.guest.firstName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {conversation.guest.firstName} {conversation.guest.lastName}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.property}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(conversation.lastMessage.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedConv ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedConv.property}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {selectedConv.guest.firstName} {selectedConv.guest.lastName} • {selectedConv.guest.email}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <div className="flex flex-col h-full">
                  {/* Messages List */}
                  <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[400px]">
                    {selectedConv.messages.map((message: Message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isFromHost ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.isFromHost
                              ? 'bg-[#03c3d7] text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.isFromHost ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Message Input */}
                  <div className="border-t p-4">
                    <div className="flex space-x-2">
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 resize-none"
                        rows={2}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-[#03c3d7] hover:bg-[#00abbc]"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
} 