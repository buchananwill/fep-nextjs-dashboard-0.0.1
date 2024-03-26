'use client';

import { StringMap, StringMapReducer } from './string-map-context-creator';
import React, { PropsWithChildren, useEffect, useReducer } from 'react';
import { WorkProjectSeriesSchemaDto } from '../../../api/dtos/WorkProjectSeriesSchemaDtoSchema';
import {
  CurriculumModelsContext,
  CurriculumModelsContextDispatch
} from './use-curriculum-model-context';

import {
  deleteCurriculumDeliveryModels,
  putModels
} from '../../../api/actions/curriculum-delivery-model';
import { useSelectiveContextControllerBoolean } from '../../../generic/components/selective-context/selective-context-manager-boolean';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';

import { getPayloadArray } from '../use-editing-context-dependency';
import { useSelectiveContextControllerStringList } from '../../../generic/components/selective-context/selective-context-manager-string-list';
import {
  ConfirmActionModal,
  useModal
} from '../../../generic/components/modals/confirm-action-modal';

export const UnsavedCurriculumModelChanges = 'unsaved-model-changes';
export const DeletedCurriculumModelIdsKey = 'deleted-curriculum-model-id-list';
export const ModelChangesProviderListener = 'unsaved-model-changes:provider';

const providerListenerKey = 'provider';

export const EmptyIdArray: string[] = [];

export function CurriculumModelsContextProvider({
  models,
  children
}: { models: StringMap<WorkProjectSeriesSchemaDto> } & PropsWithChildren) {
  const CurriculumModelsReducer = StringMapReducer<WorkProjectSeriesSchemaDto>;
  const [currentModels, dispatch] = useReducer(CurriculumModelsReducer, models);

  const { isOpen, openModal, closeModal } = useModal();
  const { currentState: unsavedChanges, dispatchUpdate: setUnsaved } =
    useSelectiveContextControllerBoolean(
      UnsavedCurriculumModelChanges,
      ModelChangesProviderListener,
      false
    );

  const {
    currentState: deletedModelsIdList,
    dispatchUpdate: dispatchDeletedModelIdList
  } = useSelectiveContextControllerStringList(
    DeletedCurriculumModelIdsKey,
    providerListenerKey,
    EmptyIdArray
  );

  async function handleCommit() {
    let successDelete = false;
    let successUpdate = false;
    const clearFlag = () => {
      if (successUpdate && successDelete) {
        setUnsaved({ contextKey: UnsavedCurriculumModelChanges, value: false });
      }
    };

    if (deletedModelsIdList.length > 0) {
      deleteCurriculumDeliveryModels(deletedModelsIdList)
        .then((r) => {
          if (r.status == 200) {
            dispatchDeletedModelIdList({
              contextKey: DeletedCurriculumModelIdsKey,
              value: EmptyIdArray
            });
            successDelete = true;
          } else {
            console.log('Not implemented:', r.message);
          }
        })
        .finally(clearFlag);
    }
    const workProjectSeriesSchemaDtosCurrent = Object.values(currentModels);
    putModels(workProjectSeriesSchemaDtosCurrent)
      .then((r) => {
        if (r.data) {
          const schemas = getPayloadArray(r.data, (schema) => schema.id);
          dispatch({ type: 'updateAll', payload: schemas });
          successUpdate = true;
        } else {
          console.log(r.message);
          successDelete = false;
        }
      })
      .finally(clearFlag);
    closeModal();
  }

  return (
    <CurriculumModelsContext.Provider value={currentModels}>
      <CurriculumModelsContextDispatch.Provider value={dispatch}>
        {children}
        {unsavedChanges && (
          <div
            className={
              'z-40 flex items-center border-gray-200 shadow-lg border-2 bg-gray-100 fixed top-16 right-16 p-2 rounded-md hover:bg-gray-50 group cursor-pointer'
            }
            onClick={() => {
              openModal();
            }}
          >
            Unsaved Ch-Ch-Changes{' '}
            <ExclamationTriangleIcon
              className={
                'p-1 h-8 w-8 text-red-500 group-hover:opacity-100 opacity-50 '
              }
            ></ExclamationTriangleIcon>
          </div>
        )}
        <ConfirmActionModal
          show={isOpen}
          onClose={closeModal}
          onConfirm={handleCommit}
          onCancel={closeModal}
        >
          <p>Commit updated models to the database?</p>
        </ConfirmActionModal>
      </CurriculumModelsContextDispatch.Provider>
    </CurriculumModelsContext.Provider>
  );
}
