'use client';

import {
  StringMap,
  StringMapReducer
} from '../../../contexts/string-map-context/string-map-reducer';
import React, { PropsWithChildren, useReducer } from 'react';
import { WorkProjectSeriesSchemaDto } from '../../../api/dtos/WorkProjectSeriesSchemaDtoSchema';
import {
  CurriculumModelsContext,
  CurriculumModelsContextDispatch
} from './use-curriculum-model-context';
import { useSelectiveContextControllerBoolean } from '../../../selective-context/components/typed/selective-context-manager-boolean';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';

import { getPayloadArray } from '../use-editing-context-dependency';
import { useSelectiveContextControllerStringList } from '../../../selective-context/components/typed/selective-context-manager-string-list';
import {
  ConfirmActionModal,
  useModal
} from '../../../generic/components/modals/confirm-action-modal';
import {
  deleteIdList,
  putList
} from '../../../api/READ-ONLY-generated-actions/WorkProjectSeriesSchema';

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

  const { show, openModal, onClose } = useModal();
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
        setUnsaved({
          contextKey: UnsavedCurriculumModelChanges,
          update: false
        });
      }
    };

    if (deletedModelsIdList.length > 0) {
      deleteIdList(deletedModelsIdList)
        .then((r) => {
          if (r.status == 200) {
            dispatchDeletedModelIdList({
              contextKey: DeletedCurriculumModelIdsKey,
              update: EmptyIdArray
            });
            successDelete = true;
          } else {
            console.log('Not implemented:', r.message);
          }
        })
        .finally(clearFlag);
    }
    const workProjectSeriesSchemaDtosCurrent = Object.values(currentModels);
    putList(workProjectSeriesSchemaDtosCurrent)
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
    onClose();
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
          show={show}
          onClose={onClose}
          onConfirm={handleCommit}
          onCancel={onClose}
        >
          <p>Commit updated models to the database?</p>
        </ConfirmActionModal>
      </CurriculumModelsContextDispatch.Provider>
    </CurriculumModelsContext.Provider>
  );
}
