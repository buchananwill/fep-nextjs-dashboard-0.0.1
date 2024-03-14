'use client';

import { StringMap, StringMapReducer } from './string-map-context-creator';
import React, { PropsWithChildren, useReducer } from 'react';
import { WorkProjectSeriesSchemaDto } from '../../../api/dtos/WorkProjectSeriesSchemaDtoSchema';
import {
  CurriculumModelsContext,
  CurriculumModelsContextDispatch
} from './use-curriculum-model-context';
import { ConfirmActionModal } from '../../../components/confirm-action-modal';
import { putModels } from '../../../api/actions/curriculum-delivery-model';
import {
  useSelectiveContextControllerBoolean,
  useSelectiveContextListenerBoolean
} from '../../../components/selective-context/selective-context-manager-boolean';
import { curriculumDeliveryCommitKey } from '../curriculum-delivery-models';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import { getPayloadArray } from '../use-curriculum-delivery-model-editing';

export const UnsavedCurriculumModelChanges = 'unsaved-model-changes';
export const ModelChangesProviderListener = 'unsaved-model-changes:provider';

export function CurriculumModelsContextProvider({
  models,
  children
}: { models: StringMap<WorkProjectSeriesSchemaDto> } & PropsWithChildren) {
  const CurriculumModelsReducer = StringMapReducer<WorkProjectSeriesSchemaDto>;
  const [currentModels, dispatch] = useReducer(CurriculumModelsReducer, models);
  const { currentState: modalOpen, dispatchUpdate } =
    useSelectiveContextControllerBoolean(
      curriculumDeliveryCommitKey,
      curriculumDeliveryCommitKey,
      false
    );
  const { currentState: unsavedChanges, dispatchUpdate: setUnsaved } =
    useSelectiveContextControllerBoolean(
      UnsavedCurriculumModelChanges,
      ModelChangesProviderListener,
      false
    );

  // console.log(
  //   'Re-rendering model changes provider, with unsaved changes?: ',
  //   unsavedChanges
  // );

  const handleClose = () => {
    dispatchUpdate({ contextKey: curriculumDeliveryCommitKey, value: false });
  };
  const openModal = () =>
    dispatchUpdate({ contextKey: curriculumDeliveryCommitKey, value: true });

  async function handleCommit() {
    const workProjectSeriesSchemaDtosCurrent = Object.values(currentModels);
    putModels(workProjectSeriesSchemaDtosCurrent).then((r) => {
      if (r.data) {
        const schemas = getPayloadArray(r.data, (schema) => schema.id);
        dispatch({ type: 'updateAll', payload: schemas });
        setUnsaved({ contextKey: UnsavedCurriculumModelChanges, value: false });
      }
    });
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
            onClick={() => openModal()}
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
          show={modalOpen}
          onClose={handleClose}
          onConfirm={() => {
            handleClose();
            handleCommit();
          }}
          onCancel={() => {
            handleClose();
          }}
        >
          <p>Commit updated models to the database?</p>
        </ConfirmActionModal>
      </CurriculumModelsContextDispatch.Provider>
    </CurriculumModelsContext.Provider>
  );
}
