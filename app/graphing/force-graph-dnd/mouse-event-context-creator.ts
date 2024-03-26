import { createContext, Dispatch, SetStateAction } from 'react';
import {
  ForceGraphMouseAction,
  ForceGraphMouseButtonEvents
} from './force-graph-mouse-action-reducer';

export interface ForceGraphDraggable {
  draggingNodeIndex?: number;
  draggingNodeKey?: string;
}

export const ForceGraphMouseButtonEventsContext =
  createContext<ForceGraphMouseButtonEvents>({
    leftMouseDown: false,
    rightMouseDown: false
  });

export const ForceGraphDraggableContext = createContext<ForceGraphDraggable>(
  {}
);

export const MouseDownDispatchContext = createContext<
  (draggingNodeIndex: number) => void
>(() => {});
export const ForceGraphMouseButtonEventsDispatch = createContext<
  (action: ForceGraphMouseAction) => void
>(() => {});

export const ForceGraphDraggableDispatch = createContext<
  Dispatch<SetStateAction<ForceGraphDraggable>>
>(() => {});

export const DraggablePositionContext = createContext({ x: 0, y: 0 });

export const IsDraggingContext = createContext<boolean>(false);
