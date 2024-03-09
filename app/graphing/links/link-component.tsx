'use client';
import { DataLink, DataNode } from '../../api/zod-mods';
import React from 'react';
import { useGenericLinkContext } from './generic-link-context-creator';
import {
  useNodeInteractionContext,
  useNodeSelectedListener
} from '../nodes/node-interaction-context';
import { BASE_HSL } from '../../contexts/color/color-context';
import * as d3 from 'd3';
import { useSelectiveContextListenerBoolean } from '../../components/selective-context/selective-context-manager-boolean';
import { HasNumberIdDto } from '../../api/dtos/HasNumberIdDtoSchema';

export function LinkComponent<T extends HasNumberIdDto>({
  children,
  linkIndex,
  linkData
}: {
  linkData: DataLink<T>;
  linkIndex: number;
  children?: React.ReactSVGElement;
}) {
  const { links: genericLinks, uniqueGraphName } = useGenericLinkContext<T>();
  const { selected } = useNodeInteractionContext();
  // const { currentContext: showArrowsToParents } = useBooleanContext(
  //   'showArrowsToParents',
  //   true
  // );

  const listenerKey = `link-${linkData.closureType}-${linkData.id}`;

  const { isTrue: showArrowsToParents } = useSelectiveContextListenerBoolean(
    `arrows-to-parents-${uniqueGraphName}`,
    listenerKey,
    true
  );
  const { isTrue: showArrowsToChildren } = useSelectiveContextListenerBoolean(
    `arrows-to-children-${uniqueGraphName}`,
    listenerKey,
    true
  );
  const { isTrue: showEdgesFromChildren } = useSelectiveContextListenerBoolean(
    `highlight-from-source-${uniqueGraphName}`,
    listenerKey,
    true
  );
  const { isTrue: showEdgesFromParents } = useSelectiveContextListenerBoolean(
    `highlight-from-target-${uniqueGraphName}`,
    listenerKey,
    true
  );

  const updatedLink = genericLinks[linkIndex] as DataLink<T>;
  if (!updatedLink) {
    console.log(genericLinks, linkIndex, linkData);
  }
  const sourceSelected = useNodeSelectedListener(
    updatedLink.source as DataNode<T>
  );
  const targetSelected = useNodeSelectedListener(
    updatedLink.target as DataNode<T>
  );

  if (!updatedLink || !updatedLink.source || !updatedLink.target) {
    return null;
  }
  const source = updatedLink.source as DataNode<T>;
  const target = updatedLink.target as DataNode<T>;

  const { x: x1, y: y1 } = source;
  const { x: x2, y: y2 } = target;

  if (!(x1 && y1 && x2 && y2)) {
    return null;
  }

  const locationInterpolation = d3.interpolateObject(
    { x: x1, y: y1 },
    { x: x2, y: y2 }
  );

  const arrowToParentLocation = { ...locationInterpolation(0.85) };
  const arrowToChildLocation = { ...locationInterpolation(0.15) };

  const parentRotationAngle = calculateRotationAngle(
    x1,
    y1,
    arrowToParentLocation.x,
    arrowToParentLocation.y
  );
  const childRotationAngle = (parentRotationAngle + 180) % 360;

  const glow =
    (showEdgesFromChildren && sourceSelected) ||
    (showEdgesFromParents && targetSelected);
  const cssHSLA = BASE_HSL.emerald.cssHSLA;
  const insertA = cssHSLA.substring(0, 3) + 'a' + cssHSLA.substring(3);
  const emerald = d3.color(insertA)?.copy({ opacity: 0.2 });

  return (
    <g>
      <line
        x1={source.x}
        y1={source.y}
        x2={target.x}
        y2={target.y}
        className={'stroke-gray-600 stroke-1 opacity-25'}
        onClick={() => console.log(updatedLink)}
      >
        {children}
      </line>
      {glow && (
        <>
          <line
            x1={source.x}
            y1={source.y}
            x2={target.x}
            y2={target.y}
            stroke={emerald?.formatHsl() || cssHSLA}
            strokeWidth={4}
            strokeLinecap={'round'}
          ></line>
          {showArrowsToParents && (
            <path
              style={{
                translate: `${arrowToParentLocation.x}px ${arrowToParentLocation.y}px`,
                rotate: `${parentRotationAngle}deg`
              }}
              fill={'none'}
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke={cssHSLA}
              className={'animate-bounce-less'}
              d="m-7.5 7.5 7.5-7.5 7.5 7.5"
            />
          )}
          {showArrowsToChildren && (
            <path
              style={{
                translate: `${arrowToChildLocation.x}px ${arrowToChildLocation.y}px`,
                rotate: `${childRotationAngle}deg`
              }}
              fill={'none'}
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke={cssHSLA}
              className={'animate-bounce-less'}
              d="m-7.5 7.5 7.5-7.5 7.5 7.5"
            />
          )}
        </>
      )}
    </g>
  );
}

function calculateRotationAngle(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  offSetFromDown: number = 90
) {
  // Calculate angle in radians
  const angleRadians = Math.atan2(y2 - y1, x2 - x1);
  // Convert to degrees
  const angleDegrees = angleRadians * (180 / Math.PI);
  // Adjust so that upwards is 0 degrees
  const adjustedAngle = angleDegrees + offSetFromDown;

  // Normalize the angle to a 0-360 range
  let normalizedAngle = adjustedAngle % 360;
  if (normalizedAngle < 0) normalizedAngle += 360;

  return normalizedAngle;
}
