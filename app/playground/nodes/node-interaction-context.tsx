'use client';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useReducer
} from 'react';
import {
  DispatchContext,
  DispatchContext as DispatchContext1,
  NodeInteractionContext
} from './node-interaction-context-creator';
import { DataNode } from '../../api/zod-mods';

export interface NodeInteractionContextInterface {
  hover: number | null;
  selected: Set<number>;
}

interface SetHover {
  type: 'setHover';
  payload: number | null;
}

interface ToggleSelect {
  type: 'toggleSelect';
  payload: number;
}

export type NodeInteractionAction = ToggleSelect | SetHover;

function interactionReducer(
  state: NodeInteractionContextInterface,
  action: NodeInteractionAction
) {
  switch (action.type) {
    case 'setHover':
      return { ...state, hover: action.payload };
    case 'toggleSelect':
      const newSelected = new Set(state.selected);
      if (newSelected.has(action.payload)) {
        newSelected.delete(action.payload);
      } else {
        newSelected.add(action.payload);
      }
      return { ...state, selected: newSelected };
    default:
      return state;
  }
}

export default function NodeInteractionProvider({
  children
}: PropsWithChildren) {
  const [state, dispatch] = useReducer(interactionReducer, {
    hover: null,
    selected: new Set<number>()
  });

  return (
    <DispatchContext.Provider value={dispatch}>
      <NodeInteractionContext.Provider value={state}>
        {children}
      </NodeInteractionContext.Provider>
    </DispatchContext.Provider>
  );
}

// Hook for easy access to dispatch
export const useNodeInteractionContext = () => {
  const dispatch = useContext(DispatchContext);
  const context = useContext(NodeInteractionContext);
  return { dispatch, ...context };
};

export function useNodeSelectedListener<T>(node: DataNode<T>) {
  const context = useContext(NodeInteractionContext);
  return context.selected.has(node.id);
}
