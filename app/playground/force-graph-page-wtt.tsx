import { Card } from '@tremor/react';

import React from 'react';
import { DataNode, GraphDto } from '../api/zod-mods';
import { GraphViewer } from './graph/graph-viewer';
import GraphForceAdjuster from './components/graph-force-adjustment';
import GraphContextProvider from './graph/graph-context-provider';

import NodeDetails from './components/node-details';

import { WorkTaskTypeDto } from '../api/dtos/WorkTaskTypeDtoSchema';
import { getWorkTaskTypeGraph } from '../api/actions/work-task-types';
import WorkTaskTypeDtoDetails from './components/work-task-type-dto-details';

export interface NodePayload<T> {
  node: DataNode<T>;
  payload: React.JSX.Element;
}

export default async function ForceGraphPageWtt() {
  const actionResponse = await getWorkTaskTypeGraph();

  if (!actionResponse.data) {
    return <Card>No graphs!</Card>;
  }
  // const workTaskTypeGraph: GraphDto<WorkTaskTypeDto> = actionResponse.data;
  const workTaskTypeGraph: GraphDto<WorkTaskTypeDto> = actionResponse.data;

  const descriptionList: string[] = [];
  const componentList: string[] = [];

  workTaskTypeGraph.nodes.forEach((n: DataNode<WorkTaskTypeDto>) => {
    descriptionList.push(n.data.name);
    componentList.push(n.data.name);
  });

  const titleList = workTaskTypeGraph.nodes.map(
    (n: DataNode<WorkTaskTypeDto>) => n.data.serviceCategoryName
  );

  const nodeDetailElements: NodePayload<WorkTaskTypeDto>[] =
    workTaskTypeGraph.nodes.map((node, index) => ({
      node,
      payload: (
        <WorkTaskTypeDtoDetails
          key={index}
          node={node}
        ></WorkTaskTypeDtoDetails>
      )
    }));

  return (
    <>
      <div className={'flex'}>
        <GraphContextProvider uniqueGraphName={'party-dto-graph'}>
          <GraphViewer
            graphDto={workTaskTypeGraph}
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
