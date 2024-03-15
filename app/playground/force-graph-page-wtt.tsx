import { Card } from '@tremor/react';

import React from 'react';
import { DataNode, GraphDto } from '../api/zod-mods';
import { GraphViewer } from '../graphing/graph/graph-viewer';
import GraphForceAdjuster from '../graphing/components/graph-force-adjustment';
import GraphContextProvider from '../graphing/graph/graph-context-provider';

import NodeDetails from '../graphing/components/node-details';

import { WorkTaskTypeDto } from '../api/dtos/WorkTaskTypeDtoSchema';
import { getWorkTaskTypeGraph } from '../api/actions/work-task-types';
import WorkTaskTypeDtoDetails from '../graphing/components/work-task-type-dto-details';
import { HasNumberIdDto } from '../api/dtos/HasNumberIdDtoSchema';
import { GenericNodeContextProvider } from '../graphing/nodes/generic-node-context-provider';
import { GenericLinkContextProvider } from '../graphing/links/generic-link-context-provider';

export interface NodePayload<T extends HasNumberIdDto> {
  node: DataNode<T>;
  payload: React.JSX.Element;
}

export default async function ForceGraphPageWtt() {
  const actionResponse = await getWorkTaskTypeGraph(typeNameLike);

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

  const uniqueGraphName = 'work-task-type-graph';
  return (
    <>
      <div className={'flex'}>
        <GenericNodeContextProvider
          nodes={workTaskTypeGraph.nodes}
          uniqueGraphName={uniqueGraphName}
        >
          <GenericLinkContextProvider
            links={workTaskTypeGraph.closureDtos}
            uniqueGraphName={uniqueGraphName}
          >
            <GraphContextProvider uniqueGraphName={uniqueGraphName}>
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
          </GenericLinkContextProvider>
        </GenericNodeContextProvider>
      </div>
    </>
  );
}
