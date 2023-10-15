import { Card } from '@tremor/react';
import { Badge } from '@tremor/react';
import React, { MouseEventHandler } from 'react';

export interface ElectiveDTO {
  courseDescription: string;
  subscribers: number;
  subscriberPartyIDs: number[];
}

export default function ElectiveCard({
  electiveDTO,
  handleCardClick
}: {
  electiveDTO: ElectiveDTO;
  handleCardClick: Function;
}) {
  const { courseDescription, subscribers, subscriberPartyIDs } = electiveDTO;
  const color = getColor(subscribers);
  const isEnabled = subscribers > 0;

  const onCardClick = () => {
    handleCardClick(electiveDTO.courseDescription, subscriberPartyIDs);
  };

  const opacity = getOpacity(isEnabled);

  // const handleClick = () => {
  //   console.log(
  //     `Card clicked:${courseDescription} with subs: ${subscriberPartyIDs}`
  //   );
  // };

  return (
    <Card
      className={`flex p-2 m-0 justify-between items-center opacity-${opacity} border border-transparent hover:border-red-400`}
      onClick={onCardClick}
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
