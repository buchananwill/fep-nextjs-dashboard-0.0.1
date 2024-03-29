'use client';

import React, { ReactElement, useContext, useMemo } from 'react';
import { useNodeInteractionContext } from './node-interaction-context';
import { DataNode } from '../../api/zod-mods';
import {
  useGenericGraphRefs,
  useGenericNodeContext
} from './generic-node-context-creator';
import { useSelectiveContextListenerBoolean } from '../../selective-context/components/typed/selective-context-manager-boolean';

import { HasNumberIdDto } from '../../api/dtos/HasNumberIdDtoSchema';
import { useSelectiveContextListenerNumber } from '../../selective-context/components/typed/selective-context-manager-number';
import { NodePositionsKey } from '../graph-types/organization/curriculum-delivery-graph';
import { LeftCtrlListener } from '../../generic/components/key-listener-context/key-listener-context-creator';
import { TransitionWrapper } from '../../generic/components/svg/transition-wrapper';

export default function NodeText<T extends HasNumberIdDto>({
  textIndex,
  children
}: {
  textIndex: number;
  children?: ReactElement<SVGElement>;
}) {
  const leftCtrlHeld = useContext(LeftCtrlListener);
  const { uniqueGraphName } = useGenericNodeContext<DataNode<T>>();
  const { nodeListRef } = useGenericGraphRefs();
  const listenerKey = useMemo(
    () => `node-text-${textIndex}-${uniqueGraphName}`,
    [textIndex, uniqueGraphName]
  );
  const { selected, hover } = useNodeInteractionContext();

  useSelectiveContextListenerNumber(NodePositionsKey, listenerKey, 0);

  const { isTrue: pinTextToSelected } = useSelectiveContextListenerBoolean(
    `lock-text-with-select-${uniqueGraphName}`,
    listenerKey,
    false
  );

  if (nodeListRef?.current === undefined) {
    return null;
  }

  const updatedData = nodeListRef.current[textIndex];

  const { id } = updatedData;
  const show = leftCtrlHeld || hover === id || selected.includes(id);
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
          pointerEvents="none"
        >
          <circle
            cx={0}
            cy={0}
            r={20}
            strokeWidth={2}
            className={`fill-white stroke-emerald-200 opacity-50 `}
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
              leftCtrlHeld ||
              (selected.includes(id) && pinTextToSelected)) &&
              children &&
              children}
          </g>
        </g>
      )}
    </TransitionWrapper>
  );
}
