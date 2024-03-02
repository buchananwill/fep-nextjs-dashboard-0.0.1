import { Card } from '@tremor/react';

import React from 'react';
import { DataNode, GraphDto } from '../api/zod-mods';
import GraphContextProvider from './graph/graph-context-provider';
import {
  getCurriculumDeliveries,
  getOrganizationGraph
} from '../api/actions/curriculum-delivery-model';
import { PartyDto } from '../api/dtos/PartyDtoSchema';
import CurriculumDeliveryGraph from './graph-types/curriculum-delivery-graph';
import { GenericNodeContextProvider } from './nodes/generic-node-context-provider';
import { GenericLinkContextProvider } from './links/generic-link-context-provider';
import { OrganizationDto } from '../api/dtos/OrganizationDtoSchema';

export interface NodePayload<T> {
  node: DataNode<T>;
  payload: React.JSX.Element;
}

const uniqueGraphName = 'party-dto-graph';
export default async function ForceGraphPage() {
  const actionResponse = await getOrganizationGraph();

  if (!actionResponse.data) {
    return <Card>No graphs!</Card>;
  }

  const organizationGraph: GraphDto<OrganizationDto> = actionResponse.data;

  const { nodes, closureDtos } = organizationGraph;

  const organizationIds = organizationGraph.nodes.map(
    (dateNode) => dateNode.data.id
  );
  const actionResponse2 = await getCurriculumDeliveries(organizationIds);

  const { data } = actionResponse2;

  if (data === undefined) {
    return <Card>No deliveries!</Card>;
  }

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
              {/*<NodeComponentSkyHook*/}
              {/*  nodes={organizationGraph.nodes}*/}
              {/*  bundles={bundlesInNodeOrder as WorkSeriesBundleDeliveryDto[]}*/}
              {/*>*/}
              <CurriculumDeliveryGraph
                graphData={organizationGraph}
                bundles={data}
              ></CurriculumDeliveryGraph>
              {/*</NodeComponentSkyHook>*/}
            </GraphContextProvider>
          </GenericLinkContextProvider>
        </GenericNodeContextProvider>
      </div>
    </>
  );
}
