'use client';

import {
  AcademicCapIcon,
  ArrowLeftCircleIcon,
  MapPinIcon,
  ArrowUpOnSquareIcon
} from '@heroicons/react/24/solid';
import {
  AcademicCapIcon as AciOutline,
  ArrowLeftCircleIcon as AlcOutline,
  MapPinIcon as MpiOutline,
  ArrowUpOnSquareIcon as AuosOutline
} from '@heroicons/react/24/outline';
import { StringMap } from '../../../contexts/string-map-context/string-map-reducer';
import { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';

export type PinIconsStrings =
  | 'mapPin'
  | 'mortarBoard'
  | 'arrowLeftCircle'
  | 'arrowUpOnSquare';

export const PinIcons: StringMap<PinIconsStrings> = {
  mortarBoard: 'mortarBoard',
  mapPin: 'mapPin',
  arrowLeftCircle: 'arrowLeftCircle',
  arrowUpOnSquare: 'arrowUpOnSquare'
};

export const FillableButton = ({
  pinIcon,
  isPinned,
  setPinned,
  className,
  id
}: {
  pinIcon: PinIconsStrings;
  className?: string;
  isPinned: boolean;
  setPinned: Function;
  id: string;
}) => {
  let Icon: ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, 'ref'> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & RefAttributes<SVGSVGElement>
  >;
  if (isPinned) {
    switch (pinIcon) {
      case 'arrowLeftCircle': {
        Icon = ArrowLeftCircleIcon;
        break;
      }
      case 'arrowUpOnSquare': {
        Icon = ArrowUpOnSquareIcon;
        break;
      }
      case 'mapPin':
        Icon = MapPinIcon;
        break;
      case 'mortarBoard': {
        Icon = AcademicCapIcon;
        break;
      }
    }
  } else {
    switch (pinIcon) {
      case 'arrowLeftCircle': {
        Icon = AlcOutline;
        break;
      }
      case 'arrowUpOnSquare': {
        Icon = AuosOutline;
        break;
      }
      case 'mapPin':
        Icon = MpiOutline;
        break;
      case 'mortarBoard': {
        Icon = AciOutline;
        break;
      }
    }
  }

  return (
    <>
      <label className={`${className && className} relative`}>
        <input
          type="checkbox"
          id={id}
          className={'pointer-events-none absolute opacity-0  '}
          checked={isPinned}
          onChange={() => setPinned()}
        />

        <Icon
          className={`cursor-pointer w-6 h-6 ${
            !isPinned
              ? 'stroke-current hover:stroke-accent'
              : 'fill-current hover:fill-accent'
          }`}
        ></Icon>
      </label>
    </>
  );
};
