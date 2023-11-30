import { Card, Title } from '@tremor/react';
import { BuildMetricsChart } from './buildMetricsChart';
import { BuildMetricDTO } from '../../../api/dto-interfaces';
import { fetchBuildMetricDto } from '../../api/route';

export default async function MetricsPage({
  params: { schedule, metrics }
}: {
  params: { schedule: string; metrics: string };
}) {
  const scheduleId = parseInt(schedule);

  const buildMetricDto: BuildMetricDTO = await fetchBuildMetricDto(scheduleId);

  return (
    <>
      <Card>
        <Title>Build Metric Overview</Title>
        <BuildMetricsChart buildMetricData={buildMetricDto} />
      </Card>
    </>
  );
}
