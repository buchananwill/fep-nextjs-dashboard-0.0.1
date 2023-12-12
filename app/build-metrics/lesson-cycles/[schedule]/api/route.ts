import { NextRequest } from 'next/server';
import { fetchAllPeriodsInCycle } from '../../../../timetables/api/route';
import { fetch } from 'next/dist/compiled/@edge-runtime/primitives';

const apiBaseUrl = process.env.API_ACADEMIC_URL;

export async function getFormattedPeriodsInCycle() {
  const allPeriodsInCycle = await fetchAllPeriodsInCycle();

  allPeriodsInCycle.headerData = allPeriodsInCycle.headerData.map(
    (label) =>
      label.substring(0, 3) +
      ' ' +
      label.substring(label.length - 3, label.length)
  );
  return allPeriodsInCycle;
}

export async function getLessonCycleMetricsWithInfinityCosts(schedule: string) {
  return await fetch(
    `${apiBaseUrl}/get-list-of-lesson-cycle-metrics-with-infinity-costs?scheduleId=${schedule}`,
    {}
  );
}

export async function getLessonCycleBuildMetricSummary(lessonCycleId: string) {
  return await fetch(
    `${apiBaseUrl}/get-lesson-cycle-build-metric-summary?lessonCycleId=${lessonCycleId}`,
    {
      headers: {
        Accept: 'application/json'
      }
    }
  );
}
