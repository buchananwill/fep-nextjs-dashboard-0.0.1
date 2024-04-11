import React from 'react';
import { LessonCycleBuildMetricsCard } from './lesson-cycle-build-metrics-card';
import LessonCycleMetricContextProvider from './lesson-cycle-metric-context-provider';
import { getFormattedPeriodsInCycle } from '../../../api/actions/custom/cycle-model';
import {
  getLessonCycleBuildMetricSummary,
  getLessonCycleMetricsWithInfinityCosts
} from '../../../api/actions/custom/build-metrics';

export default async function LessonCycleBuildMetrics({
  params: { schedule },
  searchParams: { id }
}: {
  params: { schedule: string };
  searchParams: { id: string };
}) {
  const allPeriodsInCycle = await getFormattedPeriodsInCycle();

  const response = await getLessonCycleMetricsWithInfinityCosts(schedule);

  const availableLessonCycleMetrics = response.data;

  if (!id || availableLessonCycleMetrics === undefined) {
    return (
      <LessonCycleBuildMetricsCard
        selectedLessonCycle={{ name: '', id: '' }}
        schedule={schedule}
        nameIdStringTuples={[]}
        tableSchema={allPeriodsInCycle}
      />
    );
  }

  const foundLessonCycleMetric = availableLessonCycleMetrics.find(
    (tuple) => tuple.id === id
  );

  const lessonCycleSummaryResponse = await getLessonCycleBuildMetricSummary(id);

  const lessonCycleMetricSummary = lessonCycleSummaryResponse.data;

  const range: number[] = [0, 0];

  const periodToCostComparisonMap = new Map<number, number>();
  if (lessonCycleMetricSummary !== undefined) {
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
  }

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
