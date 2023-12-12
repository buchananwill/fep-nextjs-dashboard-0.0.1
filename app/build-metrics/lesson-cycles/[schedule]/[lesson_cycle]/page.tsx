import {
  getFormattedPeriodsInCycle,
  getLessonCycleMetricsWithInfinityCosts
} from '../api/route';
import { NameIdStringTuple } from '../../../../api/dto-interfaces';
import React from 'react';
import { LessonCycleBuildMetricsCard } from '../lessonCycle-build-metrics-card';

export default async function LessonCycleBuildMetrics({
  params: { schedule },
  searchParams: { q }
}: {
  params: { schedule: string };
  searchParams: { q: string };
}) {
  const allPeriodsInCycle = await getFormattedPeriodsInCycle();

  const scheduleId = parseInt(schedule);
  const response = await getLessonCycleMetricsWithInfinityCosts(schedule);

  const availableLessonCycleMetrics: NameIdStringTuple[] =
    await response.json();

  const foundLessonCycleMetric = availableLessonCycleMetrics.find(
    (tuple) => tuple.id === q
  );

  return (
    <LessonCycleBuildMetricsCard
      selectedLessonCycle={foundLessonCycleMetric || { name: '', id: '' }}
      schedule={schedule}
      nameIdStringTuples={availableLessonCycleMetrics}
      tableSchema={allPeriodsInCycle}
    />
  );
}
