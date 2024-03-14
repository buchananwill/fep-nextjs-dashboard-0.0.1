'use client';
import { ComponentType, useContext } from 'react';

import { MetricsContext } from './metrics-context';

import { CustomTooltipProps } from '@tremor/react';

export default function CustomToolTip({ payload, active }: CustomTooltipProps) {
  const { queueTreeNodes } = useContext(MetricsContext);

  if (!active || !payload || !queueTreeNodes) return null;

  const qTreeNode = queueTreeNodes[payload[0].payload.nodeNumber];

  return (
    <div className="w-56 rounded-tremor-default text-tremor-default bg-tremor-background p-2 shadow-tremor-dropdown border border-tremor-border">
      {payload.map((category, idx) => (
        <div key={idx} className="flex flex-1 space-x-2.5">
          <div
            className={`w-1 flex flex-col bg-${category.color}-500 rounded`}
          />
          <div className="space-y-1">
            <p className="text-tremor-content">
              Node Number: {category.payload.nodeNumber}
            </p>
            <p className="font-medium text-tremor-content-emphasis">
              Failure Count: {category.payload.netFailureCount}
            </p>
            <div className="text-xs text-tremor-content">
              <p className="font-medium text-tremor-content-emphasis">
                Year Group: {category.payload.yearGroup}
              </p>
              <p>Task Size: {category.payload.taskSize}</p>
              <p>Degree of Nesting: {category.payload.degreeOfNesting}</p>
              <p>Batch Size: {category.payload.batchSize}</p>
              <p>
                Total Allocation Area: {category.payload.totalAllocationArea}
              </p>
              <div className="mt-2">
                <p className="text-tremor-content-emphasis font-bold">
                  Periods per subject:
                </p>
                {qTreeNode.subjectContactTimeUnits?.map(
                  ({ name, value }, index) => (
                    <p key={index}>
                      {name}: {value}
                    </p>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
