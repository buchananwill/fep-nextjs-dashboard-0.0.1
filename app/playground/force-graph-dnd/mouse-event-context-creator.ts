import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { DataNode } from '../../api/zod-mods';
import { useSvgScale } from '../use-draggable-svg';

export interface ForceGraphMouseButtonEvents {
  leftMouseDown: boolean;
  rightMouseDown: boolean;
  lastEvent?: MouseEvent;
}

export interface ForceGraphDraggable {
  draggingNodeIndex?: number;
  draggingNodeKey?: string;
}

export interface LeftMouseAction {
  type: 'leftMouseDown';
  payload: { state: boolean; trigger: React.MouseEvent };
}
export interface RightMouseAction {
  type: 'rightMouseDown';
  payload: { state: boolean; trigger: React.MouseEvent };
}

export type ForceGraphMouseAction = LeftMouseAction | RightMouseAction;

export function ForceGraphMouseActionReducer(
  state: ForceGraphMouseButtonEvents,
  action: ForceGraphMouseAction
) {
  switch (action.type) {
    case 'leftMouseDown': {
      return {
        ...state,
        leftMouseDown: action.payload.state
      };
    }
    case 'rightMouseDown': {
      return {
        ...state,
        rightMouseDown: action.payload.state
      };
    }
    default:
      throw Error('Action not supported');
  }
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

function getButton(e: React.MouseEvent) {
  return e.button === 0
    ? 'leftMouseDown'
    : e.button === 2
    ? 'rightMouseDown'
    : 'n/a';
}

export const IsDraggingContext = createContext<boolean>(false);

export function useForceGraphDndElement(element: ForceGraphDraggable) {
  const dispatchElementId = useContext(ForceGraphDraggableDispatch);
  const dispatchMouseEvent = useContext(ForceGraphMouseButtonEventsDispatch);
  const { draggingNodeIndex, draggingNodeKey } = useContext(
    ForceGraphDraggableContext
  );
  const mouseDownDispatch = useContext(MouseDownDispatchContext);
  const { leftMouseDown } = useContext(ForceGraphMouseButtonEventsContext);
  const draggablePosition = useContext(DraggablePositionContext);
  const currentDraggingContext = useContext(IsDraggingContext);
  const mouseUp = useMouseUpDispatcher();

  const mouseDown = (e: React.MouseEvent) => {
    const button = getButton(e);
    if (button === 'n/a') return;
    dispatchElementId(element);
    dispatchMouseEvent({
      type: button,
      payload: { state: true, trigger: e }
    });
    mouseDownDispatch(element.draggingNodeIndex!);
  };

  const doDrag =
    element.draggingNodeIndex === draggingNodeIndex &&
    currentDraggingContext &&
    leftMouseDown;

  return {
    mouseDown,
    mouseUp,
    doDrag,
    draggablePosition
  };
}

function useMouseUpDispatcher() {
  const dispatchMouseEvent = useContext(ForceGraphMouseButtonEventsDispatch);

  return (e: React.MouseEvent) => {
    const button = getButton(e);
    if (button === 'n/a') return;
    dispatchMouseEvent({
      type: button,
      payload: { state: false, trigger: e }
    });
  };
}

function findDisplacement(
  nodeX: number,
  x: number,
  svgScale: number,
  nodeY: number,
  y: number
) {
  const xDisplacement = nodeX - x * svgScale;
  const yDisplacement = nodeY - y * svgScale;
  return { xDisplacement, yDisplacement };
}

export function useMouseMoveSvgDraggable(
  nodeRef: React.MutableRefObject<DataNode<any>[]>,
  uniqueElementKey: string
) {
  const forceGraphDraggable = useContext(ForceGraphDraggableContext);
  const { draggingNodeIndex, draggingNodeKey } = forceGraphDraggable;
  const { leftMouseDown, rightMouseDown, lastEvent } = useContext(
    ForceGraphMouseButtonEventsContext
  );
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const { svgRef, svgScale } = useSvgScale(uniqueElementKey);
  const [displacementRef, setDisplacementRef] = useState({ x: 0, y: 0 });
  const [draggablePosition, setDraggablePosition] = useState({ x: 0, y: 0 });
  const [readyToDrag, setReadyToDrag] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const trackMouseMove = (event: MouseEvent) => {
      mousePositionRef.current = { x: event.clientX, y: event.clientY };
    };

    window.addEventListener('mousemove', trackMouseMove);

    return () => {
      window.removeEventListener('mousemove', trackMouseMove);
    };
  }, [mousePositionRef]);

  const mouseDownDispatch = (draggingNodeIndex: number) => {
    const draggingNode = nodeRef.current[draggingNodeIndex];
    const { x: nodeX, y: nodeY } = draggingNode;
    if (!nodeX || !nodeY) return;
    const { x, y } = mousePositionRef.current;
    const { xDisplacement, yDisplacement } = findDisplacement(
      nodeX,
      x,
      svgScale,
      nodeY,
      y
    );
    setDisplacementRef({ x: xDisplacement, y: yDisplacement });
    setDraggablePosition({
      x: xDisplacement + x * svgScale,
      y: yDisplacement + y * svgScale
    });
    setReadyToDrag(true);
  };

  useEffect(() => {
    if (readyToDrag) {
      setIsDragging(true);
    } else {
      setIsDragging(false);
    }
  }, [readyToDrag, draggablePosition]);

  const handleMouseUp = useMouseUpDispatcher();

  function handleMouseMove(e: React.MouseEvent) {
    if (
      !leftMouseDown ||
      draggingNodeIndex === null ||
      draggingNodeIndex === undefined
    )
      return;

    const { x, y } = displacementRef;
    const newX = x + e.clientX * svgScale;
    const newY = y + e.clientY * svgScale;
    setDraggablePosition({ x: newX, y: newY });
  }

  return {
    draggingNodeKey,
    draggingNodeIndex,
    handleMouseMove,
    handleMouseUp,
    svgRef,
    svgScale,
    draggablePosition,
    isDragging,
    mouseDownDispatch
  };
}
