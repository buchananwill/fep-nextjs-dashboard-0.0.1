'use client';

import { useNodeAndLinkRefs } from '../../graphing/graph-types/organization/curriculum-delivery-graph';
import { WorkTaskTypeDto } from '../../api/dtos/WorkTaskTypeDtoSchema';
import { DataNode } from '../../api/zod-mods';
import { NodeLinkRefWrapper } from '../../graphing/graph/node-link-ref-wrapper';
import { useSelectiveContextDispatchNumber } from '../../components/selective-context/selective-context-manager-number';
import { useForceAttributeOverride } from '../../graphing/forces/use-force-attribute-override';
import { useNodeCloneFunction } from '../../graphing/editing/use-node-clone-function';

const CloneSuffixPattern = /\(\d+\)$/;

function cloneWorkTaskType(
  template: DataNode<WorkTaskTypeDto>
): DataNode<WorkTaskTypeDto> {
  const { data } = template;
  const { name } = data;
  let cloneName = name;
  if (CloneSuffixPattern.test(name)) {
    const lastOpenParenthesis = name.lastIndexOf('(');
    const cloneCounter = name.substring(
      lastOpenParenthesis + 1,
      name.length - 1
    );
    try {
      const cloneCounterInt = parseInt(cloneCounter);
      cloneName = `${name.substring(0, lastOpenParenthesis)} (${
        cloneCounterInt + 1
      })`;
    } catch (error) {
      console.error(error);
    }
  } else {
    cloneName = `${name} (1)`;
  }

  return {
    ...template,
    data: { ...data, name: cloneName }
  };
}

const cloneFunctionWrapper = { function: cloneWorkTaskType };

export function LessonTypeHierarchyGraph() {
  const { nodes, nodesRef, linksRef } = useNodeAndLinkRefs<WorkTaskTypeDto>();

  const classList: string[] = [];

  useNodeCloneFunction(cloneFunctionWrapper);

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
