import { createContext, useContext, useMemo } from 'react';
import { useSelectiveContextDispatchNumber } from '../../components/selective-context/selective-context-manager-number';
import { useSelectiveContextControllerBoolean } from '../../components/selective-context/selective-context-manager-boolean';
import { useSelectiveContextDispatchStringList } from '../../components/selective-context/selective-context-manager-string-list';
import { UseSelectiveContextDispatch } from '../../components/selective-context/use-selective-context-controller';
import { UseSelectiveContextListener } from '../../components/selective-context/use-selective-context-listener';

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

export function useSelectiveGraphContextKey(
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

export function useSelectiveContextGraphDispatch<T>(
  contextKey: GraphSelectiveContext,
  listenerKey: string,
  initialValue: T,
  useSelectiveContextDispatch: UseSelectiveContextDispatch<T>
) {
  const { contextKeyConcat, listenerKeyConcat } = useSelectiveGraphContextKey(
    contextKey,
    `${listenerKey}`
  );
  const { currentState, dispatchUpdate } = useSelectiveContextDispatch(
    contextKeyConcat,
    listenerKeyConcat,
    initialValue
  );
  const simpleDispatch = (value: T) => {
    dispatchUpdate({ contextKey: contextKeyConcat, value: value });
  };
  return {
    currentState,
    simpleDispatch,
    contextKey,
    listenerKey,
    dispatchUpdate
  };
}

export function useSelectionContextGraphListener<T>(
  contextKey: GraphSelectiveContext,
  listenerKey: string,
  initialValue: T,
  useSelectiveContextListener: UseSelectiveContextListener<T>
) {
  const { contextKeyConcat, listenerKeyConcat } = useSelectiveGraphContextKey(
    contextKey,
    `${listenerKey}`
  );

  return useSelectiveContextListener(
    contextKeyConcat,
    listenerKeyConcat,
    initialValue
  );
}

export function useSelectiveContextGraphNumberDispatch(
  contextKey: GraphSelectiveContext,
  listenerKey: string,
  initialValue: number
) {
  const { contextKeyConcat, listenerKeyConcat } = useSelectiveGraphContextKey(
    contextKey,
    `${listenerKey}`
  );
  const { currentState, dispatchUpdate } = useSelectiveContextDispatchNumber(
    contextKeyConcat,
    listenerKeyConcat,
    initialValue
  );
  const simpleDispatch = (value: number) => {
    dispatchUpdate({ contextKey: contextKeyConcat, value: value });
  };
  return {
    currentState,
    simpleDispatch,
    contextKey,
    listenerKey,
    dispatchUpdate
  };
}
