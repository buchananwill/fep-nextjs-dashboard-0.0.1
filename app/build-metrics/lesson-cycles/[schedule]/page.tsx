import {
  getFormattedPeriodsInCycle,
  getLessonCycleBuildMetricSummary,
  getLessonCycleMetricsWithInfinityCosts
} from './api/route';
import {
  LessonCycleMetricSummary,
  NameIdStringTuple
} from '../../../api/dto-interfaces';
import React from 'react';
import { LessonCycleBuildMetricsCard } from './lesson-cycle-build-metrics-card';
import LessonCycleMetricContextProvider from './lesson-cycle-metric-context-provider';

export default async function LessonCycleBuildMetrics({
  params: { schedule },
  searchParams: { lessonCycle }
}: {
  params: { schedule: string };
  searchParams: { lessonCycle: string };
}) {
  const allPeriodsInCycle = await getFormattedPeriodsInCycle();

  console.log('search param q: ', lessonCycle);

  const scheduleId = parseInt(schedule);
  const response = await getLessonCycleMetricsWithInfinityCosts(schedule);

  const availableLessonCycleMetrics: NameIdStringTuple[] =
    await response.json();

  if (!lessonCycle) {
    return (
      <LessonCycleBuildMetricsCard
        selectedLessonCycle={{ name: '', id: '' }}
        schedule={schedule}
        nameIdStringTuples={availableLessonCycleMetrics}
        tableSchema={allPeriodsInCycle}
      />
    );
  }

  const foundLessonCycleMetric = availableLessonCycleMetrics.find(
    (tuple) => tuple.id === lessonCycle
  );

  const lessonCycleSummaryResponse =
    await getLessonCycleBuildMetricSummary(lessonCycle);

  const lessonCycleMetricSummary: LessonCycleMetricSummary =
    await lessonCycleSummaryResponse.json();

  const range: number[] = [0, 0];

  const periodToCostComparisonMap = new Map<number, number>();
  lessonCycleMetricSummary.lessonCycleMetrics.map(
    ({ finiteCostCount, infinityCostCount, periodIdList }) => {
      periodIdList.forEach((periodId) => {
        const costDifference =
          finiteCostCount -
          infinityCostCount +
          (periodToCostComparisonMap.get(periodId) || 0);
        periodToCostComparisonMap.set(periodId, costDifference);
        if (costDifference < range[0]) range[0] = costDifference;
        if (costDifference > range[1]) range[1] = costDifference;
      });
    }
  );

  return (
    <LessonCycleMetricContextProvider
      computedContext={{ costMap: periodToCostComparisonMap, range: range }}
    >
      <LessonCycleBuildMetricsCard
        selectedLessonCycle={foundLessonCycleMetric || { name: '', id: '' }}
        schedule={schedule}
        nameIdStringTuples={availableLessonCycleMetrics}
        tableSchema={allPeriodsInCycle}
      />
    </LessonCycleMetricContextProvider>
  );
}
