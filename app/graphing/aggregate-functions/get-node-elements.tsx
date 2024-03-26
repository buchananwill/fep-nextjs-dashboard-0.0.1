import { DataNode } from '../../api/zod-mods';
import { NodeComponent } from '../nodes/node-component';
import React, { useContext } from 'react';
import { NodeComponentContext } from '../nodes/node-component-context';
import { HasNumberIdDto } from '../../api/dtos/HasNumberIdDtoSchema';

export function useBasicNodeElements<T extends HasNumberIdDto>(
  nodes: DataNode<T>[]
) {
  const nodeComponentSource = useContext(NodeComponentContext);
  let getter = nodeComponentSource.getNodeElements;
  if (getter) {
    return getter();
  }

  return nodes.map((d, index) => (
    <NodeComponent
      key={`node-${d.id}`}
      enableRunnable={true}
      nodeIndex={index}
      nodeId={d.id}
    />
  ));
}
