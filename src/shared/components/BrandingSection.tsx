import { Info } from 'lucide-react';
import React from 'react';

import Logo from '../ui/logo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface BrandingSectionProps {
  title?: string;
  description?: string;
  tooltipText?: string;
}

const BrandingSection: React.FC<BrandingSectionProps> = ({
  title = "Unified Utility Management Solution",
  description = "Your smart way to manage utilities, service orders, and customer interactions — all in one place.",
  tooltipText = "Smart360 unifies all your utility management needs in a single, powerful platform."
}) => {
  return (
    <div className="w-full md:w-1/2 bg-utility-gradient flex flex-col p-10 text-white relative overflow-hidden">
      <Logo />
      <div className="font-bold text-2xl">Bynry <span className="text-[#b388ff]">SMART360</span></div>
      <div className="mt-8 z-10">
        <div className="flex items-center mb-4">
          <h1 className="text-3xl font-bold">{title}</h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="ml-2 cursor-help">
                  <Info className="h-5 w-5" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-white/90 backdrop-blur-sm text-gray-800">
                <p className="max-w-xs">{tooltipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-xl">
          {description}
        </p>
      </div>
      {/* Large stylized SVG background element */}
      <div className="absolute bottom-0 right-0 opacity-30 pointer-events-none z-0">
        <svg viewBox="0 0 200 200" width="300" height="300">
          <path d="M20,180 Q60,120 20,60 Q60,0 100,60 Q140,0 180,60 Q140,120 180,180 Z" 
                fill="url(#gradient)" />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4dabf7" />
              <stop offset="50%" stopColor="#4dabf7" />
              <stop offset="100%" stopColor="#8dd73b" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default BrandingSection; 