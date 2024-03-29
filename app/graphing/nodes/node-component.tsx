'use client';
import React, { ReactNode, useContext } from 'react';
import { useNodeInteractionContext } from './node-interaction-context';
import { GenericNodeRefContext } from './generic-node-context-creator';
import { useSelectiveContextListenerNumber } from '../../selective-context/components/typed/selective-context-manager-number';
import { NodePositionsKey } from '../graph-types/organization/curriculum-delivery-graph';
import { useForceGraphDndElement } from '../force-graph-dnd/use-force-graph-dnd-element';

// Good start - clear name and type generic
export function NodeComponent({
  gProps,
  enableRunnable,
  nodeIndex,
  children,
  nodeId
}: {
  gProps?: React.SVGProps<SVGGElement>;
  nodeIndex: number;
  enableRunnable?: boolean;
  children?: ReactNode;
  nodeId: number;
}) {
  const { dispatch } = useNodeInteractionContext();
  const nodeDragKey = `node-${nodeId}`;

  useSelectiveContextListenerNumber(NodePositionsKey, nodeDragKey, 0);

  const { mouseDown, mouseUp, doDrag, draggablePosition } =
    useForceGraphDndElement({
      draggingNodeIndex: nodeIndex,
      draggingNodeKey: nodeDragKey
    });

  const nodesRef = useContext(GenericNodeRefContext);
  if (nodesRef?.current === undefined || nodeIndex > nodesRef.current.length)
    return null;
  const updatedNodeData = nodesRef?.current[nodeIndex];

  const { x, y, distanceFromRoot } = updatedNodeData; // Only x and y are necessarily relevant

  const handleClick = enableRunnable
    ? () => {
        dispatch({ type: 'toggleSelect', payload: updatedNodeData.id });
      }
    : () => {};

  let finalX = x || 0;
  let finalY = y || 0;

  if (doDrag) {
    const currentElement = nodesRef.current[nodeIndex];
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

      {children && children}
    </g>
  );
}
