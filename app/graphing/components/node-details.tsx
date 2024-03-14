import React from 'react';
import { NodeDetailWrapper } from './node-detail-wrapper';
import { NodePayload } from '../force-graph-page';
import { HasNumberIdDto } from '../../api/dtos/HasNumberIdDtoSchema';

export default function NodeDetails<T extends HasNumberIdDto>({
  nodeDetailElements,
  labels
}: {
  nodeDetailElements: NodePayload<T>[];
  labels: string[];
}) {
  console.log('Rendering node details.');
  return (
    <div>
      {nodeDetailElements.map((detailElement, index) => (
        <NodeDetailWrapper
          key={`${index}-${labels[index]}`}
          label={`${labels[index]}`}
          node={detailElement.node}
        >
          {detailElement.payload}
        </NodeDetailWrapper>
      ))}
    </div>
  );
}
