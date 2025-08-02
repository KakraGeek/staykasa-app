import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@staykasa.com' },
    update: {},
    create: {
      email: 'admin@staykasa.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isVerified: true,
    },
  });

  // Create host user
  const hostPassword = await hashPassword('host123');
  const host = await prisma.user.upsert({
    where: { email: 'host@staykasa.com' },
    update: {},
    create: {
      email: 'host@staykasa.com',
      password: hostPassword,
      firstName: 'John',
      lastName: 'Host',
      role: 'HOST',
      isVerified: true,
    },
  });

  // Create guest user
  const guestPassword = await hashPassword('guest123');
  const guest = await prisma.user.upsert({
    where: { email: 'guest@staykasa.com' },
    update: {},
    create: {
      email: 'guest@staykasa.com',
      password: guestPassword,
      firstName: 'Sarah',
      lastName: 'Guest',
      role: 'GUEST',
      isVerified: true,
    },
  });

  // Create properties
  const properties = [
    {
      title: 'Luxury Villa in Accra',
      description: 'Experience luxury living in this stunning villa located in the prestigious East Legon neighborhood. This modern 2-bedroom villa offers the perfect blend of comfort and elegance, featuring high-end amenities and beautiful surroundings.',
      location: 'East Legon, Accra',
      address: '123 Luxury Street, East Legon',
      city: 'Accra',
      country: 'Ghana',
      latitude: 5.6145,
      longitude: -0.1869,
      price: 2500,
      maxGuests: 4,
      bedrooms: 2,
      baths: 2,
      amenities: JSON.stringify(['WiFi', 'Parking', 'Pool', 'Kitchen', 'Air Conditioning', 'Security']),
      isActive: true,
      isFeatured: true,
      ownerId: host.id,
    },
    {
      title: 'Beachfront Apartment',
      description: 'Wake up to the sound of waves at this beautiful beachfront apartment. Located just steps from Kokrobite Beach, this spacious 3-bedroom apartment offers breathtaking ocean views and direct beach access.',
      location: 'Kokrobite Beach',
      address: '456 Beach Road, Kokrobite',
      city: 'Accra',
      country: 'Ghana',
      latitude: 5.6145,
      longitude: -0.1869,
      price: 1800,
      maxGuests: 6,
      bedrooms: 3,
      baths: 2,
      amenities: JSON.stringify(['WiFi', 'Beach Access', 'Kitchen', 'Balcony', 'Air Conditioning']),
      isActive: true,
      isFeatured: true,
      ownerId: host.id,
    },
    {
      title: 'City Center Studio',
      description: 'Perfect for solo travelers or couples, this modern studio apartment is located in the heart of Osu. Enjoy easy access to restaurants, shopping, and nightlife while staying in a comfortable, well-appointed space.',
      location: 'Osu, Accra',
      address: '789 City Street, Osu',
      city: 'Accra',
      country: 'Ghana',
      latitude: 5.6145,
      longitude: -0.1869,
      price: 1200,
      maxGuests: 2,
      bedrooms: 1,
      baths: 1,
      amenities: JSON.stringify(['WiFi', 'Kitchen', 'Air Conditioning', 'Security', '24/7 Support']),
      isActive: true,
      isFeatured: false,
      ownerId: host.id,
    },
  ];

  const propertyImages = [
    ['/Images/properties/luxury-villa-accra.webp'],
    ['/Images/properties/beachfront-apartment.webp'],
    ['/Images/properties/city-center-studio.webp'],
  ];

  for (let i = 0; i < properties.length; i++) {
    const propertyData = properties[i];
    const images = propertyImages[i];
    
    const property = await prisma.property.create({
      data: propertyData,
    });

    // Create property images
    for (let j = 0; j < images.length; j++) {
      await prisma.propertyImage.create({
        data: {
          url: images[j],
          alt: `${propertyData.title} - Image ${j + 1}`,
          isPrimary: j === 0,
          order: j,
          propertyId: property.id,
        },
      });
    }

    // Create some sample reviews
    const reviews = [
      {
        rating: 5,
        comment: 'Amazing property! Highly recommended.',
        userId: guest.id,
        propertyId: property.id,
      },
      {
        rating: 4,
        comment: 'Great location and clean facilities.',
        userId: admin.id,
        propertyId: property.id,
      },
    ];

    for (const reviewData of reviews) {
      await prisma.review.create({
        data: reviewData,
      });
    }
  }

  // Update property ratings
  const propertiesWithReviews = await prisma.property.findMany({
    include: {
      _count: {
        select: { reviews: true },
      },
      reviews: {
        select: { rating: true },
      },
    },
  });

  for (const property of propertiesWithReviews) {
    if (property.reviews.length > 0) {
      const avgRating = property.reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) / property.reviews.length;
      
      await prisma.property.update({
        where: { id: property.id },
        data: {
          rating: avgRating,
          reviewCount: property._count.reviews,
        },
      });
    }
  }

  console.log('✅ Database seeded successfully!');
  console.log('👥 Users created:');
  console.log(`   Admin: admin@staykasa.com / admin123`);
  console.log(`   Host: host@staykasa.com / host123`);
  console.log(`   Guest: guest@staykasa.com / guest123`);
  console.log('🏠 Properties created:', properties.length);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 