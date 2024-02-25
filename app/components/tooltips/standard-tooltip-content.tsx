import React, { ReactNode } from 'react';
import { TooltipContent } from './tooltip';

export function StandardTooltipContent({ children }: { children: ReactNode }) {
  return (
    <TooltipContent>
      <div className="text-sm w-48 text-center bg-gray-700 text-gray-300 rounded-md p-2">
        {children}
      </div>
    </TooltipContent>
  );
}
