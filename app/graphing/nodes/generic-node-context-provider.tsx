'use client';

import React from 'react';
import {
  GenericNodeContext,
  GenericNodeDispatchContext
} from './generic-node-context-creator';
import { DataNode } from '../../api/zod-mods';
import { HasNumberIdDto } from '../../api/dtos/HasNumberIdDtoSchema';

// Example of a generic Provider component that can be used to wrap parts of your app
export const GenericNodeContextProvider = <T extends HasNumberIdDto>({
  children,
  nodes,
  uniqueGraphName
}: {
  children: React.ReactNode;
  nodes: DataNode<T>[];
  uniqueGraphName: string;
}) => {
  const [nodeState, setNodeState] = React.useState<DataNode<T>[]>(nodes);

  return (
    <GenericNodeContext.Provider value={{ nodes: nodeState, uniqueGraphName }}>
      <GenericNodeDispatchContext.Provider value={setNodeState}>
        {children}
      </GenericNodeDispatchContext.Provider>
    </GenericNodeContext.Provider>
  );
};
