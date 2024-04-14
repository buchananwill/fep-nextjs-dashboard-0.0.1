'use client';
import {
  StringMap,
  StringMapReducer
} from '../../../contexts/string-map-context/string-map-reducer';
import React, { PropsWithChildren, useReducer } from 'react';
import { useSelectiveContextControllerBoolean } from '../../../selective-context/components/typed/selective-context-manager-boolean';
import {
  WorkTaskTypeContext,
  WorkTaskTypeContextDispatch
} from './use-work-task-type-context';
import { WorkTaskTypeDto } from '../../../api/dtos/WorkTaskTypeDtoSchema';

import { getPayloadArray } from '../get-payload-array';
import { UnsavedChangesModal } from '../../../generic/components/modals/unsaved-changes-modal';
import { useSyncStringMapToProps } from '../../../contexts/string-map-context/use-sync-string-map-to-props';
import { IdStringFromNumberAccessor } from '../../../premises/classroom-suitability/rating-table-accessor-functions';
import { putList } from '../../../api/READ-ONLY-generated-actions/WorkTaskType';

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
  // const [currentModels, dispatch] = useStringMapReducer<WorkTaskTypeDto>(entityMap);
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

  useSyncStringMapToProps(
    entityMap,
    dispatch,
    currentModels,
    IdStringFromNumberAccessor
  );

  const handleClose = () => {
    dispatchUpdate({ contextKey: workTaskTypeCommitKey, update: false });
  };
  const openModal = () =>
    dispatchUpdate({ contextKey: workTaskTypeCommitKey, update: true });

  async function handleCommit() {
    const workTaskTypeDtos = Object.values(
      currentModels as StringMap<WorkTaskTypeDto>
    );
    putList(workTaskTypeDtos).then((r) => {
      if (r.data) {
        const schemas = getPayloadArray(r.data, (r) => r.id.toString());
        dispatch({ type: 'updateAll', payload: schemas });
        setUnsaved({ contextKey: UnsavedWorkTaskTypeChanges, update: false });
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
