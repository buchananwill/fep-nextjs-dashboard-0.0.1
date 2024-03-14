'use client';

import { useNodeAndLinkRefs } from '../../graphing/graph-types/organization/curriculum-delivery-graph';
import { WorkTaskTypeDto } from '../../api/dtos/WorkTaskTypeDtoSchema';
import { DataNode } from '../../api/zod-mods';
import { NodeLinkRefWrapper } from '../../graphing/graph/node-link-ref-wrapper';

export function LessonTypeHierarchyGraph() {
  const { nodes, nodesRef, linksRef } = useNodeAndLinkRefs<WorkTaskTypeDto>();

  console.log(nodes);

  // useForceAdjustments(false);

  const classList: string[] = [];

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
    ></NodeLinkRefWrapper>
  );
}
