import { Card } from '@tremor/react';

import React, { PropsWithChildren } from 'react';
import { DataNode, GraphDto } from '../api/zod-mods';
import GraphContextProvider from './graph/graph-context-provider';
import { getCurriculumDeliveries } from '../api/actions/curriculum-delivery-model';
import CurriculumDeliveryGraph from './graph-types/organization/curriculum-delivery-graph';
import { GenericNodeContextProvider } from './nodes/generic-node-context-provider';
import { GenericLinkContextProvider } from './links/generic-link-context-provider';
import { OrganizationDto } from '../api/dtos/OrganizationDtoSchema';
import { HasNumberIdDto } from '../api/dtos/HasNumberIdDtoSchema';
import MountedTracker from './graph/mounted-tracker';
import NodePositionsTracker from './graph/node-positions-tracker';
import { ShowForceAdjustments } from './graph/show-force-adjustments';
import { ShowNodeEditing } from './show-node-editing';

export interface NodePayload<T extends HasNumberIdDto> {
  node: DataNode<T>;
  payload: React.JSX.Element;
}

const uniqueGraphName = 'party-dto-graph';

export default async function ForceGraphPage({
  dataGraph: organizationGraph,
  children
}: {
  dataGraph: GraphDto<OrganizationDto>;
} & PropsWithChildren) {
  const { nodes, closureDtos } = organizationGraph;

  return (
    <>
      <div className={'flex'}>
        <GenericNodeContextProvider
          nodes={nodes}
          uniqueGraphName={uniqueGraphName}
        >
          <GenericLinkContextProvider
            links={closureDtos}
            uniqueGraphName={uniqueGraphName}
          >
            <GraphContextProvider uniqueGraphName={uniqueGraphName}>
              <MountedTracker />
              <NodePositionsTracker />
              <ShowForceAdjustments />
              <ShowNodeEditing />
              {children}
            </GraphContextProvider>
          </GenericLinkContextProvider>
        </GenericNodeContextProvider>
      </div>
    </>
  );
}
