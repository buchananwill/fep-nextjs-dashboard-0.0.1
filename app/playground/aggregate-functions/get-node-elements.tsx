import { DataNode } from '../../api/zod-mods';
import { NodeComponent } from '../nodes/node-component';
import React from 'react';

export function getNodeElements<T>(nodes: DataNode<T>[]) {
  return nodes.map((d, index) => (
    <NodeComponent
      key={`node-${d.id}`}
      enableRunnable={true}
      nodeIndex={index}
    />
  ));
}
