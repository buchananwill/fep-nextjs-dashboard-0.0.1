import { createContext, useContext, useMemo } from 'react';
import { useSelectiveContextDispatchNumber } from '../../components/selective-context/selective-context-manager-number';
import { useSelectiveContextDispatchBoolean } from '../../components/selective-context/selective-context-manager-boolean';
import { useSelectiveContextDispatchStringList } from '../../components/selective-context/selective-context-manager-string-list';
import { UseSelectiveContextDispatch } from '../../components/selective-context/use-selective-context-dispatch';

export type GraphSelectiveContext =
  | 'version'
  | 'transientNodeIds'
  | 'transientLinkIds'
  | 'nextNodeId'
  | 'nextLinkId'
  | 'debouncing'
  | 'noNodeSelected';
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
  }, [uniqueGraphName, listenerKey]);
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
