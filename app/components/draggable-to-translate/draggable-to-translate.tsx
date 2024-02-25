'use client';
import { PropsWithChildren, useContext, useReducer, useState } from 'react';
import { DndContextProvider } from '../dnd-context-provider';
import {
  TranslationContext,
  TranslationContextInterface,
  TranslationDispatchContext,
  TranslationPayload
} from './translation-context-creator';
import { produce } from 'immer';
import { DragEndEvent } from '@dnd-kit/core';

function TranslationReducer(
  state: TranslationContextInterface,
  action: TranslationPayload
) {
  const { draggableKey, translation } = action;
  return produce(state, (draft) => {
    if (draft[draggableKey]) {
      const { x, y } = draft[draggableKey];
      draft[draggableKey] = { x: translation.x + x, y: translation.y + y };
    } else {
      draft[draggableKey] = translation;
    }
  });
}

export default function DraggableToTranslate({ children }: PropsWithChildren) {
  const [translationState, dispatch] = useReducer(
    TranslationReducer,
    {} as TranslationContextInterface
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const {
      delta: { x, y },
      active
    } = event;
    dispatch({
      draggableKey: active.id.toString(),
      translation: { x, y }
    });
  };

  return (
    <TranslationContext.Provider value={translationState}>
      <TranslationDispatchContext.Provider value={dispatch}>
        <DndContextProvider onDragEnd={handleDragEnd} autoScroll={false}>
          {children}
        </DndContextProvider>
      </TranslationDispatchContext.Provider>
    </TranslationContext.Provider>
  );
}

export function useDragToTranslate() {
  return useContext(TranslationContext);
}
