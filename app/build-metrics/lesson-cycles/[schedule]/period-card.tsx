'use client';

import React, { useContext } from 'react';

import { Badge } from '@tremor/react';
import { LessonCycleMetricContext } from './lesson-cycle-metric-context';
import { PeriodDTO } from '../../../api/dtos/PeriodDTOSchema';
import { CellDataTransformer } from '../../../generic/components/tables/dynamic-dimension-timetable';
import InteractiveTableCard from '../../../generic/components/tables/interactive-table-card';

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

export const BuildMetricPeriodCardTransformer: CellDataTransformer<
  PeriodDTO
> = ({ data: { id, description } }) => {
  const { costMap, range } = useContext(LessonCycleMetricContext);

  const handleCardClick = () => {};

  const periodAvailabilityCost = costMap.get(id) || 0;

  const badgeColor = getBadgeAndTextColor(periodAvailabilityCost, range);

  return (
    <InteractiveTableCard
      decorationColor="blue"
      additionalClassNames={['border-transparent', 'max-w-full']}
    >
      <div
        className="flex w-full h-full justify-between pr-2"
        onClick={() => handleCardClick()}
      >
        <p> {description}</p>
        <Badge className={badgeColor}>{periodAvailabilityCost}</Badge>
      </div>
    </InteractiveTableCard>
  );
};
