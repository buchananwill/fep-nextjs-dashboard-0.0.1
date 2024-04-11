'use client';

import { WorkTaskTypeDto } from '../../../api/dtos/WorkTaskTypeDtoSchema';
import { DataNode } from '../../../api/zod-mods';
import { NodeLinkRefWrapper } from '../../graph/node-link-ref-wrapper';
import { useNodeAndLinkRefs } from '../../graph/use-node-and-link-refs';
import { useNodeEditing } from '../../editing/functions/use-node-editing';
import { getGraphUpdaterWithNameDeDuplication } from '../organization/curriculum-delivery-graph';
import { CloneFunctionWrapper } from './clone-work-task-type';
import { NodePayload } from '../../force-graph-page';
import React from 'react';
import WorkTaskTypeDtoDetails from './work-task-type-dto-details';
import NodeDetails from '../../components/node-details';
import { putGraph } from '../../../api/READ-ONLY-generated-actions/WorkTaskType';

const graphUpdater = getGraphUpdaterWithNameDeDuplication(putGraph);

export function LessonTypeHierarchyGraph() {
  const { nodes, nodesRef, linksRef } = useNodeAndLinkRefs<WorkTaskTypeDto>();

  const lessonTypeList: string[] = [];

  const unsavedNodeChangesProps = useNodeEditing(
    nodesRef,
    linksRef,
    CloneFunctionWrapper,
    graphUpdater
  );

  nodes.forEach((n: DataNode<WorkTaskTypeDto>) => {
    lessonTypeList.push(n.data.name);
  });

  const titleList = nodesRef.current.map(
    (n: DataNode<WorkTaskTypeDto>) =>
      n.data?.serviceCategoryKnowledgeDomainDescriptor || ''
  );

  const nodeDetailElements: NodePayload<WorkTaskTypeDto>[] =
    nodesRef.current.map((node) => {
      return {
        node: node,
        payload: (
          <WorkTaskTypeDtoDetails
            key={`delivery-details-${node.data.id}`}
            node={node}
          ></WorkTaskTypeDtoDetails>
        )
      };
    });

  return (
    <NodeLinkRefWrapper
      nodeListRef={nodesRef}
      titleList={titleList}
      linkListRef={linksRef}
      textList={lessonTypeList}
      unsavedNodeChangesProps={unsavedNodeChangesProps}
    >
      <NodeDetails
        nodeDetailElements={nodeDetailElements}
        labels={lessonTypeList}
      />
    </NodeLinkRefWrapper>
  );
}
