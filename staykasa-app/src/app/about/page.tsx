import Image from 'next/image';
import { Users, Calendar, Star, Shield, Heart, Globe } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'StayKasa - About',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-[#03c3d7] to-[#00abbc] text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About StayKasa
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            Building the future of short-stay accommodation in Ghana with local expertise and global standards
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-[#03c3d7] to-[#00abbc] bg-clip-text text-transparent">
                Our Mission
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                At StayKasa, we&apos;re passionate about connecting travelers with authentic Ghanaian hospitality while empowering local hosts to share their beautiful spaces with the world.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="w-16 h-16 bg-[#03c3d7]/20 rounded-full flex items-center justify-center mb-6">
                  <Heart className="text-[#03c3d7]" size={32} />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-[#133736]">For Travelers</h3>
                <p className="text-gray-600 leading-relaxed">
                  Experience Ghana like a local with our carefully curated selection of properties. From cozy apartments in Accra to beachfront villas, we offer authentic stays that go beyond traditional hotels.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="w-16 h-16 bg-[#03c3d7]/20 rounded-full flex items-center justify-center mb-6">
                  <Users className="text-[#03c3d7]" size={32} />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-[#133736]">For Hosts</h3>
                <p className="text-gray-600 leading-relaxed">
                  Turn your property into a source of income with our comprehensive hosting platform. We provide the tools, support, and local expertise you need to succeed in Ghana's growing tourism market.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-[#03c3d7] to-[#00abbc] bg-clip-text text-transparent">
                  Our Story
                </h2>
                <div className="space-y-6 text-gray-600 leading-relaxed">
                  <p>
                    StayKasa was born from a simple observation: Ghana&apos;s tourism potential was being limited by a lack of accessible, quality short-stay accommodation options. While the country boasts incredible culture, beautiful landscapes, and warm hospitality, visitors often struggled to find authentic local experiences.
                  </p>
                  <p>
                    Founded by a team passionate about both technology and Ghanaian hospitality, we set out to bridge this gap. We understood that the key to success lay in combining local expertise with modern technology, creating a platform that works seamlessly with Ghana&apos;s unique payment systems and cultural nuances.
                  </p>
                  <p>
                    Today, StayKasa is more than just a booking platform – we&apos;re a community of hosts and travelers, all connected by a shared love for authentic Ghanaian experiences. From our headquarters in Accra, we&apos;re building the infrastructure that will make Ghana a premier destination for short-stay accommodation.
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-[#03c3d7]/20 to-[#00abbc]/20 p-8 rounded-2xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                      <div className="text-3xl font-bold text-[#03c3d7] mb-2">500+</div>
                      <div className="text-sm text-gray-600">Properties Listed</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                      <div className="text-3xl font-bold text-[#03c3d7] mb-2">1000+</div>
                      <div className="text-sm text-gray-600">Happy Guests</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                      <div className="text-3xl font-bold text-[#03c3d7] mb-2">50+</div>
                      <div className="text-sm text-gray-600">Local Hosts</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                      <div className="text-3xl font-bold text-[#03c3d7] mb-2">4.8★</div>
                      <div className="text-sm text-gray-600">Average Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-[#03c3d7] to-[#00abbc] bg-clip-text text-transparent">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core principles guide everything we do at StayKasa
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#03c3d7]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-[#03c3d7]" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#133736]">Trust & Safety</h3>
              <p className="text-gray-600">
                Every property is verified and every booking is protected. Your safety and security are our top priorities.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#03c3d7]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="text-[#03c3d7]" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#133736]">Local Expertise</h3>
              <p className="text-gray-600">
                Deep understanding of Ghanaian culture, payment systems, and hospitality standards.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#03c3d7]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="text-[#03c3d7]" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#133736]">Quality Assurance</h3>
              <p className="text-gray-600">
                We maintain high standards for all properties and experiences on our platform.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#03c3d7]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-[#03c3d7]" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#133736]">Community First</h3>
              <p className="text-gray-600">
                Building a community of hosts and travelers who share authentic experiences.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#03c3d7]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-[#03c3d7]" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#133736]">Seamless Experience</h3>
              <p className="text-gray-600">
                From booking to checkout, we ensure a smooth and enjoyable experience for everyone.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#03c3d7]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-[#03c3d7]" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#133736]">Empowerment</h3>
              <p className="text-gray-600">
                Empowering local hosts to share their spaces and earn income from tourism.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-[#03c3d7] to-[#00abbc] bg-clip-text text-transparent">
              Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the passionate team behind StayKasa, dedicated to revolutionizing short-stay accommodation in Ghana
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-[#03c3d7]/10 to-[#00abbc]/10 p-8 rounded-2xl">
              <div className="text-center">
                <h3 className="text-2xl font-semibold mb-4 text-[#133736]">The StayKasa Family</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Our team combines deep local knowledge with international expertise in technology, hospitality, and business. Based in Accra, we&apos;re committed to understanding and serving the unique needs of Ghana&apos;s tourism market.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  From our customer support team who speak local languages and understand cultural nuances, to our technology team building solutions that work seamlessly with Mobile Money and local payment systems, every member of our team is dedicated to making StayKasa the premier platform for short-stay accommodation in Ghana.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#03c3d7] to-[#00abbc] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Join the StayKasa Community
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Whether you&apos;re looking to explore Ghana or share your space with travelers, we&apos;re here to help you get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/search" 
              className="bg-white text-[#03c3d7] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Properties
            </Link>
            <Link 
              href="/become-host" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#03c3d7] transition-colors"
            >
              Become a Host
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-white/95 text-[#133736] py-12 border-t border-[#03c3d7]/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-center md:text-left">
              <h3 className="font-semibold mb-4 text-[#03c3d7]">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/search" className="text-[#50757c] hover:text-[#03c3d7] transition-colors font-medium">Find Stays</Link></li>
                <li><Link href="/become-host" className="text-[#50757c] hover:text-[#03c3d7] transition-colors font-medium">Become a Host</Link></li>
                <li><Link href="/about" className="text-[#50757c] hover:text-[#03c3d7] transition-colors font-medium">About Us</Link></li>
                <li><Link href="/contact" className="text-[#50757c] hover:text-[#03c3d7] transition-colors font-medium">Contact</Link></li>
              </ul>
            </div>
            
            <div className="text-center md:text-left">
              <h3 className="font-semibold mb-4 text-[#03c3d7]">Contact</h3>
              <ul className="space-y-2">
                <li className="text-[#50757c] font-medium">Email: hello@staykasa.com</li>
                <li className="text-[#50757c] font-medium">Phone: +233(0)20.211.3633</li>
                <li className="text-[#50757c] font-medium">WhatsApp: +233(0)20.211.3633</li>
              </ul>
            </div>
          </div>
          
          <div className="text-center mt-8 pt-8 border-t border-[#03c3d7]/20">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-3 rounded-xl shadow-lg">
                <Image
                  src="/Images/logo.webp"
                  alt="StayKasa Logo"
                  width={32}
                  height={32}
                  className="rounded shadow-md filter drop-shadow-md"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-[#03c3d7] to-[#00abbc] bg-clip-text text-transparent drop-shadow-sm">
                  StayKasa
                </span>
              </div>
            </div>
            <p className="text-[#50757c] font-medium mb-4">
              Your trusted short-stay platform in Ghana
            </p>
            <p className="text-[#50757c] font-medium">&copy; 2025 StayKasa. All rights reserved. | Powered by The Geek Toolbox</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 