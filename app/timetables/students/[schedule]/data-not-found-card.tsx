import React, { ReactNode } from 'react';
import { Card } from '@nextui-org/react';

export function DataNotFoundCard({ children }: { children: ReactNode }) {
  return <Card>{children}</Card>;
}
