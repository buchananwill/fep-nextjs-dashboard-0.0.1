import { createContext, useContext, useMemo } from 'react';
import { useSelectiveContextDispatchNumber } from '../../selective-context/components/typed/selective-context-manager-number';
import {
  UseSelectiveContextController,
  UseSelectiveContextDispatch
} from '../../selective-context/hooks/generic/use-selective-context-controller';
import { UseSelectiveContextListener } from '../../selective-context/hooks/generic/use-selective-context-listener';

export type GraphSelectiveContext =
  | 'version'
  | 'transientNodeIds'
  | 'transientLinkIds'
  | 'nextNodeId'
  | 'nextLinkId'
  | 'debouncing'
  | 'noNodeSelected'
  | 'deletedLinkIds'
  | 'deletedNodeIds'
  | 'dimensions';
export interface GraphContextInterface {
  uniqueGraphName: string;
}

export const GraphContext = createContext<GraphContextInterface>({
  uniqueGraphName: 'default'
});

export function useGraphName() {
  const { uniqueGraphName } = useContext(GraphContext);
  return uniqueGraphName;
}

export function useGraphSelectiveContextKey(
  contextKey: GraphSelectiveContext,
  listenerKey: string
) {
  const { uniqueGraphName } = useContext(GraphContext);
  return useMemo(() => {
    const contextKeyConcat = `${uniqueGraphName}:${contextKey}`;
    const listenerKeyConcat = `${uniqueGraphName}:${listenerKey}`;
    return { contextKeyConcat, listenerKeyConcat };
  }, [uniqueGraphName, listenerKey, contextKey]);
}

export function useGraphSelectiveContextDispatch<T>(
  contextKey: GraphSelectiveContext,
  listenerKey: string,
  initialValue: T,
  useSelectiveContextDispatch: UseSelectiveContextDispatch<T>
) {
  const { contextKeyConcat, listenerKeyConcat } = useGraphSelectiveContextKey(
    contextKey,
    `${listenerKey}`
  );
  const { currentState, dispatchWithoutControl } = useSelectiveContextDispatch({
    contextKey: contextKeyConcat,
    listenerKey: listenerKeyConcat,
    initialValue
  });

  return {
    currentState,
    dispatchWithoutControl,
    contextKey,
    listenerKey
  };
}

export function useGraphSelectiveContextController<T>(
  contextKey: GraphSelectiveContext,
  listenerKey: string,
  initialValue: T,
  useSelectiveContextController: UseSelectiveContextController<T>
) {
  const { contextKeyConcat, listenerKeyConcat } = useGraphSelectiveContextKey(
    contextKey,
    `${listenerKey}`
  );
  const { currentState, dispatchUpdate } = useSelectiveContextController({
    contextKey: contextKeyConcat,
    listenerKey: listenerKeyConcat,
    initialValue
  });

  return {
    currentState,
    dispatchUpdate,
    contextKey,
    listenerKey
  };
}

export function useGraphSelectiveContextListener<T>(
  contextKey: GraphSelectiveContext,
  listenerKey: string,
  initialValue: T,
  useSelectiveContextListener: UseSelectiveContextListener<T>
) {
  const { contextKeyConcat, listenerKeyConcat } = useGraphSelectiveContextKey(
    contextKey,
    `${listenerKey}`
  );

  return useSelectiveContextListener(
    contextKeyConcat,
    listenerKeyConcat,
    initialValue
  );
}

export function useGraphSelectiveContextNumberDispatch(
  contextKey: GraphSelectiveContext,
  listenerKey: string,
  initialValue: number
) {
  const { contextKeyConcat, listenerKeyConcat } = useGraphSelectiveContextKey(
    contextKey,
    `${listenerKey}`
  );
  const { currentState, dispatchWithoutControl } =
    useSelectiveContextDispatchNumber({
      contextKey: contextKeyConcat,
      listenerKey: listenerKeyConcat,
      initialValue
    });

  return {
    currentState,
    dispatchWithoutControl,
    contextKey,
    listenerKey
  };
}
