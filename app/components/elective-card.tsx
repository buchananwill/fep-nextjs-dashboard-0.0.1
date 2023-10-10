import { Card } from '@tremor/react';
import { Badge } from '@tremor/react';
import React from 'react';

export interface ElectiveProps {
  courseDescription: string;
  subscribers: number;
}

export default function ElectiveCard({
  courseDescription,
  subscribers
}: ElectiveProps) {
  const color = getColor(subscribers);

  const isEnabled = subscribers > 0;

  const opacity = getOpacity(isEnabled);

  return (
    <Card className={`flex p-2 m-0 justify-between opacity-${opacity}`}>
      <span className="">{courseDescription}</span>
      <Badge color={color}>{subscribers}</Badge>
    </Card>
  );
}

function getColor(subscribers: number) {
  if (subscribers === 0) return 'red';
  if (subscribers < 5) return 'orange';
  if (subscribers < 10) return 'yellow';
  else return 'emerald';
}

function getOpacity(isEnabled: boolean) {
  if (isEnabled) return 100;
  else return 20;
}
