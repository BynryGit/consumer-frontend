
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@shared/ui/tooltip";
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex flex-col mb-6">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center cursor-help">
              <span className="text-lg font-bold text-blue-600">Bynry</span>
              <span className="text-xs bg-blue-700 text-white rounded-full h-4 w-4 flex items-center justify-center ml-1">®</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bynry Inc. - Utility Management Solutions</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex items-baseline">
        <span className="text-5xl font-black text-navy-900">SMART</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-5xl font-black text-utility-purple cursor-help">360</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Complete 360° utility management platform</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="text-sm font-medium mt-1">
        WHERE EFFICIENCY<br />
        MEETS AFFORDABILITY
      </div>
    </div>
  );
};

export default Logo;
