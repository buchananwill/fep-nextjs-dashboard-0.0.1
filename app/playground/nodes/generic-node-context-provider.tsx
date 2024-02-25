'use client';

import React from 'react';
import {
  GenericNodeContext,
  GenericNodeDispatchContext
} from './generic-node-context-creator';

// Example of a generic Provider component that can be used to wrap parts of your app
export const GenericNodeContextProvider = <T,>({
  children,
  nodes,
  uniqueGraphName
}: {
  children: React.ReactNode;
  nodes: T[];
  uniqueGraphName: string;
}) => {
  const [nodeState, setNodeState] = React.useState<T[]>(nodes);

  return (
    <GenericNodeContext.Provider value={{ nodes: nodeState, uniqueGraphName }}>
      <GenericNodeDispatchContext.Provider value={setNodeState}>
        {children}
      </GenericNodeDispatchContext.Provider>
    </GenericNodeContext.Provider>
  );
};
