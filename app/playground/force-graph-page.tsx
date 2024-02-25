import { Card } from '@tremor/react';

import React from 'react';
import { DataNode, GraphDto } from '../api/zod-mods';
import { ProductComponentStateDto } from '../api/dtos/ProductComponentStateDtoSchema';
import { GraphViewer } from './graph/graph-viewer';
import GraphForceAdjuster from './components/graph-force-adjustment';
import GraphContextProvider from './graph/graph-context-provider';
import PartyDtoDetails from './components/party-dto-details';
import NodeDetails from './components/node-details';
import { getOrganizationGraph } from '../api/actions/curriculum-delivery-model';
import { PartyDto } from '../api/dtos/PartyDtoSchema';

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

  const descriptionList: string[] = [];
  const componentList: string[] = [];

  organizationGraph.nodes.forEach((n: DataNode<PartyDto>) => {
    descriptionList.push(n.data.name);
    componentList.push(n.data.name);
  });

  const titleList = organizationGraph.nodes.map(
    (n: DataNode<PartyDto>) => n.data.partyType
  );

  const nodeDetailElements: NodePayload<PartyDto>[] =
    organizationGraph.nodes.map((node, index) => ({
      node,
      payload: <PartyDtoDetails key={index} node={node}></PartyDtoDetails>
    }));

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
              labels={componentList}
            />
          </GraphViewer>
        </GraphContextProvider>
      </div>
    </>
  );
}
