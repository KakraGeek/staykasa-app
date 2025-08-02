interface PropertyPlaceholderProps {
  type: 'luxury' | 'beachfront' | 'city' | 'default';
  className?: string;
}

export function PropertyPlaceholder({ type, className = "" }: PropertyPlaceholderProps) {
  const getPlaceholderContent = () => {
    switch (type) {
      case 'luxury':
        return {
          icon: (
            <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          ),
          gradient: "from-primary/20 via-secondary/10 to-accent/10",
          title: "Luxury Villa",
          subtitle: "Premium accommodation"
        };
      case 'beachfront':
        return {
          icon: (
            <svg className="w-12 h-12 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          gradient: "from-secondary/20 via-accent/10 to-primary/10",
          title: "Beachfront View",
          subtitle: "Ocean breeze & waves"
        };
      case 'city':
        return {
          icon: (
            <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          ),
          gradient: "from-accent/20 via-primary/10 to-secondary/10",
          title: "City Center",
          subtitle: "Urban convenience"
        };
      default:
        return {
          icon: (
            <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          ),
          gradient: "from-muted/20 to-muted/10",
          title: "Property",
          subtitle: "Beautiful accommodation"
        };
    }
  };

  const content = getPlaceholderContent();

  return (
    <div className={`bg-gradient-to-br ${content.gradient} flex items-center justify-center ${className}`}>
      <div className="text-center p-6">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
          {content.icon}
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">{content.title}</h3>
        <p className="text-sm text-muted-foreground">{content.subtitle}</p>
      </div>
    </div>
  );
} 