import React, {
  createContext,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useContext
} from 'react';
import { DataLink, DataNode } from '../../api/zod-mods';

// Define the interface as generic
export interface GenericLinkContextInterface<T> {
  links: DataLink<T>[];
  uniqueGraphName: string;
}

// Create a generic context with a default value
export const GenericLinkContext = createContext<
  GenericLinkContextInterface<any> | undefined
>(undefined);

export const GenericLinkDispatchContext = createContext<
  Dispatch<SetStateAction<DataLink<any>[]>> | undefined
>(undefined);

// Generic hook to use the context
export function useGenericLinkContext<T>() {
  const context = useContext(
    GenericLinkContext as React.Context<
      GenericLinkContextInterface<T> | undefined
    >
  );
  const dispatch = useContext(
    GenericLinkDispatchContext as React.Context<
      Dispatch<SetStateAction<DataLink<T>[]>> | undefined
    >
  );

  if (context === undefined || dispatch === undefined) {
    throw new Error('useGenericArrayContext must be used within a Provider');
  }

  return { ...context, dispatch };
}

export const GenericLinkRefContext = createContext<MutableRefObject<
  DataLink<any>[]
> | null>(null);
