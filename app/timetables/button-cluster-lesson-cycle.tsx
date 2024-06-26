'use client';
import React, { useContext } from 'react';

import { LessonCycle } from '../api/state-types';

import {
  TimetablesContext,
  TimetablesDispatchContext
} from './timetables-context';
import { ButtonClusterTransformer } from '../generic/components/disclosure-list/disclosure-list-panel';
import {
  FillableButton,
  PinIcons
} from '../generic/components/buttons/fillable-button';

const ButtonClusterLessonCycle: ButtonClusterTransformer<LessonCycle> = ({
  children,
  data: { id, subject }
}) => {
  const dispatch = useContext(TimetablesDispatchContext);
  const { pinnedLessonCycles, lessonCycleId, highlightedSubjects } =
    useContext(TimetablesContext);

  const handleRadioClick = (id: string) => {
    dispatch({
      type: 'setFocusLessonCycle',
      lessonCycleId: id
    });
  };
  const handlePinnedLessonCycle = (id: string) => {
    dispatch({
      type: 'setPinnedLessonCycle',
      lessonCycleId: id
    });
  };
  const handleMortarBoardClick = (subject: string) => {
    dispatch({
      type: 'toggleHighlightedSubject',
      subject: subject
    });
  };
  return (
    <div className="flex items-center w-fit grow-0 justify-between rounded-lg bg-gray-100 mx-1">
      <FillableButton
        pinIcon={PinIcons.arrowLeftCircle}
        className="z-20"
        isPinned={lessonCycleId == id}
        setPinned={() => handleRadioClick(id)}
        id={`lesson-cycle:selected:${id}`}
      ></FillableButton>

      {children}
      <FillableButton
        pinIcon={PinIcons.mapPin}
        className="z-20 px-1"
        isPinned={pinnedLessonCycles.has(id)}
        setPinned={() => handlePinnedLessonCycle(id)}
        id={`lesson-cycle:pinned:${id}`}
      ></FillableButton>
      <FillableButton
        pinIcon={PinIcons.mortarBoard}
        className={`mr-1`}
        isPinned={highlightedSubjects.has(subject)}
        setPinned={() => handleMortarBoardClick(subject)}
        id={`lesson-cycle:highlight-matching:${id}`}
      ></FillableButton>
    </div>
  );
};

export default ButtonClusterLessonCycle;
