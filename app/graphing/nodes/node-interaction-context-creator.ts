import React, { createContext } from 'react';
import {
  NodeInteractionAction,
  NodeInteractionContextInterface
} from './node-interaction-context';

export const NodeInteractionContext =
  createContext<NodeInteractionContextInterface>({
    hover: null,
    selected: []
  });
export const DispatchContext = createContext<
  React.Dispatch<NodeInteractionAction>
>(() => {});
