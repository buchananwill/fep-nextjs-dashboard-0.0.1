import { createContext, useContext, useMemo } from 'react';
import {
  useSelectiveContextControllerNumber,
  useSelectiveContextDispatchNumber
} from '../../components/selective-context/selective-context-manager-number';
import { useSelectiveContextControllerBoolean } from '../../components/selective-context/selective-context-manager-boolean';
import { useSelectiveContextDispatchStringList } from '../../components/selective-context/selective-context-manager-string-list';
import {
  UseSelectiveContextController,
  UseSelectiveContextDispatch
} from '../../components/selective-context/use-selective-context-controller';
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

export function useGraphSelectionContextListener<T>(
  contextKey: GraphSelectiveContext,
  listenerKey: string,
  initialValue: T,
  useSelectiveContextListener: UseSelectiveContextListener<T>
) {
  const { contextKeyConcat, listenerKeyConcat } = useGraphSelectiveContextKey(
    contextKey,
    `${listenerKey}`
  );

  if (contextKey == 'dimensions') {
    console.log(
      contextKey,
      listenerKey,
      initialValue,
      useSelectiveContextListener
    );
  }

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
