import React, { ReactNode } from 'react';
import { Card } from '@tremor/react';

export function DataNotFoundCard({ children }: { children: ReactNode }) {
  return <Card>{children}</Card>;
}