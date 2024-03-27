'use client';
import {
  StringMap,
  StringMapDispatch,
  StringMapReducer
} from './string-map-reducer';
import React, { Context, PropsWithChildren, useReducer, useRef } from 'react';
import { useSelectiveContextControllerBoolean } from '../../generic/components/selective-context/selective-context-manager-boolean';

import { getPayloadArray } from '../../curriculum/delivery-models/use-editing-context-dependency';
import { ActionResponsePromise } from '../../api/actions/actionResponse';
import { AccessorFunction } from '../../generic/components/tables/rating/rating-table';
import { useSelectiveContextControllerStringList } from '../../generic/components/selective-context/selective-context-manager-string-list';
import { EmptyIdArray } from '../../curriculum/delivery-models/contexts/curriculum-models-context-provider';

import { isNotUndefined } from '../../api/main';
import { useModal } from '../../generic/components/modals/confirm-action-modal';
import { UnsavedChangesModal } from '../../generic/components/modals/unsaved-changes-modal';
import { useSyncStringMapToProps } from './use-sync-string-map-to-props';

export interface WriteableStringMapContextProviderProps<T> {
  initialEntityMap: StringMap<T>;
  unsavedChangesEntityKey: string;
  providerListenerKey: string;
  commitServerAction?: (entityList: T[]) => ActionResponsePromise<T[]>;
  mapContext: Context<StringMap<T>>;
  dispatchContext: Context<StringMapDispatch<T>>;
  mapKeyAccessor: AccessorFunction<T, string>;
}

export function WriteableStringMapContextProvider<T>({
  initialEntityMap,
  commitServerAction,
  unsavedChangesEntityKey,
  dispatchContext,
  mapContext,
  providerListenerKey,
  children,
  mapKeyAccessor
}: WriteableStringMapContextProviderProps<T> & PropsWithChildren) {
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

  useSyncStringMapToProps(
    initialEntityMap,
    initialMapRef,
    dispatch,
    currentModels,
    mapKeyAccessor
  );

  const { isOpen, closeModal, openModal } = useModal();

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
