'use client';
import { CellDataTransformer } from '../components/dynamic-dimension-timetable';
import { LessonCycleDTO, Period } from '../api/dto-interfaces';
import React, { useContext, useEffect, useState, useTransition } from 'react';
import InteractiveTableCard from '../components/interactive-table-card';
import {
  TimetablesContext,
  TimetablesDispatchContext
} from './timetables-context';
import { Badge } from '@tremor/react';
import { LessonCycle } from '../api/state-types';
import { FillableButton, PinIcons } from '../components/fillable-button';
import { convertDtoToState } from './build-timetables-state';

function countConcurrency(
  highlightedSubjects: Set<string>,
  periodId: number | null,
  map: Map<number, Set<string>>,
  lessonCycleMap: Map<string, LessonCycle>
) {
  let concurrency = 0;
  if (!periodId) return concurrency;
  const setOrUndefined = map.get(periodId);
  if (!setOrUndefined) return concurrency;
  setOrUndefined.forEach((lessonCycleId) => {
    const lessonCycle = lessonCycleMap.get(lessonCycleId);
    if (
      lessonCycle &&
      (highlightedSubjects.has(lessonCycle.subject) ||
        highlightedSubjects.size == 0)
    )
      concurrency++;
  });
  return concurrency;
}

function getBadgeColor(concurrency: number) {
  switch (concurrency) {
    case 0:
      return 'gray';
    case 1:
      return 'emerald';
    case 2:
      return 'yellow';
    case 3:
      return 'orange';
    case 4:
      return 'red';
    case 5:
      return 'pink';
    default:
      return 'purple';
  }
}

async function swapPeriods(
  periodId: number,
  scheduleId: number
): Promise<LessonCycleDTO[]> {
  const response = await fetch('api', {
    method: 'PUT', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify([periodId, periodId, scheduleId])
  }); //PUT(periodId, periodId, scheduleId);

  return await response.json();
}

export const PeriodCardTransformer: CellDataTransformer<Period> = ({
  data: { periodId, startTime, description }
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
  const [isPending, startTransition] = useTransition();

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
    if (periodId) {
      const oldSet = periodIdToLessonCycleMap.get(periodId);
      const updatedIds = new Set<string>();
      oldSet?.forEach((lessonCycleId) => updatedIds.add(lessonCycleId));
      setCycleIds(updatedIds);
    }
  }, [periodIdToLessonCycleMap, setCycleIds, periodId]);

  const borderVisible = cycleIds.has(lessonCycleId);

  const additionalClassNames = [
    borderVisible ? '' : 'border-transparent',
    'items-center',
    periodId == focusPeriodId ? 'bg-emerald-100' : ''
  ];

  const concurrency = countConcurrency(
    highlightedSubjects,
    periodId,
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
    const updatedDtoList = await swapPeriods(periodId, scheduleId);

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
        onClick={() => handleCardClick(periodId)}
      >
        <p> {description}</p>
        <Badge className={`bg-${badgeColor}-300`}>{concurrency}</Badge>
      </div>
      <FillableButton
        pinIcon={PinIcons.arrowUpOnSquare}
        className={`z-20 ${rotationClass}`}
        isPinned={updatePending}
        setPinned={handleSwapClick}
      ></FillableButton>
    </InteractiveTableCard>
  );
};
