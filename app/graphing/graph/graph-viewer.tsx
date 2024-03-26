'use client';
import { GraphDto } from '../../api/zod-mods';

import Graph from './graph';
import React, { PropsWithChildren, useReducer, useState } from 'react';
import {
  ForceGraphDraggable,
  ForceGraphDraggableContext,
  ForceGraphDraggableDispatch,
  ForceGraphMouseButtonEventsContext,
  ForceGraphMouseButtonEventsDispatch
} from '../force-graph-dnd/mouse-event-context-creator';
import { useGraphEditRootContext } from '../editing/functions/use-graph-edit-root-context';
import { HasNumberIdDto } from '../../api/dtos/HasNumberIdDtoSchema';
import DraggableToTranslate from '../../generic/components/draggable-to-translate/draggable-to-translate';
import { ForceGraphMouseActionReducer } from '../force-graph-dnd/force-graph-mouse-action-reducer';

export function GraphViewer<T extends HasNumberIdDto>({
  textList,
  titleList,
  children
}: {
  graphDto?: GraphDto<T>;
  textList: string[];
  titleList: string[];
} & PropsWithChildren) {
  const [mouseActionContext, reducer] = useReducer(
    ForceGraphMouseActionReducer,
    { leftMouseDown: false, rightMouseDown: false }
  );
  const [forceGraphDraggable, setForceGraphDraggable] =
    useState<ForceGraphDraggable>({});

  useGraphEditRootContext();

  return (
    <DraggableToTranslate>
      <ForceGraphDraggableContext.Provider value={forceGraphDraggable}>
        <ForceGraphDraggableDispatch.Provider value={setForceGraphDraggable}>
          <ForceGraphMouseButtonEventsContext.Provider
            value={mouseActionContext}
          >
            <ForceGraphMouseButtonEventsDispatch.Provider value={reducer}>
              <Graph textList={textList} titleList={titleList}>
                {children}
              </Graph>
            </ForceGraphMouseButtonEventsDispatch.Provider>
          </ForceGraphMouseButtonEventsContext.Provider>
        </ForceGraphDraggableDispatch.Provider>
      </ForceGraphDraggableContext.Provider>
    </DraggableToTranslate>
  );
}
