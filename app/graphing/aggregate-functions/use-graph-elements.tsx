import { DataLink, DataNode, GraphDto } from '../../api/zod-mods';
import { getLinkElements } from './get-link-elements';
import { useBasicNodeElements } from './get-node-elements';
import { useTextElements } from './use-text-elements';
import { Predicate } from '../../components/filters/filter-types';
import { ClosureDto } from '../../api/dtos/ClosureDtoSchema';
import React, { useEffect, useState } from 'react';
import { useFilteredLinkMemo } from './use-filtered-link-memo';

interface GraphElements<T> {
  dataNodes: DataNode<T>[];
  dataLinks: DataLink<T>[];
  nodeElements: React.JSX.Element[];
  linkElements: React.JSX.Element[];
  textElements: React.JSX.Element[];
}

function useSVGElements<T>(
  nodes: DataNode<T>[],
  links: DataLink<T>[],
  textAccessor: (n: number) => string,
  titleAccessor: (n: number) => string
) {
  const linkElements = getLinkElements(links);
  const nodeElements = useBasicNodeElements(nodes);
  const textElements = useTextElements(nodes, textAccessor, titleAccessor);
  return { nodeElements, linkElements, textElements };
}

export function useGraphElements<T>(
  dataNodes: DataNode<T>[],
  dataLinks: ClosureDto[],
  textAccessor: (n: number) => string,
  titleAccessor: (n: number) => string
): {
  dataNodes: DataNode<T>[];
  dataLinks: DataLink<T>[];
  nodeElements: React.JSX.Element[];
  linkElements: React.JSX.Element[];
  textElements: React.JSX.Element[];
} {
  // const { filteredLinks } = useFilteredLinkMemo(dataLinks, closurePredicate);
  const svgElements = useSVGElements(
    dataNodes,
    dataLinks,
    textAccessor,
    titleAccessor
  );
  return { dataNodes, dataLinks, ...svgElements };
}
