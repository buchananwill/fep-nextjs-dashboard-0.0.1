'use client';

import React, { useContext, useEffect, useState, useTransition } from 'react';

import {
  TimetablesContext,
  TimetablesDispatchContext
} from './timetables-context';
import { Badge } from '@tremor/react';

import { convertDtoToState } from './build-timetables-state';
import { PeriodDTO } from '../api/dtos/PeriodDTOSchema';
import { CellDataTransformer } from '../generic/components/tables/dynamic-dimension-timetable';
import InteractiveTableCard from '../generic/components/tables/interactive-table-card';
import {
  FillableButton,
  PinIcons
} from '../generic/components/buttons/fillable-button';
import { swapPeriods } from '../api/actions/custom/timetables';
import { countConcurrency, getBadgeColor } from './count-concurrency';

export const PeriodCardTransformer: CellDataTransformer<PeriodDTO> = ({
  data: { id, description }
}) => {
  const {
    focusPeriodId,
    lessonCycleId,
    periodIdToLessonCycleMap,
    highlightedSubjects,
    scheduleId,
    lessonCycleMap,
    updatePending
  } = useContext(TimetablesContext);
  const dispatch = useContext(TimetablesDispatchContext);
  const [, startTransition] = useTransition();

  const handleCardClick = (periodId: number | null) => {
    startTransition(() => {
      dispatch({
        type: 'setFocusPeriod',
        periodId: periodId
      });
    });
  };
  const [cycleIds, setCycleIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (id) {
      const oldSet = periodIdToLessonCycleMap.get(id);
      const updatedIds = new Set<string>();
      oldSet?.forEach((lessonCycleId) => updatedIds.add(lessonCycleId));
      setCycleIds(updatedIds);
    }
  }, [periodIdToLessonCycleMap, setCycleIds, id]);

  const borderVisible = cycleIds.has(lessonCycleId);

  const additionalClassNames = [
    borderVisible ? '' : 'border-transparent',
    'items-center',
    id == focusPeriodId ? 'bg-emerald-100' : ''
  ];

  const concurrency = countConcurrency(
    highlightedSubjects,
    id,
    periodIdToLessonCycleMap,
    lessonCycleMap
  );

  const badgeColor = getBadgeColor(concurrency);

  const rotation: { [key: string]: string } = {
    P1: 'rotate-180',
    P2: '',
    P3: 'rotate-180',
    P4: '',
    P5: 'rotate-180',
    P6: ''
  };

  async function handleSwapClick() {
    dispatch({
      type: 'setUpdatePending',
      value: true
    });
    const updatedDtoList = await swapPeriods(id, scheduleId);

    const lessonCycles = updatedDtoList.map((dto) => convertDtoToState(dto));

    dispatch({
      type: 'updateLessonCycles',
      lessonCycles: lessonCycles
    });

    dispatch({
      type: 'setUpdatePending',
      value: false
    });
  }

  const rotationClass = rotation[description] || '';
  return (
    <InteractiveTableCard
      decorationColor="blue"
      additionalClassNames={additionalClassNames}
    >
      <div
        className="flex w-full h-full justify-between pr-2"
        onClick={() => handleCardClick(id)}
      >
        <p> {description}</p>
        <Badge className={`bg-${badgeColor}-300`}>{concurrency}</Badge>
      </div>
      <FillableButton
        pinIcon={PinIcons.arrowUpOnSquare}
        className={`z-20 ${rotationClass}`}
        isPinned={updatePending}
        setPinned={handleSwapClick}
        id={`lesson-cycle:swapping:${id}`}
      ></FillableButton>
    </InteractiveTableCard>
  );
};
