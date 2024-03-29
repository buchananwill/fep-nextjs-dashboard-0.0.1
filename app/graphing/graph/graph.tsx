'use client';
import ForceSimWrapper from '../force-sim-wrapper';
import React, { PropsWithChildren } from 'react';
import { useGraphElements } from '../aggregate-functions/use-graph-elements';

import { useDraggable } from '@dnd-kit/core';

import { useSelectiveContextListenerNumber } from '../../selective-context/components/typed/selective-context-manager-number';
import GraphViewOptions from '../components/graph-view-options';
import NodeInteractionProvider from '../nodes/node-interaction-context';
import { useGenericGraphRefs } from '../nodes/generic-node-context-creator';
import {
  DraggablePositionContext,
  IsDraggingContext,
  MouseDownDispatchContext
} from '../force-graph-dnd/mouse-event-context-creator';
import { HasNumberIdDto } from '../../api/dtos/HasNumberIdDtoSchema';
import { useGraphName } from './graph-context-creator';
import GraphForceAdjuster from '../components/graph-force-adjustment';
import {
  ListenerKey,
  NodeEditorDisclosure,
  ShowNodeEditingKey
} from '../nodes/node-editor-disclosure';
import { useSelectiveContextListenerBoolean } from '../../selective-context/components/typed/selective-context-manager-boolean';
import { ShowForceAdjustmentsKey } from './show-force-adjustments';
import { useDragToTranslate } from '../../generic/components/draggable-to-translate/draggable-to-translate';
import { useMouseMoveSvgDraggable } from '../force-graph-dnd/use-mouse-move-svg-draggable';

export const DefaultGraphZoom = 100;
export const MaxGraphZoom = 200;
export const ConstantGraphZoomFactor = 2;
const DefaultGraphWidth = 900;
const DefaultGraphHeight = 600;
export default function Graph<T extends HasNumberIdDto>({
  titleList,
  textList,
  children
}: {
  textList: string[];
  titleList: string[];
} & PropsWithChildren) {
  const textAccessor = (n: number) => textList[n] || '';
  const titleAccessor = (n: number) => titleList[n] || ''; //auxNodes[n.data.entityId].data.product.name;
  const { nodeListRef, linkListRef } = useGenericGraphRefs<T>();

  const uniqueGraphName = useGraphName();

  const { nodeElements, linkElements, textElements } = useGraphElements(
    nodeListRef?.current || [],
    linkListRef?.current || [],
    textAccessor,
    titleAccessor
  );

  const { listeners, setNodeRef, transform } = useDraggable({
    id: 'draggable'
  });
  const { currentState } = useSelectiveContextListenerNumber(
    `zoom-${uniqueGraphName}`,
    `${uniqueGraphName}`,
    DefaultGraphZoom
  );

  const { isTrue: showNodeEditing } = useSelectiveContextListenerBoolean(
    ShowNodeEditingKey,
    ListenerKey,
    false
  );

  const { isTrue: showForceEditing } = useSelectiveContextListenerBoolean(
    ShowForceAdjustmentsKey,
    'graph.tsx',
    false
  );

  const {
    handleMouseMove,
    handleMouseUp,
    svgRef,
    draggablePosition,
    isDragging,
    mouseDownDispatch,
    svgScale
  } = useMouseMoveSvgDraggable(nodeListRef!, uniqueGraphName);

  const translationContextInterface = useDragToTranslate();
  const translationElement = translationContextInterface['draggable'];
  const xTranslate = (transform?.x || 0) + (translationElement?.x || 0);
  const yTranslate = (transform?.y || 0) + (translationElement?.y || 0);

  const scale = DefaultGraphZoom / currentState;

  const initialWidth = DefaultGraphWidth * scale;
  const initialHeight = DefaultGraphHeight * scale;
  const width = initialWidth * ConstantGraphZoomFactor;
  const height = initialHeight * ConstantGraphZoomFactor;
  const centerOffsetX = initialWidth - DefaultGraphWidth;
  const centerOffsetY = initialHeight - DefaultGraphHeight;

  return (
    <MouseDownDispatchContext.Provider value={mouseDownDispatch}>
      <NodeInteractionProvider>
        <DraggablePositionContext.Provider value={draggablePosition}>
          <IsDraggingContext.Provider value={isDragging}>
            <div className={'flex'}>
              <div className={'relative justify-center m-2 gap-2 h-fit w-fit'}>
                <div ref={setNodeRef}>
                  <svg
                    className={'border-2 border-slate-600 rounded-lg'}
                    viewBox={`0 0 ${width} ${height}`}
                    style={{
                      width: DefaultGraphWidth,
                      height: DefaultGraphHeight
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    ref={svgRef}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                  >
                    <rect
                      width={'100%'}
                      height={'100%'}
                      {...listeners}
                      className={'fill-transparent'}
                    />
                    <g
                      transform={`translate(${
                        xTranslate * svgScale + centerOffsetX
                      } ${yTranslate * svgScale + centerOffsetY})`}
                    >
                      <ForceSimWrapper
                        textElements={textElements}
                        linkElements={linkElements}
                        nodeElements={nodeElements}
                        uniqueGraphName={uniqueGraphName}
                      />
                    </g>
                  </svg>
                </div>

                <div
                  className={
                    'absolute w-fit h-fit top-4 right-4 Z-10 flex flex-col gap-1 items-center'
                  }
                >
                  <GraphViewOptions />
                </div>
              </div>
              {showForceEditing || showNodeEditing ? (
                <div
                  className={
                    'flex flex-col overflow-auto border-slate-600 border-2 rounded-lg px-2 pb-2 mt-2 relative'
                  }
                  style={{ height: '600px' }}
                >
                  {showNodeEditing ? (
                    <NodeEditorDisclosure />
                  ) : (
                    <div className={'h-2'}></div>
                  )}
                  <GraphForceAdjuster />
                  {children}
                </div>
              ) : (
                <GraphForceAdjuster />
              )}
            </div>
          </IsDraggingContext.Provider>
        </DraggablePositionContext.Provider>
      </NodeInteractionProvider>
    </MouseDownDispatchContext.Provider>
  );
}
