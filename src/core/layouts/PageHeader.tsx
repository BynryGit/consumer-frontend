
import React from 'react';
import { cn } from '@shared/lib/utils';
import { InfoTooltip } from '@shared/ui/infoTooltip';

interface PageHeaderProps {
  title: string;
  description?: string;
  infoTooltip?: string;
  className?: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  infoTooltip,
  className,
  children,
}) => {
  return (
    <div className={cn('mb-8', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            {title}
            {infoTooltip && <InfoTooltip content={infoTooltip} />}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground max-w-3xl">{description}</p>
          )}
        </div>
        {children && <div className="flex items-center space-x-2">{children}</div>}
      </div>
    </div>
  );
};
