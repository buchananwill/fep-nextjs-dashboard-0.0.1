'use client';
import { DataNode, GraphDto } from '../../api/zod-mods';
import { GenericNodeContextProvider } from '../nodes/generic-node-context-provider';
import { GenericLinkContextProvider } from '../links/generic-link-context-provider';
import ForceSimWrapper from '../force-sim-wrapper';
import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useRef
} from 'react';
import { useGraphElements } from '../aggregate-functions/use-graph-elements';
import { ProductComponentStateDto } from '../../api/dtos/ProductComponentStateDtoSchema';

import { useDraggable } from '@dnd-kit/core';
import { useDragToTranslate } from '../../components/draggable-to-translate/draggable-to-translate';
import { useSelectiveContextListenerBoolean } from '../../components/selective-context/selective-context-manager-boolean';
import { useSelectiveContextListenerNumber } from '../../components/selective-context/selective-context-manager-number';
import GraphViewOptions from '../components/graph-view-options';
import NodeInteractionProvider from '../nodes/node-interaction-context';
import {
  GenericNodeRefContext,
  useGenericGraphRefs,
  useGenericNodeContext
} from '../nodes/generic-node-context-creator';
import {
  GenericLinkRefContext,
  useGenericLinkContext
} from '../links/generic-link-context-creator';
import {
  DraggablePositionContext,
  IsDraggingContext,
  MouseDownDispatchContext,
  useMouseMoveSvgDraggable
} from '../force-graph-dnd/mouse-event-context-creator';
import { node } from 'prop-types';
import { useSelectiveContextGraphDispatch } from './graph-context-creator';
import { useSelectiveContextDispatchNumberList } from '../../components/selective-context/selective-context-manager-number-list';

export default function Graph<T>({
  titleList,
  textList,
  uniqueGraphName,
  children
}: {
  // graphDto?: GraphDto<T>;
  textList: string[];
  titleList: string[];
  uniqueGraphName: string;
} & PropsWithChildren) {
  const textAccessor = (n: number) => textList[n] || '';
  const titleAccessor = (n: number) => titleList[n] || ''; //auxNodes[n.data.entityId].data.product.name;

  const { nodes } = useGenericNodeContext<T>();
  const { links } = useGenericLinkContext<T>();
  const { nodeListRef, linkListRef } = useGenericGraphRefs<T>();

  const { nodeElements, linkElements, textElements } = useGraphElements(
    nodes,
    links,
    textAccessor,
    titleAccessor
  );

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'draggable'
  });
  const { currentState } = useSelectiveContextListenerNumber(
    `zoom-${uniqueGraphName}`,
    `${uniqueGraphName}`,
    60
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

  const x = currentState / 2000;
  const translationContextInterface = useDragToTranslate();
  const translationElement = translationContextInterface['draggable'];
  const xTranslate = (transform?.x || 0) + (translationElement?.x || 0);
  const yTranslate = (transform?.y || 0) + (translationElement?.y || 0);

  const scale = 1000 / currentState;
  const dimensionsArray = useMemo(() => {
    const width = 1800 * scale;
    const height = 1200 * scale;
    return [width, height];
  }, [scale]);

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
                    viewBox={`0 0 ${dimensionsArray[0]} ${dimensionsArray[1]}`}
                    style={{ width: '900', height: '600' }}
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
                      transform={`translate(${xTranslate * svgScale} ${
                        yTranslate * svgScale
                      })`}
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
              <div
                className={
                  'flex flex-col overflow-auto border-slate-600 border-2 rounded-lg px-2 pb-2 mt-2 relative'
                }
                style={{ height: '600px' }}
              >
                {children}
              </div>
            </div>
          </IsDraggingContext.Provider>
        </DraggablePositionContext.Provider>
      </NodeInteractionProvider>
    </MouseDownDispatchContext.Provider>
  );
}
