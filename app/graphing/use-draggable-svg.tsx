import {
  useSelectiveContextControllerNumber,
  useSelectiveContextListenerNumber
} from '../components/selective-context/selective-context-manager-number';
import { useSelectiveContextControllerString } from '../components/selective-context/selective-context-manager-string';
import { useSelectiveContextControllerBoolean } from '../components/selective-context/selective-context-manager-boolean';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useRootSvgContext } from './root-svg-context';

export function useSvgZoom(uniqueElementKey: string, rootSvgKey: string) {
  const { currentState: zoomScale } = useSelectiveContextListenerNumber(
    `zoom-${rootSvgKey}`,
    `${uniqueElementKey}-drag-scale`,
    1
  );
  return zoomScale;
}

export function useSvgScale(uniqueElementKey: string) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const rootSvgKey = useRootSvgContext();
  const svgScaleKey = `svg-scale-${rootSvgKey}`;
  const zoomScale = useSvgZoom(uniqueElementKey, rootSvgKey);

  const { currentState: svgScale, dispatchUpdate: setSvgScale } =
    useSelectiveContextControllerNumber({
      contextKey: svgScaleKey,
      listenerKey: uniqueElementKey,
      initialValue: 1
    });

  useEffect(() => {
    const svg = svgRef.current;

    if (svg) {
      const viewBox = svg.viewBox;
      setSvgScale({
        contextKey: svgScaleKey,
        value: viewBox.baseVal.width / svg.width.baseVal.value
      });
    }
  }, [svgRef, setSvgScale, svgScaleKey, zoomScale]);

  return { svgScale, svgRef };
}

