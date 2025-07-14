import React from 'react';

import {
  SkeletonText,
  SkeletonTitle,
  SkeletonAvatar,
  SkeletonImage,
  SkeletonButton,
  SkeletonInput,
  SkeletonCard,
} from '../components/skeletons/Skeleton';

type ElementType = 'text' | 'title' | 'avatar' | 'image' | 'button' | 'input' | 'card';

interface ElementConfig {
  type: ElementType;
  width?: string | number;
  height?: string | number;
  className?: string;
}

interface SkeletonConfig {
  elements: ElementConfig[];
  className?: string;
}

const elementMap = {
  text: SkeletonText,
  title: SkeletonTitle,
  avatar: SkeletonAvatar,
  image: SkeletonImage,
  button: SkeletonButton,
  input: SkeletonInput,
  card: SkeletonCard,
};

export const generateSkeleton = (config: SkeletonConfig): React.ReactNode => {
  return (
    <div className={config.className}>
      {config.elements.map((element, index) => {
        const SkeletonComponent = elementMap[element.type];
        return (
          <SkeletonComponent
            key={index}
            width={element.width}
            className={element.className}
          />
        );
      })}
    </div>
  );
};

// Helper function to analyze component structure and generate skeleton config
export const analyzeComponentStructure = (component: React.ReactNode): SkeletonConfig => {
  const elements: ElementConfig[] = [];

  // Recursively analyze the component structure
  const analyze = (node: React.ReactNode) => {
    if (!node) return;

    if (typeof node === 'string') {
      elements.push({ type: 'text' });
      return;
    }

    if (React.isValidElement(node)) {
      const { type, props } = node;

      // Analyze based on element type
      if (typeof type === 'string') {
        switch (type) {
          case 'h1':
          case 'h2':
          case 'h3':
          case 'h4':
          case 'h5':
          case 'h6':
            elements.push({ type: 'title' });
            break;
          case 'img':
            elements.push({ type: 'image' });
            break;
          case 'button':
            elements.push({ type: 'button' });
            break;
          case 'input':
            elements.push({ type: 'input' });
            break;
          default:
            elements.push({ type: 'text' });
        }
      }

      // Recursively analyze children
      if (props.children) {
        React.Children.forEach(props.children, analyze);
      }
    }
  };

  analyze(component);
  return { elements };
};

// Example usage:
// const MyComponentSkeleton = () => {
//   const config = analyzeComponentStructure(<MyComponent />);
//   return generateSkeleton(config);
// }; 