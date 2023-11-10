'use client';
import React, { useContext } from 'react';

import { ButtonSurroundTransformer } from '../components/filtered-disclosure-panel';
import { LessonCycle } from '../api/state-types';
import { PinButton, PinIcons } from '../components/pin-button';
import {
  TimetablesContext,
  TimetablesDispatchContext
} from './timetables-context';

const ButtonSurroundLessonCycle: ButtonSurroundTransformer<LessonCycle> = ({
  children,
  data: { id, subject },
  className
}) => {
  const dispatch = useContext(TimetablesDispatchContext);
  const { pinnedLessonCycles, lessonCycleId, highlightedSubjects } =
    useContext(TimetablesContext);

  const handleRadioClick = (id: number) => {
    dispatch({
      type: 'setFocusLessonCycle',
      lessonCycleId: id
    });
  };
  const handlePinnedLessonCycle = (id: number) => {
    dispatch({
      type: 'setPinnedLessonCycle',
      lessonCycleId: id
    });
  };
  const handleMortarBoardClick = (subject: string) => {
    dispatch({
      type: 'setHighlightedSubjects',
      subject: subject
    });
  };
  return (
    <div className={className}>
      <div className="flex w-full items-center grow-0 justify-between rounded-lg bg-gray-100">
        <PinButton
          pinIcon={PinIcons.arrowLeftCircle}
          className="z-20"
          isPinned={lessonCycleId == id}
          setPinned={() => handleRadioClick(id)}
        ></PinButton>

        {children}
        <PinButton
          pinIcon={PinIcons.mapPin}
          className="z-20"
          isPinned={pinnedLessonCycles.has(id)}
          setPinned={() => handlePinnedLessonCycle(id)}
        ></PinButton>
        <PinButton
          pinIcon={PinIcons.mortarBoard}
          className={`mr-1`}
          isPinned={highlightedSubjects.has(subject)}
          setPinned={() => handleMortarBoardClick(subject)}
        ></PinButton>
      </div>
    </div>
  );
};

export default ButtonSurroundLessonCycle;
