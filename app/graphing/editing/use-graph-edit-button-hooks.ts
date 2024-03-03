import {
  useGenericGraphRefs,
  useGenericNodeContext
} from '../nodes/generic-node-context-creator';
import { useNodeInteractionContext } from '../nodes/node-interaction-context';
import { useMemo, useState } from 'react';
import {
  useSelectiveContextGraphDispatch,
  useSelectiveContextGraphNumberDispatch,
  useSelectiveGraphContextKey
} from '../graph/graph-context-creator';
import {
  useSelectiveContextControllerNumber,
  useSelectiveContextDispatchNumber
} from '../../components/selective-context/selective-context-manager-number';
import { useSelectiveContextDispatchNumberList } from '../../components/selective-context/selective-context-manager-number-list';
import { TransientIdOffset } from './graph-edits';
import { useSelectiveContextKeyMemo } from '../../components/selective-context/use-selective-context-listener';

export function useGraphVersionKeys<T>(listenerKey: string) {
  const { uniqueGraphName } = useGenericNodeContext<T>();
  const { contextVersionKey, listenerVersionKey } = useMemo(() => {
    const contextVersionKey = `${uniqueGraphName}:version`;
    const listenerVersionKey = `${uniqueGraphName}:${listenerKey}`;
    return { contextVersionKey, listenerVersionKey };
  }, [listenerKey, uniqueGraphName]);
  return { contextVersionKey, listenerVersionKey };
}

export function useDirectSimRefEditsController<T>(buttonListenerKey: string) {
  const { contextVersionKey, listenerVersionKey } =
    useGraphVersionKeys(buttonListenerKey);

  const { currentState: simVersion, dispatchUpdate } =
    useSelectiveContextControllerNumber({
      contextKey: contextVersionKey,
      listenerKey: listenerVersionKey,
      initialValue: 0
    });

  const incrementSimVersion = () => {
    dispatchUpdate({ contextKey: contextVersionKey, value: simVersion + 1 });
  };
  const { nodeListRef, linkListRef } = useGenericGraphRefs<T>();
  return { incrementSimVersion, nodeListRef, linkListRef };
}
export function useDirectSimRefEditsDispatch<T>(buttonListenerKey: string) {
  const { contextVersionKey, listenerVersionKey } =
    useGraphVersionKeys(buttonListenerKey);

  const { currentState: simVersion, dispatchWithoutControl } =
    useSelectiveContextDispatchNumber({
      contextKey: contextVersionKey,
      listenerKey: listenerVersionKey,
      initialValue: 0
    });

  const incrementSimVersion = () => {
    dispatchWithoutControl(simVersion + 1);
  };
  const { nodeListRef, linkListRef } = useGenericGraphRefs<T>();
  return { incrementSimVersion, nodeListRef, linkListRef };
}

export function useGraphEditButtonHooks<T>(buttonListenerKey: string) {
  const { selected } = useNodeInteractionContext();

  const { incrementSimVersion, nodeListRef, linkListRef } =
    useDirectSimRefEditsController<T>(buttonListenerKey);

  const { contextKeyConcat, listenerKeyConcat } = useSelectiveGraphContextKey(
    'nextNodeId',
    buttonListenerKey
  );
  const { currentState: nextNodeId, dispatchUpdate: setNextNodeId } =
    useSelectiveContextControllerNumber({
      contextKey: contextKeyConcat,
      listenerKey: listenerKeyConcat,
      initialValue: NaN
    });

  const { currentState: nextLinkId, simpleDispatch: setNextLinkId } =
    useSelectiveContextGraphNumberDispatch(
      'nextLinkId',
      buttonListenerKey,
      NaN
    );

  const { nodesInit, linksInit, deletedLinksInit, deletedNodesInit } =
    useMemo(() => {
      const nodesInit = [] as number[];
      const linksInit = [] as number[];
      const deletedLinksInit = [] as number[];
      const deletedNodesInit = [] as number[];
      return { nodesInit, linksInit, deletedNodesInit, deletedLinksInit };
    }, []);

  const {
    simpleDispatch: setTransientNodeIds,
    currentState: transientNodeIds
  } = useSelectiveContextGraphDispatch(
    'transientNodeIds',
    buttonListenerKey,
    nodesInit,
    useSelectiveContextDispatchNumberList
  );

  const {
    simpleDispatch: setTransientLinkIds,
    currentState: transientLinkIds
  } = useSelectiveContextGraphDispatch(
    'transientLinkIds',
    buttonListenerKey,
    linksInit,
    useSelectiveContextDispatchNumberList
  );

  const { simpleDispatch: setDeletedLinkIds, currentState: deletedLinkIds } =
    useSelectiveContextGraphDispatch(
      'deletedLinkIds',
      buttonListenerKey,
      deletedLinksInit,
      useSelectiveContextDispatchNumberList
    );
  const { simpleDispatch: setDeletedNodeIds, currentState: deletedNodeIds } =
    useSelectiveContextGraphDispatch(
      'deletedNodeIds',
      buttonListenerKey,
      deletedNodesInit,
      useSelectiveContextDispatchNumberList
    );

  const [noNodeSelected, setNoNodeSelected] = useState(false);

  const [deBouncing, setDeBouncing] = useState<boolean>(false);

  const getNextNodeId = () => {
    let responseId =
      // nextNodeId === undefined ? TransientIdOffset + 1 : nextNodeId;
      isNaN(nextNodeId) ? TransientIdOffset + 1 : nextNodeId;
    const nodeIdSet = new Set(transientNodeIds);
    while (nodeIdSet.has(responseId)) {
      responseId++;
    }
    setNextNodeId({ contextKey: contextKeyConcat, value: responseId + 1 });
    // setNextNodeId((prev) => responseId + 1);
    return responseId;
  };
  const getNextLinkId = () => {
    let responseId =
      // nextLinkId === undefined ? TransientIdOffset + 1 : nextLinkId;
      isNaN(nextLinkId) ? TransientIdOffset + 1 : nextLinkId;
    const linkIdSet = new Set(transientLinkIds);
    while (linkIdSet.has(responseId)) {
      responseId++;
    }
    setNextLinkId(responseId + 1);
    return responseId;
  };

  const checkForSelectedNodes = (minimum: number = 1) => {
    if (selected.length < minimum) {
      if (!noNodeSelected) {
        setNoNodeSelected(true);
        setTimeout(() => {
          if (setNoNodeSelected) setNoNodeSelected(false);
        }, 2000);
      }
      return false;
    } else return true;
  };

  const deBounce = () => {
    setDeBouncing(true);
    setTimeout(() => setDeBouncing(false), 250);
  };

  return {
    nodeListRef,
    linkListRef,
    selected,
    incrementSimVersion,
    setTransientNodeIds,
    transientNodeIds,
    setTransientLinkIds,
    transientLinkIds,
    checkForSelectedNodes,
    noNodeSelected,
    deBouncing,
    deBounce,
    getNextLinkId,
    getNextNodeId,
    setDeletedLinkIds,
    deletedLinkIds,
    setDeletedNodeIds,
    deletedNodeIds
  };
}
