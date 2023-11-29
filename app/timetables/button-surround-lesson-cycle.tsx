'use client';
import React, { useContext } from 'react';

import { ButtonSurroundTransformer } from '../components/filtered-disclosure-panel';
import { LessonCycle } from '../api/state-types';
import { FillableButton, PinIcons } from '../components/fillable-button';
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
        <FillableButton
          pinIcon={PinIcons.arrowLeftCircle}
          className="z-20"
          isPinned={lessonCycleId == id}
          setPinned={() => handleRadioClick(id)}
        ></FillableButton>

        {children}
        <FillableButton
          pinIcon={PinIcons.mapPin}
          className="z-20"
          isPinned={pinnedLessonCycles.has(id)}
          setPinned={() => handlePinnedLessonCycle(id)}
        ></FillableButton>
        <FillableButton
          pinIcon={PinIcons.mortarBoard}
          className={`mr-1`}
          isPinned={highlightedSubjects.has(subject)}
          setPinned={() => handleMortarBoardClick(subject)}
        ></FillableButton>
      </div>
    </div>
  );
};

export default ButtonSurroundLessonCycle;
