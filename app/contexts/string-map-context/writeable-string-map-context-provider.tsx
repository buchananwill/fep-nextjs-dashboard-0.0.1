'use client';
import {
  StringMap,
  StringMapDispatch,
  StringMapReducer
} from './string-map-reducer';
import React, { Context, PropsWithChildren, useReducer } from 'react';
import { useSelectiveContextControllerBoolean } from '../../selective-context/components/typed/selective-context-manager-boolean';

import { getPayloadArray } from '../../curriculum/delivery-models/get-payload-array';
import { ActionResponsePromise } from '../../api/actions/actionResponse';
import { AccessorFunction } from '../../generic/components/tables/rating/rating-table';
import { useSelectiveContextControllerStringList } from '../../selective-context/components/typed/selective-context-manager-string-list';

import { EmptyArray, isNotUndefined } from '../../api/main';
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

  const { currentState: unsavedChanges, dispatchUpdate: setUnsaved } =
    useSelectiveContextControllerBoolean(
      unsavedChangesEntityKey,
      providerListenerKey,
      false
    );

  const { currentState } = useSelectiveContextControllerStringList(
    unsavedChangesEntityKey,
    providerListenerKey,
    EmptyArray
  );

  useSyncStringMapToProps(
    initialEntityMap,
    dispatch,
    currentModels,
    mapKeyAccessor
  );

  const { show, onClose, openModal } = useModal();

  async function handleCommit() {
    if (commitServerAction === undefined) return;
    const set = new Set<string>();

    currentState.forEach((key) => set.add(key));
    const keyArray: string[] = [];
    set.forEach((element) => keyArray.push(element));
    const updatedEntities = keyArray
      .map((id) => currentModels[id])
      .filter(isNotUndefined);
    // const entityList = Object.values(currentModels as StringMap<T>);
    commitServerAction(updatedEntities).then((r) => {
      if (r.data) {
        const schemas = getPayloadArray(r.data, mapKeyAccessor);
        dispatch({ type: 'updateAll', payload: schemas });
        setUnsaved({ contextKey: unsavedChangesEntityKey, update: false });
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
          show={show}
          onClose={onClose}
          onConfirm={() => {
            onClose();
            handleCommit();
          }}
          onCancel={() => {
            onClose();
          }}
        >
          <p>Commit updated models to the database?</p>
        </UnsavedChangesModal>
      </DispatchProvider>
    </MapProvider>
  );
}
