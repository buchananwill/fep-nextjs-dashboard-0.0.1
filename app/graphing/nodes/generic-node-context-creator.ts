import React, {
  createContext,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useContext
} from 'react';
import { DataLink, DataNode } from '../../api/zod-mods';
import { relativizeURL } from 'next/dist/shared/lib/router/utils/relativize-url';
import { GenericLinkRefContext } from '../links/generic-link-context-creator';

// Define the interface as generic
export interface GenericNodeContextInterface<T> {
  nodes: DataNode<T>[];
  uniqueGraphName: string;
}

// Create a generic context with a default value
export const GenericNodeContext = createContext<
  GenericNodeContextInterface<any> | undefined
>(undefined);

export const GenericNodeDispatchContext = createContext<
  Dispatch<SetStateAction<DataNode<any>[]>> | undefined
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
      Dispatch<SetStateAction<DataNode<T>[]>> | undefined
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

export function useGenericGraphRefs<T>() {
  const nodeListRef = useContext(
    GenericNodeRefContext as React.Context<React.MutableRefObject<
      DataNode<T>[]
    > | null>
  );
  const linkListRef = useContext(
    GenericLinkRefContext as React.Context<React.MutableRefObject<
      DataLink<T>[]
    > | null>
  );
  return { nodeListRef, linkListRef };
}
