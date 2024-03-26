'use client';
import React, { PropsWithChildren } from 'react';
import { DataNode, GraphDto } from '../api/zod-mods';
import GraphContextProvider from './graph/graph-context-provider';
import { GenericNodeContextProvider } from './nodes/generic-node-context-provider';
import { GenericLinkContextProvider } from './links/generic-link-context-provider';
import { HasNumberIdDto } from '../api/dtos/HasNumberIdDtoSchema';
import MountedTracker from './graph/mounted-tracker';
import NodePositionsTracker from './graph/node-positions-tracker';
import { ShowForceAdjustments } from './graph/show-force-adjustments';
import { ShowNodeEditing } from './show-node-editing';

export interface NodePayload<T extends HasNumberIdDto> {
  node: DataNode<T>;
  payload: React.JSX.Element;
}
export default function ForceGraphPage<T extends HasNumberIdDto>({
  dataGraph: graphDto,
  graphName,
  children
}: {
  dataGraph: GraphDto<T>;
  graphName: string;
} & PropsWithChildren) {
  const { nodes, closureDtos } = graphDto;

  return (
    <div className={'flex'}>
      <GraphContextProvider uniqueGraphName={graphName}>
        <GenericNodeContextProvider nodes={nodes}>
          <GenericLinkContextProvider links={closureDtos}>
            <MountedTracker />
            <NodePositionsTracker />
            <ShowForceAdjustments />
            <ShowNodeEditing />
            {children}
          </GenericLinkContextProvider>
        </GenericNodeContextProvider>
      </GraphContextProvider>
    </div>
  );
}
