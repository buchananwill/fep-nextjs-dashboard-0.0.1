'use client';
import { TransitionWrapper } from '../../components/transition-wrapper';
import React, { ReactElement, useContext, useMemo } from 'react';
import { useNodeInteractionContext } from './node-interaction-context';
import { DataNode } from '../../api/zod-mods';
import { useGenericNodeContext } from './generic-node-context-creator';
import { useSelectiveContextListenerBoolean } from '../../components/selective-context/selective-context-manager-boolean';
import {
  LeftCtrlListener,
  LeftShiftListener
} from '../../components/key-listener-context/key-listener-context-creator';

export default function NodeText<T>({
  textIndex,
  children
}: {
  textIndex: number;
  children?: ReactElement<SVGElement>;
}) {
  const shiftHeld = useContext(LeftShiftListener);
  const leftCtrlHeld = useContext(LeftCtrlListener);
  const { nodes, uniqueGraphName } = useGenericNodeContext<DataNode<T>>();
  const listenerKey = useMemo(
    () => `node-text-${textIndex}-${uniqueGraphName}`,
    [textIndex, uniqueGraphName]
  );

  const updatedData = nodes[textIndex];

  const { selected, hover, dispatch } = useNodeInteractionContext();

  const { isTrue: pinTextToSelected } = useSelectiveContextListenerBoolean(
    `lock-text-with-select-${uniqueGraphName}`,
    listenerKey,
    false
  );

  const { id } = updatedData;
  const show = shiftHeld || hover === id || selected.includes(id);

  function handleOnClick() {
    if (!leftCtrlHeld) {
      dispatch({ type: 'toggleSelect', payload: id });
      console.log('Node:', updatedData);
    }
  }

  return (
    <TransitionWrapper trigger={show}>
      {(style) => (
        <g
          style={{
            ...style,
            fontFamily: 'Century Gothic', // Spread other props?
            fontSize: '8',
            transitionProperty: 'opacity'
          }}
          transform={`translate(${updatedData.x}, ${updatedData.y})`}
          // onMouseEnter={() => dispatch({ type: 'setHover', payload: id })}
          // onMouseLeave={() => dispatch({ type: 'setHover', payload: null })}
          // onClick={() => handleOnClick()}
          // className={'select-none cursor-pointer'}
          pointerEvents="none"
        >
          <circle
            cx={0}
            cy={0}
            r={20}
            strokeWidth={2}
            className={`fill-white stroke-emerald-200 opacity-50 `}
            // fill={'white'}
          ></circle>
          <circle
            cx={0}
            cy={0}
            r={6}
            className={`${
              selected.includes(id)
                ? 'fill-red-500'
                : hover === id
                ? 'fill-blue-500'
                : 'fill-gray-500'
            } transition-colors`}
          ></circle>

          <g>
            {(hover === id ||
              shiftHeld ||
              (selected.includes(id) && pinTextToSelected)) &&
              children &&
              children}
          </g>
        </g>
      )}
    </TransitionWrapper>
  );
}
