import { Button, Card, Text, Title } from '@tremor/react';
import { BuildMetricsChart } from './buildMetricsChart';
import { BuildMetricDTO } from '../../api/dto-interfaces';
import {
  fetchBuildMetricDto,
  fetchScheduleIds
} from '../../timetables/api/route';
import MetricsContextProvider from './metrics-context-provider';
import DropdownParam from '../../components/dropdown-param';
import React from 'react';
import Link from 'next/link';

export default async function BuildMetricsOverview({
  params: { schedule }
}: {
  params: { schedule: string };
}) {
  const scheduleIds = await fetchScheduleIds();
  const filteredIds = scheduleIds.map((value) => value.toString());

  const scheduleId = parseInt(schedule);

  const buildMetricDto: BuildMetricDTO = await fetchBuildMetricDto(scheduleId);

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
