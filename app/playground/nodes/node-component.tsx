'use client';
import { DataNode } from '../../api/zod-mods';
import React, { useContext, useMemo } from 'react';
import { useNodeInteractionContext } from './node-interaction-context';
import {
  GenericNodeRefContext,
  useGenericNodeContext
} from './generic-node-context-creator';
import { useForceGraphDndElement } from '../force-graph-dnd/mouse-event-context-creator';

// Good start - clear name and type generic
export function NodeComponent<T>({
  gProps,
  enableRunnable,
  nodeIndex
}: {
  gProps?: React.SVGProps<SVGGElement>;
  nodeIndex: number;
  enableRunnable?: boolean;
}) {
  const { nodes } = useGenericNodeContext<T>();
  const updatedNodeData = nodes[nodeIndex] as DataNode<T>;
  const nodeDragKey = useMemo(
    () => `node-${updatedNodeData.id}`,
    [updatedNodeData]
  );
  const { x, y, distanceFromRoot, data } = updatedNodeData; // Only x and y are necessarily relevant

  const nodeRef = useContext(GenericNodeRefContext);

  const { dispatch, hover, selected } = useNodeInteractionContext();

  const { mouseDown, mouseUp, doDrag, draggablePosition } =
    useForceGraphDndElement({
      draggingNodeIndex: nodeIndex,
      draggingNodeKey: nodeDragKey
    });

  const handleClick = enableRunnable
    ? () => {
        console.log('node:', updatedNodeData);
        dispatch({ type: 'toggleSelect', payload: updatedNodeData.id });
      }
    : () => {};

  let finalX = x || 0;
  let finalY = y || 0;

  if (doDrag) {
    const currentElement = nodeRef?.current[nodeIndex];
    if (!!currentElement) {
      currentElement.x = draggablePosition.x;
      currentElement.y = draggablePosition.y;
      finalX = draggablePosition.x;
      finalY = draggablePosition.y;
    }
  }

  return (
    <g
      transform={`translate(${finalX}, ${finalY})`}
      onMouseEnter={() =>
        dispatch({ type: 'setHover', payload: updatedNodeData.id })
      }
      onMouseLeave={() => dispatch({ type: 'setHover', payload: null })}
      onClick={handleClick}
      {...gProps}
      className={'select-none cursor-pointer'}
      onMouseDown={mouseDown}
      onMouseUp={mouseUp}
    >
      <circle
        cx={0}
        cy={0}
        r={Math.max((4 - (distanceFromRoot || 0)) * 2 + 10, 10)}
        className={'fill-transparent stroke-slate-600 stroke-2'}
      ></circle>
    </g>
  );
}
