import React from 'react';
import { NameIdStringTuple } from '../../../api/dto-interfaces';
import { LessonCycleBuildMetricsCard } from './lessonCycle-build-metrics-card';
import { getFormattedPeriodsInCycle } from './api/route';

export default async function LessonCycleBuildMetrics({
  params: { schedule }
}: {
  params: { schedule: string };
}) {
  const allPeriodsInCycle = await getFormattedPeriodsInCycle();

  const scheduleId = parseInt(schedule);

  const apiBaseUrl = process.env.API_ACADEMIC_URL;

  const response = await fetch(
    `${apiBaseUrl}/get-list-of-lesson-cycle-metrics-with-infinity-costs?scheduleId=${schedule}`,
    {}
  );

  const availableLessonCycleMetrics: NameIdStringTuple[] =
    await response.json();

  return (
    <LessonCycleBuildMetricsCard
      schedule={schedule}
      nameIdStringTuples={availableLessonCycleMetrics}
      tableSchema={allPeriodsInCycle}
    />
  );
}
