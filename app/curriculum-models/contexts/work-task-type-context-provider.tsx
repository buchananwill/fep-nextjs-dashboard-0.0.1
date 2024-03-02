'use client';

import { StringMap, StringMapReducer } from './string-map-context-creator';
import React, { PropsWithChildren, useReducer } from 'react';
import { WorkProjectSeriesSchemaDto } from '../../api/dtos/WorkProjectSeriesSchemaDtoSchema';

import { ConfirmationModal } from '../../components/confirmation-modal';
import { putModels } from '../../api/actions/curriculum-delivery-model';
import { useSelectiveContextControllerBoolean } from '../../components/selective-context/selective-context-manager-boolean';
import { getPayloadArray } from '../[yearGroup]/bundles/curriculum-delivery-models';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import {
  WorkTaskTypeContext,
  WorkTaskTypeContextDispatch
} from './use-work-task-type-context';
import { WorkTaskTypeDto } from '../../api/dtos/WorkTaskTypeDtoSchema';
import { putWorkTaskTypes } from '../../api/actions/work-task-types';

export const UnsavedWorkTaskTypeChanges = 'unsaved-workTaskType-changes';
export const WorkTaskTypeChangesProviderListener =
  'unsaved-workTaskType-changes:provider';

export const workTaskTypeCommitKey = 'commit-model-changes-open';

export function WorkTaskTypeContextProvider({
  models,
  children
}: { models: StringMap<WorkTaskTypeDto> } & PropsWithChildren) {
  const WorkTaskTypeReducer = StringMapReducer<WorkTaskTypeDto>;
  const [currentModels, dispatch] = useReducer(WorkTaskTypeReducer, models);
  const { currentState: modalOpen, dispatchUpdate } =
    useSelectiveContextControllerBoolean(
      workTaskTypeCommitKey,
      workTaskTypeCommitKey,
      false
    );
  const { currentState: unsavedChanges, dispatchUpdate: setUnsaved } =
    useSelectiveContextControllerBoolean(
      UnsavedWorkTaskTypeChanges,
      WorkTaskTypeChangesProviderListener,
      false
    );

  const handleClose = () => {
    dispatchUpdate({ contextKey: workTaskTypeCommitKey, value: false });
  };
  const openModal = () =>
    dispatchUpdate({ contextKey: workTaskTypeCommitKey, value: true });

  async function handleCommit() {
    const workTaskTypeDtos = Object.values(
      currentModels as StringMap<WorkTaskTypeDto>
    );
    putWorkTaskTypes(workTaskTypeDtos).then((r) => {
      if (r.data) {
        const schemas = getPayloadArray((r) => r.id.toString(), r.data);
        dispatch({ type: 'updateAll', payload: schemas });
        setUnsaved({ contextKey: UnsavedWorkTaskTypeChanges, value: false });
      }
    });
  }

  return (
    <WorkTaskTypeContext.Provider value={currentModels}>
      <WorkTaskTypeContextDispatch.Provider value={dispatch}>
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
        <ConfirmationModal
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
        </ConfirmationModal>
      </WorkTaskTypeContextDispatch.Provider>
    </WorkTaskTypeContext.Provider>
  );
}
