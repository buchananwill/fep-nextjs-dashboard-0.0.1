'use client';
import {
  StringMap,
  StringMapDispatch,
  StringMapReducer
} from '../../curriculum/delivery-models/contexts/string-map-context-creator';
import React, {
  Context,
  PropsWithChildren,
  ProviderExoticComponent,
  useEffect,
  useReducer,
  useRef
} from 'react';
import { useSelectiveContextControllerBoolean } from '../../generic/components/selective-context/selective-context-manager-boolean';
import {
  WorkTaskTypeContext,
  WorkTaskTypeContextDispatch
} from '../../curriculum/delivery-models/contexts/use-work-task-type-context';
import { WorkTaskTypeDto } from '../../api/dtos/WorkTaskTypeDtoSchema';
import { putWorkTaskTypes } from '../../api/actions/work-task-types';
import { UnsavedChangesModal } from '../unsaved-changes-modal';

import { getPayloadArray } from '../../curriculum/delivery-models/use-editing-context-dependency';
import { ActionResponsePromise } from '../../api/actions/actionResponse';
import { createContext } from 'preact/compat';
import { AccessorFunction } from '../../staffroom/teachers/rating-table';
import { useModal } from '../confirm-action-modal';
import {
  useSelectiveContextControllerStringList,
  useSelectiveContextDispatchStringList
} from '../../generic/components/selective-context/selective-context-manager-string-list';
import { EmptyIdArray } from '../../curriculum/delivery-models/contexts/curriculum-models-context-provider';

import { isNotUndefined } from '../../api/main';

export interface StringMapEditContextProviderProps<T> {
  initialEntityMap: StringMap<T>;
  unsavedChangesEntityKey: string;
  providerListenerKey: string;
  commitServerAction?: (entityList: T[]) => ActionResponsePromise<T[]>;
  mapContext: Context<StringMap<T>>;
  dispatchContext: Context<StringMapDispatch<T>>;
  mapKeyAccessor: AccessorFunction<T, string>;
}

export function StringMapEditContextProvider<T>({
  initialEntityMap,
  commitServerAction,
  unsavedChangesEntityKey,
  dispatchContext,
  mapContext,
  providerListenerKey,
  children,
  mapKeyAccessor
}: StringMapEditContextProviderProps<T> & PropsWithChildren) {
  const DispatchProvider = dispatchContext.Provider;
  const MapProvider = mapContext.Provider;
  const EntityReducer = StringMapReducer<T>;
  const [currentModels, dispatch] = useReducer(EntityReducer, initialEntityMap);
  const initialMapRef = useRef(initialEntityMap);

  const { currentState: unsavedChanges, dispatchUpdate: setUnsaved } =
    useSelectiveContextControllerBoolean(
      unsavedChangesEntityKey,
      providerListenerKey,
      false
    );

  const { currentState } = useSelectiveContextControllerStringList(
    unsavedChangesEntityKey,
    providerListenerKey,
    EmptyIdArray
  );

  const { isOpen, closeModal, openModal } = useModal();

  useEffect(() => {
    if (initialMapRef.current !== initialEntityMap) {
      const payloadArray = getPayloadArray(
        Object.values(currentModels),
        mapKeyAccessor
      );
      dispatch({ type: 'deleteAll', payload: payloadArray });
      const replacementMap = getPayloadArray(
        Object.values(initialEntityMap),
        mapKeyAccessor
      );
      dispatch({ type: 'updateAll', payload: replacementMap });
      initialMapRef.current = initialEntityMap;
    }
  }, [currentModels, initialEntityMap, mapKeyAccessor]);

  async function handleCommit() {
    if (commitServerAction === undefined) return;
    const updatedEntities = currentState
      .map((id) => currentModels[id])
      .filter(isNotUndefined);
    // const entityList = Object.values(currentModels as StringMap<T>);
    commitServerAction(updatedEntities).then((r) => {
      if (r.data) {
        const schemas = getPayloadArray(r.data, mapKeyAccessor);
        dispatch({ type: 'updateAll', payload: schemas });
        setUnsaved({ contextKey: unsavedChangesEntityKey, value: false });
      }
    });
  }

  return (
    <MapProvider value={currentModels}>
      <DispatchProvider value={dispatch}>
        {children}
        <UnsavedChangesModal
          unsavedChanges={unsavedChanges}
          handleOpen={() => openModal()}
          show={isOpen}
          onClose={closeModal}
          onConfirm={() => {
            closeModal();
            handleCommit();
          }}
          onCancel={() => {
            closeModal();
          }}
        >
          <p>Commit updated models to the database?</p>
        </UnsavedChangesModal>
      </DispatchProvider>
    </MapProvider>
  );
}
