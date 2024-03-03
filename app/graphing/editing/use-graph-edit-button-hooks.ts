import {
  useGenericGraphRefs,
  useGenericNodeContext
} from '../nodes/generic-node-context-creator';
import { useNodeInteractionContext } from '../nodes/node-interaction-context';
import { useContext, useMemo, useState } from 'react';
import {
  useGraphSelectiveContextDispatch,
  useGraphSelectiveContextNumberDispatch,
  useGraphSelectiveContextKey,
  GraphContext
} from '../graph/graph-context-creator';
import {
  useSelectiveContextControllerNumber,
  useSelectiveContextDispatchNumber
} from '../../components/selective-context/selective-context-manager-number';
import { useSelectiveContextDispatchNumberList } from '../../components/selective-context/selective-context-manager-number-list';
import { TransientIdOffset } from './graph-edits';
import { useSelectiveContextKeyMemo } from '../../components/selective-context/use-selective-context-listener';
import { useSelectiveContextDispatchBoolean } from '../../components/selective-context/selective-context-manager-boolean';
import { UnsavedNodeDataContextKey } from '../graph-types/curriculum-delivery-graph';
import { CurriculumDetailsListenerKey } from '../components/curriculum-delivery-details';

export function useGraphVersionKeys<T>(listenerKey: string) {
  const { uniqueGraphName } = useGenericNodeContext<T>();
  const { contextVersionKey, listenerVersionKey } = useMemo(() => {
    const contextVersionKey = `${uniqueGraphName}:version`;
    const listenerVersionKey = `${uniqueGraphName}:${listenerKey}`;
    return { contextVersionKey, listenerVersionKey };
  }, [listenerKey, uniqueGraphName]);
  return { contextVersionKey, listenerVersionKey };
}

export function useDirectSimRefEditsController<T>(listenerKey: string) {
  const { contextVersionKey, listenerVersionKey } =
    useGraphVersionKeys(listenerKey);

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

  const { uniqueGraphName } = useContext(GraphContext);
  const unsavedGraphContextKey = useSelectiveContextKeyMemo(
    UnsavedNodeDataContextKey,
    uniqueGraphName
  );

  const {
    currentState: unsavedGraph,
    dispatchWithoutControl: dispatchUnsavedGraph
  } = useSelectiveContextDispatchBoolean(
    unsavedGraphContextKey,
    buttonListenerKey,
    false
  );

  const { currentState: simVersion, dispatchWithoutControl } =
    useSelectiveContextDispatchNumber({
      contextKey: contextVersionKey,
      listenerKey: listenerVersionKey,
      initialValue: 0
    });

  const incrementSimVersion = () => {
    console.log(
      'Current version: ',
      simVersion,
      contextVersionKey,
      listenerVersionKey
    );
    dispatchWithoutControl(simVersion + 1);
    dispatchUnsavedGraph(true);
    console.log('Current version: ', simVersion);
  };
  const { nodeListRef, linkListRef } = useGenericGraphRefs<T>();
  return { incrementSimVersion, nodeListRef, linkListRef };
}

export function useGraphEditButtonHooks<T>(buttonListenerKey: string) {
  const { selected } = useNodeInteractionContext();

  const { incrementSimVersion, nodeListRef, linkListRef } =
    useDirectSimRefEditsDispatch<T>(buttonListenerKey);

  const { contextKeyConcat, listenerKeyConcat } = useGraphSelectiveContextKey(
    'nextNodeId',
    buttonListenerKey
  );
  const { currentState: nextNodeId, dispatchWithoutControl: setNextNodeId } =
    useSelectiveContextDispatchNumber({
      contextKey: contextKeyConcat,
      listenerKey: listenerKeyConcat,
      initialValue: NaN
    });

  const { currentState: nextLinkId, dispatchWithoutControl: setNextLinkId } =
    useGraphSelectiveContextNumberDispatch(
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
    dispatchWithoutControl: setTransientNodeIds,
    currentState: transientNodeIds
  } = useGraphSelectiveContextDispatch(
    'transientNodeIds',
    buttonListenerKey,
    nodesInit,
    useSelectiveContextDispatchNumberList
  );

  const {
    dispatchWithoutControl: setTransientLinkIds,
    currentState: transientLinkIds
  } = useGraphSelectiveContextDispatch(
    'transientLinkIds',
    buttonListenerKey,
    linksInit,
    useSelectiveContextDispatchNumberList
  );

  const {
    dispatchWithoutControl: setDeletedLinkIds,
    currentState: deletedLinkIds
  } = useGraphSelectiveContextDispatch(
    'deletedLinkIds',
    buttonListenerKey,
    deletedLinksInit,
    useSelectiveContextDispatchNumberList
  );
  const {
    dispatchWithoutControl: setDeletedNodeIds,
    currentState: deletedNodeIds
  } = useGraphSelectiveContextDispatch(
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
    setNextNodeId(responseId + 1);
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
