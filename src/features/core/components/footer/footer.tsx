import React from 'react';

interface footerProps {
  // Add your props here
}

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white shadow-sm w-full">
      <div className="container mx-auto px-4 py-4">
        <p className="text-center text-gray-600">
          Copyright © 2025 Smart360. All rights reserved &nbsp; | &nbsp; Version {import.meta.env.VITE_VERSION || '1.0.0'}
        </p>
      </div>
    </footer>
  );
};
