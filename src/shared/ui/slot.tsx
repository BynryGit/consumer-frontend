import * as React from 'react';
import { Slot as RadixSlot } from '@radix-ui/react-slot';

export const Slot = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<typeof RadixSlot>>(
  (props, ref) => {
    return <RadixSlot {...props} ref={ref} />;
  }
);

Slot.displayName = 'Slot'; 