'use client';

import { AssetDto } from '../api/dtos/AssetDtoSchema';
import { DataNode } from '../api/zod-mods';
import { NodeLinkRefWrapper } from '../graphing/graph/node-link-ref-wrapper';
import { useNodeAndLinkRefs } from '../graphing/graph/use-node-and-link-refs';

export function PremisesHierarchyGraph() {
  const { nodes, nodesRef, linksRef } = useNodeAndLinkRefs<AssetDto>();

  const classList: string[] = [];

  nodes.forEach((n: DataNode<AssetDto>) => {
    classList.push(n.data.name);
  });

  const titleList = nodes.map(
    (n: DataNode<AssetDto>) => n.data?.assetTypeName || ''
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
