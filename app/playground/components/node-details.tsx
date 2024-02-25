import React from 'react';
import { NodeDetailWrapper } from './node-detail-wrapper';
import { NodePayload } from '../force-graph-page';

export default function NodeDetails<T>({
  nodeDetailElements,
  labels
}: {
  nodeDetailElements: NodePayload<T>[];
  labels: string[];
}) {
  return (
    <div>
      {nodeDetailElements.map((detailElement, index) => (
        <NodeDetailWrapper
          key={`${index}-${labels[index]}`}
          label={`Task ${index + 1}: ${labels[index]}`}
          node={detailElement.node}
        >
          {detailElement.payload}
        </NodeDetailWrapper>
      ))}
    </div>
  );
}
