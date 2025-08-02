# 🏠 StayKasa - Direct Booking Platform for Ghana

**Your Trusted Short-Stay Platform in Ghana**

StayKasa is a modern direct booking platform for short-stay vacation rentals and co-hosting services in Ghana. Built with Next.js, Tailwind CSS, and shadcn/ui components.

## 🚀 Features

- **Direct Booking**: Book properties directly with local payment support (Mobile Money, VISA, Mastercard)
- **Property Management**: Hosts can list and manage their properties
- **Co-hosting Services**: Automated guest handling, cleaning coordination, and reporting
- **Local Expertise**: Built specifically for the Ghanaian market
- **Modern UI**: Beautiful, responsive design with StayKasa branding

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns

## 🎨 Brand Colors

- **Primary Teal**: `#03c3d7`
- **Dark Sea Green**: `#84a9ae`
- **Deep Cyan Gray**: `#133736`
- **Muted Slate Blue**: `#50757c`
- **Accent Aqua Blue**: `#00abbc`

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd staykasa-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
staykasa-app/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styles with StayKasa branding
│   │   ├── layout.tsx           # Root layout with metadata
│   │   └── page.tsx             # Homepage with hero and listings
│   ├── components/
│   │   └── ui/                  # shadcn/ui components
│   └── lib/
│       └── utils.ts             # Utility functions
├── public/
│   └── Images/
│       └── logo.webp            # StayKasa logo
├── tailwind.config.ts           # Tailwind config with brand colors
└── components.json              # shadcn/ui configuration
```

## 🎯 Current Implementation

### ✅ Completed (Phase 1)
- [x] Project setup with Next.js and Tailwind CSS
- [x] shadcn/ui components installation
- [x] StayKasa brand colors integration
- [x] Hero section with search functionality
- [x] Listings preview with property cards
- [x] About section highlighting key features
- [x] Footer with contact information
- [x] Responsive design
- [x] SEO optimization with proper metadata

### 🔄 Next Steps (Phase 2)
- [ ] Booking logic with calendar integration
- [ ] Guest count and validation
- [ ] Property listing detail pages
- [ ] Payment placeholder logic
- [ ] Host dashboard
- [ ] Admin features

## 🎨 Design System

The project uses a consistent design system with:
- **Typography**: Inter font family
- **Colors**: StayKasa brand palette
- **Components**: shadcn/ui for consistency
- **Spacing**: Tailwind CSS spacing scale
- **Responsive**: Mobile-first approach

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktop (1024px+)
- Large screens (1280px+)

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Components

1. Use shadcn/ui for new UI components:
   ```bash
   npx shadcn@latest add <component-name>
   ```

2. Create custom components in `src/components/`

## 🌟 Key Features Implemented

### Hero Section
- Compelling headline with StayKasa branding
- Search functionality with location, dates, and guest count
- Trust indicators (ratings, guest count, instant booking)

### Property Listings
- Featured properties showcase
- Property cards with images, pricing, and details
- Hover effects and smooth transitions
- Responsive grid layout

### About Section
- Value propositions highlighting local expertise
- Icon-based feature presentation
- Consistent branding throughout

### Navigation & Footer
- Sticky navigation with logo and menu
- Footer with comprehensive links and contact info
- Smooth scrolling to sections

## 🚀 Deployment

The application is ready for deployment on:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- Any platform supporting Node.js

## 📄 License

This project is proprietary to StayKasa. All rights reserved.

## 🤝 Contributing

For internal development and contributions, please follow the established coding standards and component patterns.

---

**StayKasa Team** - Building the future of short-stay accommodation in Ghana 🇬🇭
