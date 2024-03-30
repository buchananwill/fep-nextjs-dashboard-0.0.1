import React, { ReactNode } from 'react';
import { Card } from '@nextui-org/card';

export function DataNotFoundCard({ children }: { children: ReactNode }) {
  return <Card>{children}</Card>;
}
