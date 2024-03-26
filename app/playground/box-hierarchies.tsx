'use client';
import { Card, Title } from '@tremor/react';
import React, { useState } from 'react';
import { DndContext, useDraggable } from '@dnd-kit/core';
function getUnitRow(length: number, keys: string[]) {
  const units: React.JSX.Element[] = [];
  for (let i = 0; i < length; i++) {
    units.push(<BoxUnit key={keys[i]} dragId={keys[i]}></BoxUnit>);
  }
  return units;
}

function getRows(
  length: number,
  height: number,
  keys: string[]
): React.ReactElement[] {
  const rows: React.ReactElement[] = [];
  for (let i = 0; i < height; i++) {
    rows.push(
      <div
        key={`row-${i}`}
        className={'flex w-fit h-fit border-y border-slate-200'}
      >
        {...getUnitRow(length, keys.slice(i * length, i * length + length))}
      </div>
    );
  }
  return rows;
}

export default function BoxHierarchies() {
  const keys: string[] = [];
  for (let i = 0; i < 360; i++) {
    const key = crypto.randomUUID();
    keys.push(key);
  }

  return (
    <DndContext>
      <Card className={'mb-4'}>
        <Title>Hierarchies</Title>
        <div className={'w-fit h-fit border-2 rounded-md border-slate-200'}>
          {getRows(60, 6, keys)}
        </div>
      </Card>
    </DndContext>
  );
}

function BoxUnit({ dragId }: { dragId: string }) {
  const { listeners, setNodeRef, isDragging, active, transform } = useDraggable(
    { id: dragId }
  );
  const [fillColor] = useState('bg-gray-100');

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: '100'
      }
    : undefined;

  return (
    <div ref={setNodeRef} {...listeners} className={'w-5 h-5 border-x'}>
      <div
        style={isDragging && active?.id == dragId ? style : {}}
        className={`h-full w-full border border-blue-600 rounded-md ${fillColor}`}
      ></div>
    </div>
  );
}
