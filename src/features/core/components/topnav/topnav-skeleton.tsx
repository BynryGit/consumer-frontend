import { Skeleton } from '@shared/ui/skeleton';
import React from 'react';

export const TopnavSkeleton: React.FC = () => {
  return (
    <header className="w-full bg-white shadow-sm flex items-center justify-between px-6 h-16">
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-8 rounded" />
        <div className="flex items-center gap-1">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </header>
  );
}; 