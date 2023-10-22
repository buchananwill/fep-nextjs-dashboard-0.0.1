'use client';
import { Card } from '@tremor/react';
import { Badge } from '@tremor/react';
import { usePathname, useRouter } from 'next/navigation';
import React, { MouseEventHandler } from 'react';

export interface ElectiveDTO {
  courseDescription: string;
  courseId: number;
  carouselId: number;
  subscriberPartyIDs: number[];
}

const electiveParentSlug = 'electives/';

export default function ElectiveCard({
  electiveDTO // handleCardClick
}: {
  electiveDTO: ElectiveDTO;
  // handleCardClick: Function;
}) {
  const { courseDescription, carouselId, subscriberPartyIDs, courseId } =
    electiveDTO;
  const subscribers = subscriberPartyIDs.length;
  const color = getColor(subscribers);
  const isEnabled = subscribers > 0;
  const { replace } = useRouter();
  const pathname = usePathname();

  const onCardClick = () => {
    const params = new URLSearchParams(window.location.search);

    params.set('courseId', courseId.toString());
    params.set('carouselId', carouselId.toString());

    replace(`${pathname}?${params.toString()}`);
  };

  const opacity = getOpacity(isEnabled);

  // const handleClick = () => {
  //   console.log(
  //     `Card clicked:${courseDescription} with subs: ${subscriberPartyIDs}`
  //   );
  // };

  return (
    <Card
      className={`flex p-2 m-0 justify-between items-center opacity-${opacity} border border-transparent hover:scale-110 hover:z-10 hover:transition-transform hover:duration-300 duration-300 transition-transform`}
      onClick={onCardClick}
    >
      <span className="mx-2">
        {courseDescription} {'  '} {carouselId}{' '}
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