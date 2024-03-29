import { DataNode } from '../../api/zod-mods';
import NodeText from '../nodes/node-text';
import React, { useContext } from 'react';
import { useSelectiveContextListenerNumber } from '../../selective-context/components/typed/selective-context-manager-number';
import { GraphContext } from '../graph/graph-context-creator';
import { HasNumberIdDto } from '../../api/dtos/HasNumberIdDtoSchema';

interface TextPosition {
  plate: { x: number; y: number };
  text: { x: number; y: number };
  title: { x: number; y: number };
}

const textPositions = {
  top: {
    plate: { x: -50, y: -45 },
    text: { x: 0, y: -30 },
    title: { x: 0, y: -50 }
  },
  bottom: {
    plate: { x: 50, y: 45 },
    text: { x: 0, y: 30 },
    title: { x: 0, y: 50 }
  },
  left: {
    plate: { x: -120, y: -15 },
    text: { x: -50, y: 0 },
    title: { x: -50, y: -20 }
  },
  right: {
    plate: { x: 120, y: 0 },
    text: { x: 50, y: 0 },
    title: { x: 50, y: -20 }
  },
  center: {
    plate: { x: 0, y: 0 },
    text: { x: 0, y: 0 },
    title: { x: -50, y: -20 }
  }
};

export function useTextElements<T extends HasNumberIdDto>(
  nodes: DataNode<T>[],
  textAccessor: (n: number) => string,
  titleAccessor: (n: number) => string,
  position: 'top' | 'bottom' | 'left' | 'right' | 'center' = 'center'
) {
  const textPosition = textPositions[position];

  return nodes.map((n, index) => (
    <TextElement
      key={`${index}-${n.id}`}
      n={n}
      index={index}
      text={textAccessor(index)}
      title={titleAccessor(index)}
      textPosition={textPosition}
    />
  ));
}

function TextElement<T extends HasNumberIdDto>({
  n,
  index,
  text,
  title,
  textPosition: { plate, text: textPosition, title: titlePosition }
}: {
  n: DataNode<T>;
  index: number;
  text: string;
  title: string;
  textPosition: TextPosition;
}) {
  const { uniqueGraphName } = useContext(GraphContext);
  const { currentState: textSizeMultiplier } =
    useSelectiveContextListenerNumber(
      `text-size-${uniqueGraphName}`,
      `${n.id}-${text}`,
      1
    );

  const textScale = textSizeMultiplier
    ? Math.sqrt(textSizeMultiplier) / 4 + 0.5
    : 1;

  return (
    <NodeText key={`text-${n.id}`} textIndex={index}>
      <g>
        <circle {...plate} r={24} className={'fill-white opacity-50'}></circle>
        {n.distanceFromRoot == 0 ? (
          <text
            {...titlePosition}
            textAnchor="middle"
            fontSize={'12'}
            transform={`scale(${textScale})`}
          >
            {title}
          </text>
        ) : (
          ''
        )}
        <text
          {...textPosition}
          dy=".3em"
          textAnchor="middle"
          fontWeight={'bold'}
          transform={`scale(${textScale})`}
        >
          {text}
        </text>
      </g>
    </NodeText>
  );
}
