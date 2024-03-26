import React, { useContext, useEffect, useRef, useState } from 'react';
import { DataNode } from '../../api/zod-mods';
import { useSvgScale } from '../use-svg-scale';
import { findDisplacement } from './find-displacement';
import { useMouseUpDispatcher } from './use-mouse-up-dispatcher';
import {
  ForceGraphDraggableContext,
  ForceGraphMouseButtonEventsContext
} from './mouse-event-context-creator';

export function useMouseMoveSvgDraggable(
  nodeRef: React.MutableRefObject<DataNode<any>[]>,
  uniqueElementKey: string
) {
  const forceGraphDraggable = useContext(ForceGraphDraggableContext);
  const { draggingNodeIndex, draggingNodeKey } = forceGraphDraggable;
  const { leftMouseDown } = useContext(ForceGraphMouseButtonEventsContext);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const { svgRef, svgScale } = useSvgScale(uniqueElementKey);
  const [displacementRef, setDisplacementRef] = useState({ x: 0, y: 0 });
  const [draggablePosition, setDraggablePosition] = useState({ x: 0, y: 0 });
  const [readyToDrag, setReadyToDrag] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const lastRenderTimer = useRef(Date.now());

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

    const elapsed = Date.now() - lastRenderTimer.current;
    if (elapsed >= 25) {
      lastRenderTimer.current = Date.now();
      const { x, y } = displacementRef;
      const newX = x + e.clientX * svgScale;
      const newY = y + e.clientY * svgScale;
      setDraggablePosition({ x: newX, y: newY });
    }
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