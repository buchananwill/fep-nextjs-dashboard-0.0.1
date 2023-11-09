'use client';
import React from 'react';

import { ButtonSurroundTransformer } from '../components/filtered-disclosure-panel';
import { LessonCycle } from '../api/state-types';
import { PinButton, PinIcons } from '../components/pin-button';

const ButtonSurroundLessonCycle: ButtonSurroundTransformer<LessonCycle> = ({
  children,
  data,
  className
}) => {
  const handleRadioClick = (id: number) => {
    null;
  };
  const handlePinnedStudent = (id: number) => {
    null;
  };
  const handleMortarBoardClick = (id: number) => {
    null;
  };
  return (
    <div className={className}>
      <div className="flex w-full items-center grow-0 justify-between rounded-lg bg-gray-100">
        <PinButton
          pinIcon={PinIcons.arrowLeftCircle}
          className="z-20"
          isPinned={false}
          setPinned={() => handleRadioClick(data.id)}
        ></PinButton>

        {children}
        <PinButton
          pinIcon={PinIcons.mapPin}
          className="z-20"
          isPinned={false}
          setPinned={() => handlePinnedStudent(data.id)}
        ></PinButton>
        <PinButton
          pinIcon={PinIcons.mortarBoard}
          className={`mr-1`}
          isPinned={false}
          setPinned={() => handleMortarBoardClick(data.id)}
        ></PinButton>
      </div>
    </div>
  );
};

export default ButtonSurroundLessonCycle;
