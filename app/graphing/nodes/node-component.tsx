'use client';
import { DataNode } from '../../api/zod-mods';
import React, { ReactNode, useContext, useMemo } from 'react';
import { useNodeInteractionContext } from './node-interaction-context';
import {
  GenericNodeRefContext,
  useGenericNodeContext
} from './generic-node-context-creator';
import { useForceGraphDndElement } from '../force-graph-dnd/mouse-event-context-creator';
import { HasNumberIdDto } from '../../api/dtos/HasNumberIdDtoSchema';
import { useSelectiveContextListenerNumber } from '../../components/selective-context/selective-context-manager-number';
import { NodePositionsKey } from '../graph-types/curriculum-delivery-graph';

// Good start - clear name and type generic
export function NodeComponent<T extends HasNumberIdDto>({
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
  const { nodes } = useGenericNodeContext<T>();
  // const updatedNodeData = nodes[nodeIndex];
  const { dispatch, hover, selected } = useNodeInteractionContext();
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

  const { x, y, distanceFromRoot, data } = updatedNodeData; // Only x and y are necessarily relevant

  const handleClick = enableRunnable
    ? () => {
        console.log('node:', updatedNodeData);
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

  if (nodeIndex === 0 || nodeIndex === 1) {
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
