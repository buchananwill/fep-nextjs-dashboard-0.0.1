import React, {
  createContext,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useContext
} from 'react';
import { DataLink, DataNode } from '../../api/zod-mods';
import { GenericLinkRefContext } from '../links/generic-link-context-creator';
import { HasNumberIdDto } from '../../api/dtos/HasNumberIdDtoSchema';

// Define the interface as generic
export interface GenericNodeContextInterface<T extends HasNumberIdDto> {
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
export function useGenericNodeContext<T extends HasNumberIdDto>() {
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

export function useGenericGraphRefs<T extends HasNumberIdDto>() {
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
