import React, { ReactNode } from 'react';

export function StandardTooltipContentOld({
  children
}: {
  children: ReactNode;
}) {
  return (
    <div className="text-sm w-48 text-center bg-gray-700 text-gray-300 rounded-md p-2">
      {children}
    </div>
  );
}
