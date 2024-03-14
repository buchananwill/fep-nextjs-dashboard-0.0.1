'use client';
import { LineChart } from '@tremor/react';

import CustomToolTip from './custom-metric-tooltip';
import { BuildMetricDto } from '../../api/dtos/BuildMetricDtoSchema';

export function BuildMetricsChart({
  buildMetricData
}: {
  buildMetricData: BuildMetricDto;
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
