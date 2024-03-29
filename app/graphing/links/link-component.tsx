'use client';
import { DataLink, DataNode } from '../../api/zod-mods';
import React from 'react';
import { useGenericLinkContext } from './generic-link-context-creator';
import { useNodeSelectedListener } from '../nodes/node-interaction-context';
import { BASE_HSL } from '../../generic/components/color/color-context';
import * as d3 from 'd3';
import { useSelectiveContextListenerBoolean } from '../../selective-context/components/typed/selective-context-manager-boolean';
import { HasNumberIdDto } from '../../api/dtos/HasNumberIdDtoSchema';
import { useGenericGraphRefs } from '../nodes/generic-node-context-creator';
import { useSelectiveContextListenerNumber } from '../../selective-context/components/typed/selective-context-manager-number';
import { NodePositionsKey } from '../graph-types/organization/curriculum-delivery-graph';
import { useSineLutContext } from '../../contexts/animation-sync-context/animation-sync-context-creator';

export function LinkComponent<T extends HasNumberIdDto>({
  children,
  linkIndex,
  linkData
}: {
  linkData: DataLink<T>;
  linkIndex: number;
  children?: React.ReactSVGElement;
}) {
  const { uniqueGraphName } = useGenericLinkContext<T>();
  const { linkListRef } = useGenericGraphRefs();

  const listenerKey = `link-${linkData.closureType}-${linkData.id}`;

  useSelectiveContextListenerNumber(NodePositionsKey, listenerKey, 0);

  const genericLinks = linkListRef?.current;

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

  const updatedLinkOptional =
    genericLinks === undefined || genericLinks.length < linkIndex
      ? undefined
      : genericLinks[linkIndex];
  let updatedLink: DataLink<T> | undefined;

  const sourceSelected = useNodeSelectedListener(updatedLinkOptional?.source);
  const targetSelected = useNodeSelectedListener(updatedLinkOptional?.target);

  const sineLutSync = Math.abs(useSineLutContext(Date.now() / 10));

  if (updatedLinkOptional !== undefined) {
    updatedLink = updatedLinkOptional as DataLink<T>;
  }

  if (
    updatedLink === undefined ||
    updatedLink.source === undefined ||
    !updatedLink.target === undefined
  ) {
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

  const arrowToParentLocation = {
    ...locationInterpolation(0.67 + 0.15 * sineLutSync)
  };
  const arrowToChildLocation = {
    ...locationInterpolation(0.33 - 0.15 * sineLutSync)
  };

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
              // className={'animate-bounce-less'}
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
              // className={'animate-bounce-less'}
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
