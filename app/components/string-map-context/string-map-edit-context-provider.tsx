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
  useReducer
} from 'react';
import { useSelectiveContextControllerBoolean } from '../selective-context/selective-context-manager-boolean';
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

  const { currentState: unsavedChanges, dispatchUpdate: setUnsaved } =
    useSelectiveContextControllerBoolean(
      unsavedChangesEntityKey,
      providerListenerKey,
      false
    );

  const { isOpen, closeModal, openModal } = useModal();

  async function handleCommit() {
    if (commitServerAction === undefined) return;
    const entityList = Object.values(currentModels as StringMap<T>);
    commitServerAction(entityList).then((r) => {
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
