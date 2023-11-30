'use client';
import { LineChart } from '@tremor/react';
import { ComponentType } from 'react';
import { CustomTooltipType } from '@tremor/react/dist/components/chart-elements/common/CustomTooltipProps';
import { BuildMetricDTO, QueueTreeNodeDTO } from '../../../api/dto-interfaces';
const chartData: QueueTreeNodeDTO[] = [
  {
    nodeNumber: 1,
    uuid: 'pretendUuid',
    netFailureCount: 30,
    totalAllocationArea: 14,
    subjectBandwidths: {
      maths: 7
    }
  }
];

export function BuildMetricsChart({
  buildMetricData
}: {
  buildMetricData: BuildMetricDTO;
}) {
  console.log('Build metric data: ', buildMetricData);

  const qtnArray = buildMetricData.queueTreeNodes
    ? buildMetricData.queueTreeNodes
    : chartData;

  return (
    <LineChart
      className="h-72 mt-4"
      data={qtnArray}
      index="nodeNumber"
      categories={['netFailureCount', 'totalAllocationArea']}
      colors={['red', 'blue']}
      customTooltip={customTooltip}
    />
  );
}

const customTooltip: ComponentType<CustomTooltipType> = ({
  payload,
  active
}: CustomTooltipType) => {
  if (!active || !payload) return null;
  return (
    <div className="w-56 rounded-tremor-default text-tremor-default bg-tremor-background p-2 shadow-tremor-dropdown border border-tremor-border">
      {payload.map((category, idx) => (
        <div key={idx} className="flex flex-1 space-x-2.5">
          <div
            className={`w-1 flex flex-col bg-${category.color}-500 rounded`}
          />
          <div className="space-y-1">
            <p className="text-tremor-content">
              Node Number: {idx}, {category.dataKey}
            </p>
            <p className="font-medium text-tremor-content-emphasis">
              {category.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
