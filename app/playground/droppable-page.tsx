'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  useDraggable,
  useDroppable
} from '@dnd-kit/core';
import React, { PropsWithChildren, useState } from 'react';
import {
  ArrowsPointingOutIcon,
  InboxArrowDownIcon
} from '@heroicons/react/24/outline';

function Draggable({ children }: PropsWithChildren) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'draggable'
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: '100'
      }
    : undefined;
  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      className={'h-fit w-fit leading-[0px]'}
    >
      {children}
    </button>
  );
}

function Droppable({ children }: { children: React.ReactNode }) {
  const { isOver, setNodeRef } = useDroppable({ id: 'droppable' });
  const style = {
    color: isOver ? 'green' : undefined
  };

  return (
    <div className={'relative h-fit w-fit '} style={style} ref={setNodeRef}>
      {children}
    </div>
  );
}

export default function PlaygroundPage() {
  const [isDropped, setIsDropped] = useState(false);
  const draggableMarkup = (
    <Draggable>
      <ArrowsPointingOutIcon
        className={'h-8 w-8 border rounded-lg p-1 bg-white'}
      ></ArrowsPointingOutIcon>
    </Draggable>
  );
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className={'flex'}>
        {!isDropped ? draggableMarkup : null}
        <div className={'flex flex-col justify-center'}>
          <Droppable>
            <InboxArrowDownIcon
              className={'h-24 w-24 m-2 border rounded-lg'}
            ></InboxArrowDownIcon>
            <div
              className={
                'absolute bottom-1/4 w-full h-fit whitespace-nowrap flex items-center justify-center p-0'
              }
            >
              <div
                className={
                  'text-center h-fit max-h-fit w-fit p-0 m-0 border-0 bg-white z-10 bg-opacity-90 rounded-lg leading-[0px]'
                }
              >
                {isDropped ? (
                  draggableMarkup
                ) : (
                  <span className={'leading-loose p-2'}>{'Drop Here'}</span>
                )}
              </div>
            </div>
          </Droppable>
        </div>
      </div>
    </DndContext>
  );

  function handleDragEnd(event: DragEndEvent) {
    if (event.over) {
      if (event.over.id === 'droppable') {
        setIsDropped(true);
      }
    } else {
      setIsDropped(false);
    }
  }
}
