import { Card, Text, Title } from '@tremor/react';
import { BuildMetricsChart } from './buildMetricsChart';
import { BuildMetricDTO } from '../../../api/dto-interfaces';
import { fetchBuildMetricDto } from '../../api/route';
import MetricsContextProvider from './metrics-context-provider';

export default async function MetricsPage({
  params: { schedule, metrics }
}: {
  params: { schedule: string; metrics: string };
}) {
  const scheduleId = parseInt(schedule);

  const buildMetricDto: BuildMetricDTO = await fetchBuildMetricDto(scheduleId);

  return (
    <MetricsContextProvider buildMetricDto={buildMetricDto}>
      <Card>
        <Title>Build Metric Overview, Schedule {scheduleId}</Title>
        <Text>
          Total allocation loops: {buildMetricDto.totalAllocationLoops}
        </Text>
        <Text>Final State: {buildMetricDto.finalState}</Text>
        <BuildMetricsChart buildMetricData={buildMetricDto} />
      </Card>
    </MetricsContextProvider>
  );
}
