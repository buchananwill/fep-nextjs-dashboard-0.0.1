'use client';
import React, { PropsWithChildren, useContext, useReducer } from 'react';
import {
  DispatchContext,
  NodeInteractionContext
} from './node-interaction-context-creator';
import { DataNode } from '../../api/zod-mods';
import { HasNumberIdDto } from '../../api/dtos/HasNumberIdDtoSchema';

export interface NodeInteractionContextInterface {
  hover: number | null;
  selected: number[];
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
      let newSelected = [] as number[];
      if (state.selected.includes(action.payload)) {
        newSelected = state.selected.filter((n) => n !== action.payload);
      } else {
        newSelected = [...state.selected, action.payload];
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
    selected: []
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

export function useNodeSelectedListener<T extends HasNumberIdDto>(
  node: DataNode<T> | number | undefined
) {
  const context = useContext(NodeInteractionContext);
  if (node !== undefined) return context.selected.includes(getNodeId(node));
  else return false;
}

// Assuming 'link.source' can either be a number or an object with an 'id' property
export function getNodeId<T extends HasNumberIdDto>(
  node: number | DataNode<T>
) {
  // Check if 'source' is a number directly, if not, access 'source.id'
  return typeof node === 'number' ? node : node.id;
}
