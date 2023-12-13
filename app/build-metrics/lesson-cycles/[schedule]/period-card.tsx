'use client';
import { CellDataTransformer } from '../../../components/dynamic-dimension-timetable';
import { Period } from '../../../api/dto-interfaces';
import React, { useContext, useState, useTransition } from 'react';
import InteractiveTableCard from '../../../components/interactive-table-card';

import { Badge } from '@tremor/react';
import { LessonCycleMetricContext } from './lesson-cycle-metric-context';

function getColorGrade(cost: number, bound: number) {
  return (Math.round((cost * 6) / bound) + 1) * 100;
}

function getBadgeAndTextColor(cost: number, range: number[]) {
  if (cost > 0) {
    const bound = range[1];
    const badgeColorGrade = getColorGrade(cost, bound);
    const textColorGrade = badgeColorGrade > 300 ? 100 : 800;
    return `bg-emerald-${badgeColorGrade} text-gray-${textColorGrade}`;
  } else if (cost < 0) {
    const bound = range[0];
    const badgeColorGrade = getColorGrade(cost, bound);
    const textColorGrade = badgeColorGrade > 300 ? 100 : 800;
    return `bg-red-${badgeColorGrade} text-gray-${textColorGrade}`;
  } else return 'gray-300';
}

export const BuildMetricPeriodCardTransformer: CellDataTransformer<Period> = ({
  data: { periodId, startTime, description }
}) => {
  const [isPending, startTransition] = useTransition();

  const { costMap, range } = useContext(LessonCycleMetricContext);

  const handleCardClick = (periodId: number | null) => {};

  const [cycleIds, setCycleIds] = useState<Set<string>>(new Set());

  const periodAvailabilityCost = costMap.get(periodId) || 0;

  const badgeColor = getBadgeAndTextColor(periodAvailabilityCost, range);

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
        <Badge className={badgeColor}>{periodAvailabilityCost}</Badge>
      </div>
    </InteractiveTableCard>
  );
};
