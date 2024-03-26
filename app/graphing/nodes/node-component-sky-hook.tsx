'use client';

import { NodeComponentContext } from './node-component-context';
import React, { PropsWithChildren } from 'react';
import { PartyDto } from '../../api/dtos/PartyDtoSchema';
import { DataNode } from '../../api/zod-mods';
import { WorkSeriesBundleDeliveryDto } from '../../api/dtos/WorkSeriesBundleDeliveryDtoSchema';

import { useWorkSeriesBundleNodeElements } from '../aggregate-functions/use-work-series-bundle-node-elements';

export default function NodeComponentSkyHook({
  children,
  nodes,
  bundles
}: {
  nodes: DataNode<PartyDto>[];
  bundles: WorkSeriesBundleDeliveryDto[];
} & PropsWithChildren) {
  const workSeriesBundleNodeElements = useWorkSeriesBundleNodeElements(
    nodes,
    bundles
  );

  return (
    <NodeComponentContext.Provider
      value={{ getNodeElements: () => workSeriesBundleNodeElements }}
    >
      {children}
    </NodeComponentContext.Provider>
  );
}
