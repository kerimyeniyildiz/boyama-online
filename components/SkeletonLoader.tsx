interface SkeletonProps {
  className?: string;
}

export function SkeletonBox({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded ${className}`}
      style={{
        animation: 'shimmer 2s infinite linear',
      }}
    />
  );
}

export function SkeletonText({ className = '' }: SkeletonProps) {
  return <SkeletonBox className={`h-4 ${className}`} />;
}

export function SkeletonImage({ className = '' }: SkeletonProps) {
  return <SkeletonBox className={`aspect-[3/4] ${className}`} />;
}

export function CategoryCardSkeleton() {
  return (
    <div className="card">
      <SkeletonImage className="rounded-t-2xl" />
      <div className="p-6 space-y-4">
        <SkeletonText className="w-3/4" />
        <SkeletonText className="w-full" />
        <SkeletonText className="w-2/3" />
        <div className="flex justify-between items-center pt-2">
          <SkeletonText className="w-1/3" />
          <SkeletonBox className="w-16 h-6 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ImageCardSkeleton() {
  return (
    <div className="card">
      <SkeletonImage className="rounded-t-2xl" />
      <div className="p-4 space-y-3">
        <SkeletonText className="w-2/3" />
        <SkeletonBox className="w-full h-10 rounded-2xl" />
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="py-20 px-4 text-center">
      <div className="container mx-auto max-w-4xl space-y-6">
        <SkeletonBox className="h-16 md:h-20 lg:h-24 w-3/4 mx-auto rounded-2xl" />
        <SkeletonBox className="h-8 md:h-10 w-full max-w-2xl mx-auto rounded-xl" />
        <SkeletonBox className="h-6 w-2/3 mx-auto rounded-lg" />
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <SkeletonBox className="h-6 w-32 rounded-lg" />
          <SkeletonBox className="h-6 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// Add shimmer animation to global CSS
export const shimmerCSS = `
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
`;