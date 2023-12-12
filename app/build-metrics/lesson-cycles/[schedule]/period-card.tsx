'use client';
import { CellDataTransformer } from '../../../components/dynamic-dimension-timetable';
import { Period } from '../../../api/dto-interfaces';
import React, { useContext, useEffect, useState, useTransition } from 'react';
import InteractiveTableCard from '../../../components/interactive-table-card';

import { Badge } from '@tremor/react';

import { FillableButton, PinIcons } from '../../../components/fillable-button';
import { LessonCycle } from '../../../api/state-types';

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

export const BuildMetricPeriodCardTransformer: CellDataTransformer<Period> = ({
  data: { periodId, startTime, description }
}) => {
  const [isPending, startTransition] = useTransition();

  const handleCardClick = (periodId: number | null) => {};
  const [cycleIds, setCycleIds] = useState<Set<string>>(new Set());

  const badgeColor = getBadgeColor(0);

  return (
    <InteractiveTableCard
      decorationColor="blue"
      additionalClassNames={['border-transparent', 'max-w-full']}
    >
      <div
        className="flex w-full h-full justify-between pr-2"
        onClick={() => handleCardClick(periodId)}
      >
        <p> {description}</p>
        <Badge className={`bg-${badgeColor}-300`}>{0}</Badge>
      </div>
    </InteractiveTableCard>
  );
};
