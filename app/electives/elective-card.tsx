'use client';
import { Card, Color } from '@tremor/react';
import { Badge } from '@tremor/react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useTransition } from 'react';
import { classNames } from '../utils/class-names';
import { getALevelClassLimitInt } from '../api/request-elective-preferences';

export interface ElectiveDTO {
  courseDescription: string;
  courseId: number;
  carouselId: number;
  subscriberPartyIDs: number[];
}

const electiveParentSlug = 'electives/';

const aLevelClassLimitInt = getALevelClassLimitInt();

export default function ElectiveCard({
  electiveDTO,
  partyId
}: {
  electiveDTO: ElectiveDTO;
  partyId: number;
}) {
  const { courseDescription, carouselId, subscriberPartyIDs, courseId } =
    electiveDTO;
  const subscribers = subscriberPartyIDs.length;
  const subscribersColor = getSubscribersColor(subscribers);
  const isEnabled = subscribers > 0;
  const { replace } = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const onCardClick = () => {
    const params = new URLSearchParams(window.location.search);

    params.set('courseId', courseId.toString());
    params.set('carouselId', carouselId.toString());

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  const opacity = getOpacity(isEnabled);

  const borderVisible: string = subscriberPartyIDs.includes(partyId)
    ? ''
    : 'border-transparent';

  const numberOfClasses = Math.ceil(subscribers / aLevelClassLimitInt);

  const classesColor = getClassesColor(numberOfClasses);

  return (
    <Card
      className={classNames(
        `opacity-${opacity}`,
        borderVisible,
        'flex p-2 m-0 items-center hover:scale-110 hover:z-10 hover:transition-transform hover:duration-300 duration-300 transition-transform'
      )}
      decoration="left"
      decorationColor="emerald"
      onClick={onCardClick}
    >
      {' '}
      {isPending && (
        <div className="absolute -left-1 top-0 bottom-0 flex items-center justify-center">
          <span className="loading loading-ring loading-sm"></span>
        </div>
      )}
      <span className="mx-2">{courseDescription}</span>
      <span className="grow"></span>
      <Badge color={classesColor}>{numberOfClasses} </Badge>
      <Badge color={subscribersColor}>{subscribers}</Badge>
    </Card>
  );
}

function getSubscribersColor(subscribers: number) {
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

function getClassesColor(classes: number): Color {
  if (classes >= 3) return 'red';
  if (classes == 2) return 'amber';
  if (classes == 1) return 'green';
  else return 'gray';
}
