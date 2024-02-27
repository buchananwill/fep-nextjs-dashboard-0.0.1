import { Card } from '@tremor/react';

import React from 'react';
import { DataNode, GraphDto } from '../api/zod-mods';
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
import { getWorkSeriesBundleNodeElements } from './aggregate-functions/get-node-elements';
import { WorkSeriesBundleDeliveryDto } from '../api/dtos/WorkSeriesBundleDeliveryDtoSchema';
import NodeComponentSkyHook from './nodes/node-component-sky-hook';

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

  const bundlesInNodeOrder = organizationGraph.nodes.map((node) => {
    const found = data.find((delivery) => delivery.partyId === node.id);
    if (found) return found;
  });

  if (bundlesInNodeOrder.length !== organizationGraph.nodes.length) {
    return <Card>Bundles not matching nodes!</Card>;
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
      return {
        node: node,
        payload: (
          <CurriculumDeliveryDetails
            key={`delivery-details-${node.data.id}`}
            deliveryBundle={bundlesInNodeOrder[index]}
            node={node}
          ></CurriculumDeliveryDetails>
        )
      };
    });

  return (
    <>
      <div className={'flex'}>
        <GraphContextProvider uniqueGraphName={'party-dto-graph'}>
          <NodeComponentSkyHook
            nodes={organizationGraph.nodes}
            bundles={bundlesInNodeOrder as WorkSeriesBundleDeliveryDto[]}
          >
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
          </NodeComponentSkyHook>
        </GraphContextProvider>
      </div>
    </>
  );
}
