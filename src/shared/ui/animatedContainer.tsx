import { cn } from '@shared/lib/utils';
import React, { useEffect, useState } from 'react';

type AnimationType = 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale';

interface AnimatedContainerProps {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  animation = 'fade',
  delay = 0,
  duration = 500,
  className,
  once = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getAnimationClass = () => {
    if (!isVisible) return '';
    
    switch (animation) {
      case 'fade':
        return 'animate-fade-in';
      case 'slide-up':
        return 'animate-slide-up';
      case 'slide-down':
        return 'animate-slide-down';
      case 'slide-left':
        return 'animate-slide-left';
      case 'slide-right':
        return 'animate-slide-right';
      case 'scale':
        return 'animate-scale-in';
      default:
        return 'animate-fade-in';
    }
  };

  const styles = {
    opacity: isVisible ? 1 : 0,
    transition: `opacity ${duration}ms, transform ${duration}ms`,
    animationDuration: `${duration}ms`,
  };

  return (
    <div
      className={cn('will-change-transform', getAnimationClass(), className)}
      style={styles}
    >
      {children}
    </div>
  );
};

export default AnimatedContainer;
