
import React, { useState } from "react";
import { Button } from "@shared/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@shared/ui/popover";
import { HelpCircle } from "lucide-react";

interface ContextualHelpProps {
  title: string;
  content: string;
  className?: string;
}

export function ContextualHelp({ title, content, className }: ContextualHelpProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`h-auto p-1 text-muted-foreground hover:text-foreground ${className}`}
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm text-muted-foreground">{content}</p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
