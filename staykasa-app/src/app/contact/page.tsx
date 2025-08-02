'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Phone, MessageCircle, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'StayKasa - Contact';
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || 'Thank you for your message! We\'ll get back to you within 24 hours.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          inquiryType: ''
        });
      } else {
        toast.error(result.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Failed to send message. Please try again later or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      value: 'hello@staykasa.com',
      link: 'mailto:hello@staykasa.com',
      description: 'Send us an email anytime'
    },
    {
      icon: Phone,
      title: 'Call Us',
      value: '+233(0)20.211.3633',
      link: 'tel:+233202113633',
      description: 'Mon-Fri 8AM-6PM GMT'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      value: '+233(0)20.211.3633',
      link: 'https://wa.me/233202113633',
      description: 'Quick responses via WhatsApp'
    }
  ];

  const faqs = [
    {
      question: 'How do I book a property?',
      answer: 'You can find and book properties on our website through our secure platform. We support Mobile Money and card payments.'
    },
    {
      question: 'What if I need to cancel my booking?',
      answer: 'Cancellation policies vary by property. You can view the specific cancellation policy for each property before booking.'
    },
    {
      question: 'How do I become a host?',
      answer: 'Click on "Become a Host" in our navigation to start your hosting journey. We\'ll guide you through the application process.'
    },
    {
      question: 'Are the properties verified?',
      answer: 'Yes, all properties on StayKasa are verified and maintained to high standards to ensure your safety and comfort.'
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-[#03c3d7] to-[#00abbc] text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Get in Touch
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            We're here to help you find the perfect stay in Ghana. Reach out to us anytime!
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-[#03c3d7] to-[#00abbc] bg-clip-text text-transparent">
              Multiple Ways to Reach Us
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the most convenient way to get in touch with our team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {contactMethods.map((method, index) => (
              <a
                key={index}
                href={method.link}
                target={method.link.startsWith('http') ? '_blank' : '_self'}
                rel={method.link.startsWith('http') ? 'noopener noreferrer' : ''}
                className="group"
              >
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 text-center">
                  <div className="w-16 h-16 bg-[#03c3d7]/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#03c3d7]/30 transition-colors">
                    <method.icon className="text-[#03c3d7]" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-[#133736]">{method.title}</h3>
                  <p className="text-[#03c3d7] font-medium mb-2">{method.value}</p>
                  <p className="text-gray-600 text-sm">{method.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#03c3d7] to-[#00abbc] bg-clip-text text-transparent">
                  Send us a Message
                </h2>
                <p className="text-gray-600 mb-8">
                  Have a question or need assistance? Fill out the form below and we'll get back to you as soon as possible.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Your full name"
                        required
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your.email@example.com"
                        required
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+233 XX XXX XXXX"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Inquiry Type</label>
                      <Select value={formData.inquiryType} onValueChange={(value) => handleInputChange('inquiryType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="booking">Booking Question</SelectItem>
                          <SelectItem value="hosting">Hosting Inquiry</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                    <Input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="What is this about?"
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Tell us how we can help you..."
                      rows={5}
                      required
                      className="w-full"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#03c3d7] hover:bg-[#00abbc] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Send size={20} />
                        <span>Send Message</span>
                      </div>
                    )}
                  </Button>
                </form>
              </div>

              {/* Contact Info & FAQ */}
              <div className="space-y-8">
                {/* Office Hours */}
                <div className="bg-gradient-to-br from-[#03c3d7]/10 to-[#00abbc]/10 p-6 rounded-2xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <Clock className="text-[#03c3d7]" size={24} />
                    <h3 className="text-xl font-semibold text-[#133736]">Office Hours</h3>
                  </div>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span className="font-medium">8:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span className="font-medium">9:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span className="font-medium">10:00 AM - 2:00 PM</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    * Emergency support available 24/7 via WhatsApp
                  </p>
                </div>

                {/* FAQ Section */}
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-[#133736]">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-[#133736] mb-2">{faq.question}</h4>
                        <p className="text-gray-600 text-sm">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white border border-gray-200 p-6 rounded-2xl">
                  <h3 className="text-xl font-semibold mb-4 text-[#133736]">Quick Actions</h3>
                  <div className="space-y-3">
                    <Link href="/search">
                      <Button variant="outline" className="w-full justify-start">
                        🔍 Find Stays
                      </Button>
                    </Link>
                    <Link href="/become-host">
                      <Button variant="outline" className="w-full justify-start">
                        🏠 Become a Host
                      </Button>
                    </Link>
                    <Link href="/about">
                      <Button variant="outline" className="w-full justify-start">
                        ℹ️ About StayKasa
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#03c3d7] to-[#00abbc] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            We're Here to Help
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Have questions about our services? Our team is ready to assist you with any inquiries about booking properties or becoming a host.
          </p>
        </div>
      </section>
    </div>
    </>
  );
} 