'use client';

import { AssetDto } from '../api/dtos/AssetDtoSchema';
import { DataNode } from '../api/zod-mods';
import { NodeLinkRefWrapper } from '../graphing/graph/node-link-ref-wrapper';
import { useNodeAndLinkRefs } from '../graphing/graph/use-node-and-link-refs';
import { useNodeEditing } from '../graphing/editing/functions/use-node-editing';
import { incrementCloneSuffix } from '../graphing/editing/functions/increment-clone-suffix';
import { putPremisesGraph } from '../api/actions/custom/premises';
import { NodePayload } from '../graphing/force-graph-page';
import PremisesDetails from './premises-details';
import React from 'react';
import NodeDetails from '../graphing/components/node-details';
import { UnsavedChangesModal } from '../generic/components/modals/unsaved-changes-modal';

export function PremisesHierarchyGraph() {
  const { nodes, nodesRef, linksRef } = useNodeAndLinkRefs<AssetDto>();

  const unsavedNodeChangesProps = useNodeEditing(
    nodesRef,
    linksRef,
    AssetCloneFunctionWrapper,
    putPremisesGraph
  );

  const classList: string[] = [];

  nodes.forEach((n: DataNode<AssetDto>) => {
    classList.push(n.data.name);
  });

  const titleList = nodes.map(
    (n: DataNode<AssetDto>) => n.data?.assetTypeName || ''
  );

  const nodeDetailElements: NodePayload<AssetDto>[] = nodes.map((node) => {
    return {
      node: node,
      payload: (
        <PremisesDetails
          key={`premises-details-${node.data.id}`}
          node={node}
        ></PremisesDetails>
      )
    };
  });

  return (
    <NodeLinkRefWrapper
      nodeListRef={nodesRef}
      titleList={titleList}
      linkListRef={linksRef}
      textList={classList}
    >
      <NodeDetails nodeDetailElements={nodeDetailElements} labels={classList} />
      <UnsavedChangesModal {...unsavedNodeChangesProps} />
    </NodeLinkRefWrapper>
  );
}

function cloneAsset(template: DataNode<AssetDto>): DataNode<AssetDto> {
  const { data } = template;
  const { name } = data;
  let cloneName = incrementCloneSuffix(name);

  return {
    ...template,
    data: { ...data, name: cloneName }
  };
}

export const AssetCloneFunctionWrapper = { cachedFunction: cloneAsset };
