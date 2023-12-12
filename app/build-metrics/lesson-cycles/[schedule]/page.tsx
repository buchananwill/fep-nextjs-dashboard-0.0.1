import { Card } from '@tremor/react';
import { fetchAllPeriodsInCycle } from '../../../timetables/api/route';
import DynamicDimensionTimetable, {
  HeaderTransformer
} from '../../../components/dynamic-dimension-timetable';
import { BuildMetricPeriodCardTransformer } from './period-card';
import React from 'react';
import { NameIdStringTuple } from '../../../api/dto-interfaces';
import LessonCycleSelector from './lesson-cycle-selector';
import { usePathname } from 'next/navigation';

export default async function LessonCycleBuildMetrics({
  params: { schedule }
}: {
  params: { schedule: string };
}) {
  const allPeriodsInCycle = await fetchAllPeriodsInCycle();

  allPeriodsInCycle.headerData = allPeriodsInCycle.headerData.map(
    (label) =>
      label.substring(0, 3) +
      ' ' +
      label.substring(label.length - 3, label.length)
  );

  const scheduleId = parseInt(schedule);

  const apiBaseUrl = process.env.API_ACADEMIC_URL;

  const response = await fetch(
    `${apiBaseUrl}/get-list-of-lesson-cycle-metrics-with-infinity-costs?scheduleId=${schedule}`,
    {}
  );

  const availableLessonCycleMetrics: NameIdStringTuple[] =
    await response.json();

  return (
    <Card>
      Build metrics for the lesson cycles in schedule {schedule}
      {availableLessonCycleMetrics.length > 0 && (
        <LessonCycleSelector
          availableLessonCycleMetrics={availableLessonCycleMetrics}
        />
      )}
      <DynamicDimensionTimetable
        tableContents={allPeriodsInCycle}
        headerTransformer={HeaderTransformerConcrete}
        cellDataTransformer={BuildMetricPeriodCardTransformer}
      />
    </Card>
  );
}

const HeaderTransformerConcrete: HeaderTransformer<string> = ({ data }) => {
  return <p className="w-18 text-center">{data}</p>;
};
