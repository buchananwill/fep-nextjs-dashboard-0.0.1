import React from 'react';

import { useDraggableSvgElement } from './use-draggable-svg';

export default function DraggableRect({
  uniqueElementKey,
  color
}: {
  uniqueElementKey: string;
  color: string;
}) {
  const { handleMouseDown, handleMouseUp, draggableY, draggableX } =
    useDraggableSvgElement(uniqueElementKey);
  return (
    <rect
      transform={`translate(${draggableX}, ${draggableY})`}
      width={'10%'}
      height={'10%'}
      className={color}
      onMouseDown={(e) =>
        handleMouseDown(e, draggableX, draggableY, uniqueElementKey)
      }
      onMouseUp={handleMouseUp}
    />
  );
}
