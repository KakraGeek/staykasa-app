'use client';

import { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface ContactHostProps {
  hostId: string;
  hostName: string;
  propertyId: string;
  propertyTitle: string;
}

export function ContactHost({ hostId, hostName, propertyId, propertyTitle }: ContactHostProps) {
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { user } = useAuth();

  const handleSendMessage = async () => {
    if (!user) {
      toast.error('Please log in to contact the host');
      return;
    }

    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setSending(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipientId: hostId,
          content: message,
          propertyId: propertyId,
        }),
      });

      if (response.ok) {
        toast.success('Message sent successfully!');
        setMessage('');
        setShowForm(false);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to send message');
      }
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 mb-3">
          Log in to contact {hostName} about this property
        </p>
        <Button
          onClick={() => window.location.href = '/auth/login'}
          className="bg-primary hover:bg-primary/90"
        >
          Sign In to Message
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-[#133736]">Contact {hostName}</h3>
          <p className="text-sm text-muted-foreground">Ask about {propertyTitle}</p>
        </div>
        <MessageCircle className="h-5 w-5 text-primary" />
      </div>

      {!showForm ? (
        <Button
          onClick={() => setShowForm(true)}
          className="w-full bg-primary hover:bg-primary/90"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Message Host
        </Button>
      ) : (
        <div className="space-y-3">
          <Textarea
            value={message}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
            placeholder="Hi! I'm interested in this property. Could you tell me more about..."
            rows={3}
            maxLength={500}
          />
          <div className="text-xs text-muted-foreground text-right">
            {message.length}/500 characters
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={handleSendMessage}
              disabled={sending || !message.trim()}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {sending ? (
                'Sending...'
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setMessage('');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 