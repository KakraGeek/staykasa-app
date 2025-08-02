interface PlaceholderImageProps {
  className?: string;
  children?: React.ReactNode;
}

export function PlaceholderImage({ className = "", children }: PlaceholderImageProps) {
  return (
    <div className={`bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center ${className}`}>
      {children || (
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">Property Image</p>
        </div>
      )}
    </div>
  );
} 