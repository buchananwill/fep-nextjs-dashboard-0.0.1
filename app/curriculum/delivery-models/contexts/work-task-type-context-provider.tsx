'use client';
import { StringMap, StringMapReducer } from './string-map-context-creator';
import React, { PropsWithChildren, useReducer } from 'react';
import { useSelectiveContextControllerBoolean } from '../../../generic/components/selective-context/selective-context-manager-boolean';
import {
  WorkTaskTypeContext,
  WorkTaskTypeContextDispatch
} from './use-work-task-type-context';
import { WorkTaskTypeDto } from '../../../api/dtos/WorkTaskTypeDtoSchema';
import { putWorkTaskTypes } from '../../../api/actions/work-task-types';
import { UnsavedChangesModal } from '../../../components/modals/unsaved-changes-modal';

import { getPayloadArray } from '../use-editing-context-dependency';

export const UnsavedWorkTaskTypeChanges = 'unsaved-workTaskType-changes';
export const WorkTaskTypeChangesProviderListener =
  'unsaved-workTaskType-changes:provider';

export const workTaskTypeCommitKey = 'commit-model-changes-open';

export function WorkTaskTypeContextProvider({
  entityMap,
  children
}: { entityMap: StringMap<WorkTaskTypeDto> } & PropsWithChildren) {
  const WorkTaskTypeReducer = StringMapReducer<WorkTaskTypeDto>;
  const [currentModels, dispatch] = useReducer(WorkTaskTypeReducer, entityMap);
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
        const schemas = getPayloadArray(r.data, (r) => r.id.toString());
        dispatch({ type: 'updateAll', payload: schemas });
        setUnsaved({ contextKey: UnsavedWorkTaskTypeChanges, value: false });
      }
    });
  }

  return (
    <WorkTaskTypeContext.Provider value={currentModels}>
      <WorkTaskTypeContextDispatch.Provider value={dispatch}>
        {children}
        <UnsavedChangesModal
          unsavedChanges={unsavedChanges}
          handleOpen={() => openModal()}
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
        </UnsavedChangesModal>
      </WorkTaskTypeContextDispatch.Provider>
    </WorkTaskTypeContext.Provider>
  );
}
