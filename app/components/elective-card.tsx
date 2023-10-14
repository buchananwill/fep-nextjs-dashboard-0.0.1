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

  const handleClick = () => {
    console.log(`Card clicked:${courseDescription}`);
  };

  return (
    <Card
      className={`flex p-2 m-0 justify-between items-center opacity-${opacity} border border-transparent hover:border-red-400`}
      onClick={handleClick}
    >
      <span className="mx-2">
        {courseDescription} {'  '}
      </span>
      <Badge color={color}>{subscribers}</Badge>
    </Card>
  );
}

function getColor(subscribers: number) {
  if (subscribers === 0) return 'red';
  if (subscribers < 5) return 'orange';
  if (subscribers < 10) return 'yellow';
  if (subscribers > 30) return 'indigo';
  if (subscribers > 20) return 'sky';
  else return 'emerald';
}

function getOpacity(isEnabled: boolean) {
  if (isEnabled) return 100;
  else return 50;
}
