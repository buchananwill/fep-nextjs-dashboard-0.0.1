import { Button, Card, Text, Title } from '@tremor/react';
import { BuildMetricsChart } from './buildMetricsChart';
import MetricsContextProvider from './metrics-context-provider';
import DropdownParam from '../../components/dropdown-param';
import React from 'react';
import Link from 'next/link';
import { BuildMetricDto } from '../../api/dtos/BuildMetricDtoSchema';
import { fetchScheduleIds } from '../../api/actions/timetables';
import { fetchBuildMetricDto } from '../../api/actions/build-metrics';
import { ActionResponsePromise } from '../../api/actions/actionResponse';
import { useDirectSimRefEditsController } from '../../graphing/editing/use-graph-edit-button-hooks';

export default async function BuildMetricsOverview({
  params: { schedule }
}: {
  params: { schedule: string };
}) {
  const { data: scheduleIds } = await fetchScheduleIds();

  let filteredIds: string[] = [];

  if (scheduleIds) {
    filteredIds = scheduleIds.map((value) => value.toString());
  }

  const scheduleId = parseInt(schedule);

  const buildMetricDtoResponse = await fetchBuildMetricDto(scheduleId);
  const buildMetricDto = buildMetricDtoResponse.data;
  if (buildMetricDto === undefined) {
    console.log(buildMetricDtoResponse.message);
    return <Card>No data found!</Card>;
  }

  return (
    <MetricsContextProvider buildMetricDto={buildMetricDto}>
      <Card>
        <div className="flex items-center">
          <Title className="mr-2">
            Build Metric Overview, Schedule {scheduleId}
          </Title>
          <DropdownParam paramOptions={filteredIds} />
          <Link href={`/build-metrics/lesson-cycles/${scheduleId}`}>
            <Button
              color="gray"
              className="ml-2 hover:bg-gray-400 outline-0 border-0"
            >
              Lesson Cycles
            </Button>
          </Link>
        </div>
        <Text>
          Total allocation loops: {buildMetricDto.totalAllocationLoops}
        </Text>
        <Text>Final State: {buildMetricDto.finalState}</Text>
        <BuildMetricsChart buildMetricData={buildMetricDto} />
      </Card>
    </MetricsContextProvider>
  );
}
