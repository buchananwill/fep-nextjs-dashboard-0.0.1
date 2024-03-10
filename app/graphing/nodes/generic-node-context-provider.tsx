'use client';

import React from 'react';
import {
  GenericNodeContext,
  GenericNodeDispatchContext
} from './generic-node-context-creator';
import { DataNode } from '../../api/zod-mods';
import { HasNumberIdDto } from '../../api/dtos/HasNumberIdDtoSchema';
import { useGraphName } from '../graph/graph-context-creator';

// Example of a generic Provider component that can be used to wrap parts of your app
export const GenericNodeContextProvider = <T extends HasNumberIdDto>({
  children,
  nodes
}: {
  children: React.ReactNode;
  nodes: DataNode<T>[];
}) => {
  const [nodeState, setNodeState] = React.useState<DataNode<T>[]>(nodes);
  const uniqueGraphName = useGraphName();

  return (
    <GenericNodeContext.Provider value={{ nodes: nodeState, uniqueGraphName }}>
      <GenericNodeDispatchContext.Provider value={setNodeState}>
        {children}
      </GenericNodeDispatchContext.Provider>
    </GenericNodeContext.Provider>
  );
};
