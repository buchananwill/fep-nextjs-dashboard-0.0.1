'use client';
import { GraphDto } from '../../api/zod-mods';
import DraggableToTranslate from '../../components/draggable-to-translate/draggable-to-translate';
import KeyListenerManager from '../../components/key-listener-context/key-listener-manager';

import Graph from './graph';
import React, {
  PropsWithChildren,
  useContext,
  useReducer,
  useState
} from 'react';
import {
  ForceGraphDraggable,
  ForceGraphDraggableContext,
  ForceGraphDraggableDispatch,
  ForceGraphMouseActionReducer,
  ForceGraphMouseButtonEventsContext,
  ForceGraphMouseButtonEventsDispatch
} from '../force-graph-dnd/mouse-event-context-creator';
import ZoomScaleContextProvider from '../../components/calendar-view/scale/zoom-scale-context-provider';
import { useGraphEditRootContext } from '../editing/use-graph-edit-root-context';
import { useDirectSimRefEditsController } from '../editing/use-graph-edit-button-hooks';
import { OrganizationDto } from '../../api/dtos/OrganizationDtoSchema';

export function GraphViewer<T, U>({
  textList,
  titleList,
  uniqueGraphName,
  children
}: {
  graphDto?: GraphDto<T>;
  textList: string[];
  titleList: string[];
  uniqueGraphName: string;
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
      <ZoomScaleContextProvider>
        <ForceGraphDraggableContext.Provider value={forceGraphDraggable}>
          <ForceGraphDraggableDispatch.Provider value={setForceGraphDraggable}>
            <ForceGraphMouseButtonEventsContext.Provider
              value={mouseActionContext}
            >
              <ForceGraphMouseButtonEventsDispatch.Provider value={reducer}>
                <Graph
                  // graphDto={graphDto}
                  textList={textList}
                  titleList={titleList}
                  uniqueGraphName={uniqueGraphName}
                >
                  {children}
                </Graph>
              </ForceGraphMouseButtonEventsDispatch.Provider>
            </ForceGraphMouseButtonEventsContext.Provider>
          </ForceGraphDraggableDispatch.Provider>
        </ForceGraphDraggableContext.Provider>
      </ZoomScaleContextProvider>
    </DraggableToTranslate>
  );
}
