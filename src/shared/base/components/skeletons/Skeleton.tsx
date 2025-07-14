import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  circle?: boolean;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  rounded = false,
  circle = false,
  animation = 'pulse',
}) => {
  const baseClasses = 'bg-gray-200';
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-wave',
    none: '',
  };
  const shapeClasses = {
    rounded: rounded ? 'rounded' : '',
    circle: circle ? 'rounded-full' : '',
  };

  const style = {
    width: width,
    height: height,
  };

  return (
    <div
      className={`${baseClasses} ${animationClasses[animation]} ${shapeClasses.rounded} ${shapeClasses.circle} ${className}`}
      style={style}
      role="status"
      aria-label="Loading"
    />
  );
};

// Predefined skeleton components
export const SkeletonText: React.FC<Omit<SkeletonProps, 'height'>> = (props) => (
  <Skeleton height="1em" rounded {...props} />
);

export const SkeletonTitle: React.FC<Omit<SkeletonProps, 'height'>> = (props) => (
  <Skeleton height="1.5em" rounded {...props} />
);

export const SkeletonAvatar: React.FC<Omit<SkeletonProps, 'width' | 'height'>> = (props) => (
  <Skeleton width={40} height={40} circle {...props} />
);

export const SkeletonImage: React.FC<Omit<SkeletonProps, 'height'>> = (props) => (
  <Skeleton height={200} rounded {...props} />
);

export const SkeletonButton: React.FC<Omit<SkeletonProps, 'height'>> = (props) => (
  <Skeleton height={36} rounded {...props} />
);

export const SkeletonInput: React.FC<Omit<SkeletonProps, 'height'>> = (props) => (
  <Skeleton height={40} rounded {...props} />
);

export const SkeletonCard: React.FC<Omit<SkeletonProps, 'width' | 'height'>> = (props) => (
  <div className="p-4 border rounded-lg">
    <Skeleton height={120} rounded className="mb-4" {...props} />
    {/* <SkeletonTitle className="mb-2" {...props} /> */}
    {/* <SkeletonText className="mb-2" {...props} /> */}
    {/* <SkeletonText width="60%" {...props} /> */}
  </div>
); 