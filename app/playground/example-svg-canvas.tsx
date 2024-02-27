import React from 'react';
import DraggableRect from './draggable-rect';
import {
  useDraggableSvgElement,
  useDraggableSvgRoot
} from '../graphing/use-draggable-svg';

const width = 1800;
const height = 1200;

export function ExampleSvgCanvas(props: {}) {
  const { svgRef, handleMouseUp, handleMouseMove } =
    useDraggableSvgRoot('test-svg-root');

  return (
    <svg
      ref={svgRef}
      className={'border-2 border-slate-600 rounded-lg'}
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: '900', height: '600' }}
      xmlns="http://www.w3.org/2000/svg"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <DraggableRect
        uniqueElementKey={'teal-rect'}
        color={'fill-teal-400'}
      ></DraggableRect>
      <DraggableRect
        uniqueElementKey={'fuchsia-rect'}
        color={'fill-fuchsia-500'}
      ></DraggableRect>
    </svg>
  );
}
