import { Card } from '@tremor/react';
import React from 'react';

export default function BigTableCard({
  children
}: {
  children?: React.ReactNode;
}) {
  return (
    <Card className="flex-shrink-0 flex-grow max-w-5xl max-h-min h-min overflow-x-auto p-2">
      <div className="m-2 p-2 min-w-max max-h-min">{children}</div>
    </Card>
  );
}