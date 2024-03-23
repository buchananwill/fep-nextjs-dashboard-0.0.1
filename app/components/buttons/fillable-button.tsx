'use client';

import { getArrowLeftCircle } from '../button-svg/get-arrow-left-circle';
import { getMortarBoard } from '../button-svg/get-mortar-board';
import { getPin } from '../button-svg/get-pin';
import { getArrowUpOnSquare } from '../button-svg/get-arrow-up-on-square';

export enum PinIcons {
  mapPin = 'mapPin',
  mortarBoard = 'mortarBoard',
  arrowLeftCircle = 'arrowLeftCircle',
  arrowUpOnSquare = 'arrowUpOnSquare'
}

function getPinIcon(pinIcon: PinIcons, isFilled: boolean) {
  switch (pinIcon) {
    case PinIcons.mapPin:
      return getPin(isFilled);
    case PinIcons.mortarBoard:
      return getMortarBoard(isFilled);
    case PinIcons.arrowLeftCircle:
      return getArrowLeftCircle(isFilled);
    case PinIcons.arrowUpOnSquare:
      return getArrowUpOnSquare(isFilled);
  }
}

export const FillableButton = ({
  pinIcon,
  isPinned,
  setPinned,
  className
}: {
  pinIcon: PinIcons;
  className?: string;
  isPinned: boolean;
  setPinned: Function;
}) => {
  return (
    <>
      <label
        className={`${
          className && className
        } swap stroke-current hover:stroke-accent hover:fill-accent fill-current`}
      >
        <input
          type="checkbox"
          className={`cursor-pointer z-20`}
          checked={isPinned}
          onChange={() => setPinned()}
        />
        {getPinIcon(pinIcon, false)}

        {getPinIcon(pinIcon, true)}
      </label>
    </>
  );
};
