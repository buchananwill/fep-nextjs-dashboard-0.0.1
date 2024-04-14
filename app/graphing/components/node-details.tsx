import React, { FC } from 'react';
import { NodeDetailWrapper } from './node-detail-wrapper';
import { NodePayload } from '../force-graph-page';
import { HasNumberIdDto } from '../../api/dtos/HasNumberIdDtoSchema';
import { NodeDetailsUiComponentProps } from '../graph-types/work-task-types/work-task-type-dto-details';

export default function NodeDetails<T extends HasNumberIdDto>({
  nodeDetailElements,
  labels,
  detailsUiComponent
}: {
  nodeDetailElements: NodePayload<T>[];
  labels: string[];
  detailsUiComponent?: FC<NodeDetailsUiComponentProps<T>>;
}) {
  return (
    <div>
      {nodeDetailElements.map((detailElement, index) => (
        <NodeDetailWrapper
          key={`${index}-${labels[index]}`}
          label={`${labels[index]}`}
          node={detailElement.node}
          detailsUiComponent={detailsUiComponent}
        />
      ))}
    </div>
  );
}
