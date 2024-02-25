import React, {
  createContext,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useContext
} from 'react';
import { DataNode } from '../../api/zod-mods';

// Define the interface as generic
export interface GenericNodeContextInterface<T> {
  nodes: T[];
  uniqueGraphName: string;
}

// Create a generic context with a default value
export const GenericNodeContext = createContext<
  GenericNodeContextInterface<any> | undefined
>(undefined);

export const GenericNodeDispatchContext = createContext<
  Dispatch<SetStateAction<any[]>> | undefined
>(undefined);

// Generic hook to use the context
export function useGenericNodeContext<T>() {
  const context = useContext(
    GenericNodeContext as React.Context<
      GenericNodeContextInterface<T> | undefined
    >
  );
  const dispatch = useContext(
    GenericNodeDispatchContext as React.Context<
      Dispatch<SetStateAction<T[]>> | undefined
    >
  );

  if (context === undefined || dispatch === undefined) {
    throw new Error('useGenericArrayContext must be used within a Provider');
  }

  return { ...context, dispatch };
}

export const GenericNodeRefContext = createContext<MutableRefObject<
  DataNode<any>[]
> | null>(null);
