import React from 'react';
import { Skeleton, SkeletonCard } from './Skeleton';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full h-full p-6">
      {/* Cards Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="w-full">
        {/* Table Header */}
        <div className="grid grid-cols-6 gap-4 mb-4">
          {[...Array(10)].map((_, index) => (
            <Skeleton key={index} height="2em" className="font-semibold rounded" />
          ))}
        </div>

        {/* Table Rows */}
        {[...Array(40)].map((_, index) => (
          <div key={index} className="grid grid-cols-6 gap-4 mb-2">
            {[...Array(6)].map((_, colIndex) => (
              <Skeleton key={colIndex} height="1.5em" className="rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}; 