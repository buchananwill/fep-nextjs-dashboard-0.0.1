'use client';

import { WorkTaskTypeDto } from '../../api/dtos/WorkTaskTypeDtoSchema';
import { DataNode } from '../../api/zod-mods';
import { NodeLinkRefWrapper } from '../../graphing/graph/node-link-ref-wrapper';
import { useNodeCloneFunction } from '../../graphing/editing/use-node-clone-function';
import { useNodeAndLinkRefs } from '../../graphing/graph-types/organization/use-node-and-link-refs';
import { incrementCloneSuffix } from './increment-clone-suffix';
import { useEnableNodeEditing } from '../../graphing/graph-types/organization/use-enable-node-editing';
import { getGraphUpdaterWithNameDeDuplication } from '../../graphing/graph-types/organization/curriculum-delivery-graph';
import { putWorkTaskTypeGraph } from '../../api/actions/work-task-types';

function cloneWorkTaskType(
  template: DataNode<WorkTaskTypeDto>
): DataNode<WorkTaskTypeDto> {
  const { data } = template;
  const { name } = data;
  let cloneName = incrementCloneSuffix(name);

  return {
    ...template,
    data: { ...data, name: cloneName }
  };
}

const cloneFunctionWrapper = { function: cloneWorkTaskType };

const graphUpdater = getGraphUpdaterWithNameDeDuplication(putWorkTaskTypeGraph);

export function LessonTypeHierarchyGraph() {
  const { nodes, nodesRef, linksRef } = useNodeAndLinkRefs<WorkTaskTypeDto>();

  const classList: string[] = [];

  const unsavedNodeChangesProps = useEnableNodeEditing(
    nodesRef,
    linksRef,
    cloneFunctionWrapper,
    graphUpdater
  );

  nodes.forEach((n: DataNode<WorkTaskTypeDto>) => {
    classList.push(n.data.name);
  });

  const titleList = nodes.map(
    (n: DataNode<WorkTaskTypeDto>) =>
      n.data?.serviceCategoryKnowledgeDomainDescriptor || ''
  );

  return (
    <NodeLinkRefWrapper
      nodeListRef={nodesRef}
      titleList={titleList}
      linkListRef={linksRef}
      textList={classList}
      unsavedNodeChangesProps={unsavedNodeChangesProps}
    ></NodeLinkRefWrapper>
  );
}
