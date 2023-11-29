'use client';
import { CellDataTransformer } from '../components/dynamic-dimension-timetable';
import { Period } from '../api/dto-interfaces';
import React, { useContext, useEffect, useState, useTransition } from 'react';
import InteractiveTableCard from '../components/interactive-table-card';
import {
  TimetablesContext,
  TimetablesDispatchContext
} from './timetables-context';
import { Badge } from '@tremor/react';
import { LessonCycle } from '../api/state-types';
import { FillableButton, PinIcons } from '../components/fillable-button';
import { swapTwoPeriods } from './api/route';
import { usePathname, useRouter } from 'next/navigation';
import * as repl from 'repl';

function countConcurrency(
  highlightedSubjects: Set<string>,
  periodId: number | null,
  map: Map<number, Set<LessonCycle>>
) {
  let concurrency = 0;
  if (!periodId) return concurrency;
  const setOrUndefined = map.get(periodId);
  if (!setOrUndefined) return concurrency;
  setOrUndefined.forEach((lessonCycle) => {
    if (highlightedSubjects.has(lessonCycle.subject)) concurrency++;
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

export const PeriodCardTransformer: CellDataTransformer<Period> = ({
  data: { periodId, startTime, description }
}) => {
  const {
    focusPeriodId,
    lessonCycleId,
    periodIdToLessonCycleMap,
    highlightedSubjects
  } = useContext(TimetablesContext);
  const dispatch = useContext(TimetablesDispatchContext);
  const [isPending, startTransition] = useTransition();
  const [isPinned, setPinned] = useState(false);
  const { refresh, replace, push } = useRouter();
  const pathname = usePathname();

  const handleCardClick = (periodId: number | null) => {
    console.log('Period Id: ', periodId);

    startTransition(() => {
      dispatch({
        type: 'setFocusPeriod',
        periodId: periodId
      });
    });
  };
  const [cycleIds, setCycleIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (periodId) {
      const oldSet = periodIdToLessonCycleMap.get(periodId);
      const updatedIds = new Set<number>();
      oldSet?.forEach((lessonCycle) => updatedIds.add(lessonCycle.id));
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
    periodIdToLessonCycleMap
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
    setPinned(true);
    swapTwoPeriods(periodId, periodId)
      .then(() => push('/timetables'))
      .finally(() => {
        setPinned(false);
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
        isPinned={isPinned}
        setPinned={handleSwapClick}
      ></FillableButton>
    </InteractiveTableCard>
  );
};
