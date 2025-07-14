import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@shared/ui/tooltip';
import { Info } from 'lucide-react';
import React from 'react';

interface InfoTooltipProps {
  content: React.ReactNode;
  className?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ content, className }) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <button className="cursor-help focus:outline-none">
            <Info className={`h-3.5 w-3.5 text-muted-foreground ${className}`} />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-sm" side="right">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