export function useDraggableSvgElement(uniqueElementKey: string) {
  const rootSvgKey = useRootSvgContext();

  const svgDraggingKey = `svg-is-dragging-${rootSvgKey}`;
  const svgStartPosXKey = `svg-start-pos-x-${rootSvgKey}`;
  const svgStartPosYKey = `svg-start-pos-y-${rootSvgKey}`;
  const svgMouseDownKey = `svg-mouse-down-${rootSvgKey}`;
  const svgCurrentDragTargetKey = `svg-current-drag-target-${rootSvgKey}`;

  const { currentState: draggableX, dispatchUpdate: updateX } =
    useSelectiveContextControllerNumber({
      contextKey: `drag-x-${uniqueElementKey}`,
      listenerKey: uniqueElementKey,
      initialValue: 0
    });
  const { currentState: draggableY, dispatchUpdate: updateY } =
    useSelectiveContextControllerNumber({
      contextKey: `drag-y-${uniqueElementKey}`,
      listenerKey: uniqueElementKey,
      initialValue: 0
    });
  const { currentState: startPosX, dispatchUpdate: updateStartPosX } =
    useSelectiveContextControllerNumber({
      contextKey: svgStartPosXKey,
      listenerKey: uniqueElementKey,
      initialValue: 0
    });
  const { currentState: startPosY, dispatchUpdate: updateStartPosY } =
    useSelectiveContextControllerNumber({
      contextKey: svgStartPosYKey,
      listenerKey: uniqueElementKey,
      initialValue: 0
    });
  const { currentState: dragXCurrent, dispatchUpdate: dispatchCurrentX } =
    useSelectiveContextControllerNumber({
      contextKey: 'drag-x-current',
      listenerKey: uniqueElementKey,
      initialValue: 0
    });
  const { currentState: dragYCurrent, dispatchUpdate: dispatchCurrentY } =
    useSelectiveContextControllerNumber({
      contextKey: 'drag-y-current',
      listenerKey: uniqueElementKey,
      initialValue: 0
    });
  const { currentState: mouseDown, dispatchUpdate: setMouseDown } =
    useSelectiveContextControllerBoolean(
      svgMouseDownKey,
      uniqueElementKey,
      false
    );

  const { currentState: currentDragTarget, dispatchUpdate } =
    useSelectiveContextControllerString(
      svgCurrentDragTargetKey,
      uniqueElementKey,
      ''
    );

  const { currentState: isDragging, dispatchUpdate: setIsDragging } =
    useSelectiveContextControllerBoolean(
      svgDraggingKey,
      uniqueElementKey,
      false
    );

  function updateStartPos(clientX: number, clientY: number) {
    updateStartPosX({
      contextKey: svgStartPosXKey,
      value: clientX
    });
    updateStartPosY({
      contextKey: svgStartPosYKey,
      value: clientY
    });
  }

  const handleMouseDown = (
    event: React.MouseEvent,
    targetCurrentX: number,
    targetCurrentY: number,
    targetKey: string
  ) => {
    dispatchCurrentX({ contextKey: 'drag-x-current', value: targetCurrentX });
    dispatchCurrentY({ contextKey: 'drag-y-current', value: targetCurrentY });
    updateX({ contextKey: targetKey, value: targetCurrentX });
    updateY({ contextKey: targetKey, value: targetCurrentY });

    const { clientX, clientY } = event.nativeEvent;

    dispatchUpdate({ contextKey: svgCurrentDragTargetKey, value: targetKey });
    updateStartPos(clientX, clientY);

    setMouseDown({ contextKey: svgMouseDownKey, value: true });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    console.log('Mouse up!', e);
    setMouseDown({ contextKey: svgMouseDownKey, value: false });
    setIsDragging({ contextKey: svgDraggingKey, value: false });
    dispatchUpdate({ contextKey: 'svgDragKey', value: '' });
  };

  return {
    handleMouseUp,
    handleMouseDown,
    draggableX,
    draggableY,
    currentDragTarget,
    isDragging
  };
}
export function useDraggableSvgRoot(uniqueElementKey: string) {
  const rootSvgKey = useRootSvgContext();

  const svgStartPosXKey = `svg-start-pos-x-${rootSvgKey}`;
  const svgStartPosYKey = `svg-start-pos-y-${rootSvgKey}`;
  const svgDraggingKey = `svg-is-dragging-${rootSvgKey}`;
  const svgMouseDownKey = `svg-mouse-down-${rootSvgKey}`;
  const svgCurrentDragTargetKey = `svg-current-drag-target-${rootSvgKey}`;

  const { currentState: mouseDown, dispatchUpdate: setMouseDown } =
    useSelectiveContextControllerBoolean(
      svgMouseDownKey,
      uniqueElementKey,
      false
    );
  const { currentState: isDragging, dispatchUpdate: setIsDragging } =
    useSelectiveContextControllerBoolean(
      svgDraggingKey,
      uniqueElementKey,
      false
    );

  const { currentState: startPosX, dispatchUpdate: updateStartPosX } =
    useSelectiveContextControllerNumber({
      contextKey: svgStartPosXKey,
      listenerKey: uniqueElementKey,
      initialValue: 0
    });
  const { currentState: startPosY, dispatchUpdate: updateStartPosY } =
    useSelectiveContextControllerNumber({
      contextKey: svgStartPosYKey,
      listenerKey: uniqueElementKey,
      initialValue: 0
    });

  const { currentState: dragXCurrent, dispatchUpdate: dispatchCurrentX } =
    useSelectiveContextControllerNumber({
      contextKey: 'drag-x-current',
      listenerKey: uniqueElementKey,
      initialValue: 0
    });
  const { currentState: dragYCurrent, dispatchUpdate: dispatchCurrentY } =
    useSelectiveContextControllerNumber({
      contextKey: 'drag-y-current',
      listenerKey: uniqueElementKey,
      initialValue: 0
    });
  const { currentState: currentDragTarget, dispatchUpdate } =
    useSelectiveContextControllerString(
      svgCurrentDragTargetKey,
      uniqueElementKey,
      ''
    );
  const { currentState: draggableX, dispatchUpdate: updateX } =
    useSelectiveContextControllerNumber({
      contextKey: `drag-x-${uniqueElementKey}`,
      listenerKey: uniqueElementKey,
      initialValue: 0
    });
  const { currentState: draggableY, dispatchUpdate: updateY } =
    useSelectiveContextControllerNumber({
      contextKey: `drag-y-${uniqueElementKey}`,
      listenerKey: uniqueElementKey,
      initialValue: 0
    });

  const { svgRef, svgScale } = useSvgScale(uniqueElementKey);

  const updateCurrent = (x: number, y: number) => {
    dispatchCurrentX({ contextKey: 'drag-x-current', value: x });
    dispatchCurrentY({ contextKey: 'drag-y-current', value: y });
  };

  function updateStartPos(clientX: number, clientY: number) {
    updateStartPosX({
      contextKey: svgStartPosXKey,
      value: clientX
    });
    updateStartPosY({
      contextKey: svgStartPosYKey,
      value: clientY
    });
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const updateFunction = (
      clientX: number,
      clientY: number,
      currentX: number,
      currentY: number
    ) => {
      const newX = currentX + (clientX - startPosX) * svgScale;
      const newY = currentY + (clientY - startPosY) * svgScale;

      updateX({
        contextKey: `drag-x-${currentDragTarget}`,
        value: newX
      });
      updateY({
        contextKey: `drag-y-${currentDragTarget}`,
        value: newY
      });
      updateCurrent(newX, newY);
      updateStartPos(clientX, clientY);
    };
    const { clientY, clientX } = e.nativeEvent;
    if (!mouseDown || !currentDragTarget) return;

    updateFunction(clientX, clientY, dragXCurrent, dragYCurrent);
    updateStartPosX({ contextKey: svgStartPosXKey, value: clientX });
    updateStartPosY({ contextKey: svgStartPosYKey, value: clientY });
    setIsDragging({ contextKey: svgDraggingKey, value: true });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    setMouseDown({ contextKey: svgMouseDownKey, value: false });
    setIsDragging({ contextKey: svgDraggingKey, value: false });
    dispatchUpdate({ contextKey: 'svgDragKey', value: '' });
  };

  return {
    handleMouseUp,
    handleMouseMove,
    draggableX,
    draggableY,
    svgRef,
    currentDragTarget,
    mouseDown
  };
}
