import { DataLink, DataNode, GraphDto } from '../../api/zod-mods';
import { getLinkElements } from './get-link-elements';
import { useBasicNodeElements } from './get-node-elements';
import { useTextElements } from './use-text-elements';
import { Predicate } from '../../components/filters/filter-types';
import { ClosureDto } from '../../api/dtos/ClosureDtoSchema';
import React from 'react';
import { useFilteredLinkMemo } from './use-filtered-link-memo';

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
  graphDTO: GraphDto<T>,
  textAccessor: (n: number) => string,
  titleAccessor: (n: number) => string,
  closurePredicate?: Predicate<ClosureDto>
): {
  dataNodes: DataNode<T>[];
  filteredLinks: DataLink<T>[];
  nodeElements: React.JSX.Element[];
  linkElements: React.JSX.Element[];
  textElements: React.JSX.Element[];
} {
  const { filteredLinks } = useFilteredLinkMemo(graphDTO, closurePredicate);
  const svgElements = useSVGElements(
    graphDTO.nodes,
    filteredLinks,
    textAccessor,
    titleAccessor
  );
  return { dataNodes: graphDTO.nodes, filteredLinks, ...svgElements };
}
