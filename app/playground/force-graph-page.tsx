import { Card } from '@tremor/react';

import React from 'react';
import { DataNode, GraphDto } from '../api/zod-mods';
import { ProductComponentStateDto } from '../api/dtos/ProductComponentStateDtoSchema';
import { GraphViewer } from './graph/graph-viewer';
import GraphForceAdjuster from './components/graph-force-adjustment';
import GraphContextProvider from './graph/graph-context-provider';
import CurriculumDeliveryDetails from './components/curriculum-delivery-details';
import NodeDetails from './components/node-details';
import {
  getCurriculumDeliveries,
  getOrganizationGraph
} from '../api/actions/curriculum-delivery-model';
import { PartyDto } from '../api/dtos/PartyDtoSchema';
import { getWorkTaskTypeGraph } from '../api/actions/work-task-types';
import { WorkTaskTypeDto } from '../api/dtos/WorkTaskTypeDtoSchema';
import { WorkProjectSeriesDeliveryDto } from '../api/dtos/WorkProjectSeriesDeliveryDtoSchema';

export interface NodePayload<T> {
  node: DataNode<T>;
  payload: React.JSX.Element;
}

export default async function ForceGraphPage() {
  const actionResponse = await getOrganizationGraph();

  if (!actionResponse.data) {
    return <Card>No graphs!</Card>;
  }
  const organizationGraph: GraphDto<PartyDto> = actionResponse.data;

  const partyIds = organizationGraph.nodes.map((dateNode) => dateNode.data.id);
  const actionResponse2 = await getCurriculumDeliveries(partyIds);

  const { data } = actionResponse2;

  if (data === undefined) {
    return <Card>No deliveries!</Card>;
  }

  const classList: string[] = [];
  const descriptionList: string[] = [];

  organizationGraph.nodes.forEach((n: DataNode<PartyDto>) => {
    classList.push(n.data.name);
    descriptionList.push(n.data.name);
  });

  const titleList = organizationGraph.nodes.map(
    (n: DataNode<PartyDto>) => n.data.partyType
  );

  const nodeDetailElements: NodePayload<PartyDto>[] =
    organizationGraph.nodes.map((node, index) => {
      const deliveries = data.filter(
        (delivery) => delivery.partyId === node.id
      );
      return {
        node: node,
        payload: (
          <CurriculumDeliveryDetails
            key={`delivery-details-${node.data.id}`}
            deliveryList={deliveries}
            node={node}
          ></CurriculumDeliveryDetails>
        )
      };
    });

  return (
    <>
      <div className={'flex'}>
        <GraphContextProvider uniqueGraphName={'party-dto-graph'}>
          <GraphViewer
            graphDto={organizationGraph}
            textList={descriptionList}
            titleList={titleList}
            uniqueGraphName={'party-dto-graph'}
          >
            <GraphForceAdjuster />
            <NodeDetails
              nodeDetailElements={nodeDetailElements}
              labels={classList}
            />
          </GraphViewer>
        </GraphContextProvider>
      </div>
    </>
  );
}
