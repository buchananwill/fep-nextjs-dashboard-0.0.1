import { Card, Text, Title } from '@tremor/react';
import { BuildMetricsChart } from './buildMetricsChart';
import { BuildMetricDTO } from '../../../api/dto-interfaces';
import { fetchBuildMetricDto, fetchScheduleIds } from '../../api/route';
import MetricsContextProvider from './metrics-context-provider';
import DropdownParam from '../../../components/dropdown-param';
import React from 'react';

export default async function MetricsPage({
  params: { schedule }
}: {
  params: { schedule: string };
}) {
  const scheduleIds = await fetchScheduleIds();
  const filteredIds = scheduleIds
    .filter((number) => number > 1450)
    .map((value) => value.toString());

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
