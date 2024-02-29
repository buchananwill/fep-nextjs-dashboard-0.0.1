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
import { useSelectiveContextDispatchNumber } from '../../components/selective-context/selective-context-manager-number';
import { useSelectiveContextDispatchNumberList } from '../../components/selective-context/selective-context-manager-number-list';
import { TransientIdOffset } from './graph-edits';

export function useGraphEditButtonHooks<T>(buttonListenerKey: string) {
  const { uniqueGraphName } = useGenericNodeContext<T>();
  const { nodeListRef, linkListRef } = useGenericGraphRefs<T>();

  const { selected } = useNodeInteractionContext();

  const { contextVersionKey, listenerVersionKey } = useMemo(() => {
    const contextVersionKey = `${uniqueGraphName}-version`;
    const listenerVersionKey = `${uniqueGraphName}:${buttonListenerKey}`;
    return { contextVersionKey, listenerVersionKey };
  }, [buttonListenerKey, uniqueGraphName]);

  const { contextKeyConcat, listenerKeyConcat } = useSelectiveGraphContextKey(
    'nextNodeId',
    buttonListenerKey
  );
  const { currentState: nextNodeId, dispatchUpdate: setNextNodeId } =
    useSelectiveContextDispatchNumber(contextKeyConcat, listenerKeyConcat, NaN);

  const { currentState: nextLinkId, simpleDispatch: setNextLinkId } =
    useSelectiveContextGraphNumberDispatch(
      'nextLinkId',
      buttonListenerKey,
      NaN
    );

  const { currentState: simVersion, dispatchUpdate } =
    useSelectiveContextDispatchNumber(contextVersionKey, listenerVersionKey, 0);

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

  const incrementSimVersion = () => {
    dispatchUpdate({ contextKey: contextVersionKey, value: simVersion + 1 });
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
