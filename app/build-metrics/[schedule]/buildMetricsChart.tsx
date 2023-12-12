'use client';
import { LineChart } from '@tremor/react';
import { BuildMetricDTO, QueueTreeNodeDTO } from '../../api/dto-interfaces';
import { CustomToolTip } from './custom-metric-tooltip';

const chartData: QueueTreeNodeDTO[] = [
  {
    nodeNumber: 1,
    id: 'pretendUuid',
    netFailureCount: 30,
    totalAllocationArea: 14,
    subjectContactTimeUnits: [{ name: 'maths', value: 5 }]
  }
];

export function BuildMetricsChart({
  buildMetricData
}: {
  buildMetricData: BuildMetricDTO;
}) {
  const qtnArray = buildMetricData.queueTreeNodes;

  return qtnArray ? (
    <LineChart
      className="h-72 mt-4"
      data={qtnArray}
      index="nodeNumber"
      categories={['netFailureCount']}
      colors={['red', 'blue']}
      customTooltip={CustomToolTip}
    />
  ) : (
    <>No data.</>
  );
}
