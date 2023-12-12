import { NextRequest } from 'next/server';
import { fetchAllPeriodsInCycle } from '../../../../timetables/api/route';

export const GET = (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  searchParams.get('scheduleId');
  return { status: 200, body: [] };
};

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
  const apiBaseUrl = process.env.API_ACADEMIC_URL;

  return await fetch(
    `${apiBaseUrl}/get-list-of-lesson-cycle-metrics-with-infinity-costs?scheduleId=${schedule}`,
    {}
  );
}
