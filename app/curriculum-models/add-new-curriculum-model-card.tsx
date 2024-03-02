'use client';
import { Card } from '@tremor/react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import React, { useMemo, useState } from 'react';
import { ConfirmationModal, useModal } from '../components/confirmation-modal';
import { useWorkTaskTypeContext } from './contexts/use-work-task-type-context';
import { Listbox } from '@headlessui/react';
import StringTupleSelector from '../components/string-tuple-selector';
import { NameIdStringTuple } from '../api/dtos/NameIdStringTupleSchema';
import { StringMap } from './contexts/string-map-context-creator';
import { useCurriculumModelContext } from './contexts/use-curriculum-model-context';
import { randomUUID } from 'node:crypto';
import { AdjustAllocation } from './curriculum-delivery-model';
import { WorkTaskTypeDto } from '../api/dtos/WorkTaskTypeDtoSchema';
import { WorkProjectSeriesSchemaDto } from '../api/dtos/WorkProjectSeriesSchemaDtoSchema';
import {
  useSelectiveContextControllerBoolean,
  useSelectiveContextDispatchBoolean
} from '../components/selective-context/selective-context-manager-boolean';
import { UnsavedCurriculumModelChanges } from './contexts/curriculum-models-context-provider';

const noTaskType: NameIdStringTuple = { name: 'No Type Selected', id: 'n/a' };

export function stringMapToIdNameTuple<T>(
  nameAccessor: (item: T) => string,
  map: StringMap<T>
) {
  return Object.entries(map).map((entry) => ({
    id: entry[0],
    name: nameAccessor(entry[1])
  }));
}

export function AddNewCurriculumModelCard({
  alreadyUnsaved
}: {
  alreadyUnsaved: boolean;
}) {
  const { isOpen, closeModal, openModal } = useModal();
  const { workTaskTypeMap } = useWorkTaskTypeContext();
  const { dispatch, curriculumModelsMap } = useCurriculumModelContext();
  const [newModelTaskType, setNewModelTaskType] = useState(noTaskType);
  const [nextModelId, setNextModelId] = useState(crypto.randomUUID());
  const [revertUnsaved, setRevertUnsaved] = useState(true);

  const { currentState, dispatchWithoutControl } =
    useSelectiveContextDispatchBoolean(
      UnsavedCurriculumModelChanges,
      ':add-new-model',
      alreadyUnsaved
    );

  const taskTypeSelectionList = useMemo(() => {
    return stringMapToIdNameTuple((type) => type.name, workTaskTypeMap);
  }, [workTaskTypeMap]);

  const handleOpen = () => {
    if (currentState) setRevertUnsaved(false);

    openModal();
  };

  const handleCancel = () => {
    console.log('handling cancel');
    dispatch({
      type: 'delete',
      payload: { key: nextModelId, data: {} as WorkProjectSeriesSchemaDto }
    });
    if (revertUnsaved) {
      dispatchWithoutControl(false);
    }
    setNextModelId(crypto.randomUUID());
    setNewModelTaskType(
      taskTypeSelectionList.length > 0 ? taskTypeSelectionList[0] : noTaskType
    );
    closeModal();
  };

  const handleAddNewModel = () => {
    // console.log('Next new model: ', curriculumModelsMap[nextModelId]);
    closeModal();
  };

  return (
    <>
      <Card className={'p-4'}>
        <button
          className={'btn btn-primary w-full h-full btn-outline'}
          onClick={handleOpen}
        >
          Add New Model <PlusCircleIcon className={'w-8 h-8'}></PlusCircleIcon>
        </button>
      </Card>
      <ConfirmationModal
        show={isOpen}
        onClose={closeModal}
        onConfirm={handleAddNewModel}
        onCancel={handleCancel}
      >
        <div className={'h-60'}>
          <StringTupleSelector
            selectedState={newModelTaskType}
            selectionList={taskTypeSelectionList}
            updateSelectedState={setNewModelTaskType}
            selectionDescriptor={'Select Type'}
          ></StringTupleSelector>
          <AdjustAllocation modelId={nextModelId}></AdjustAllocation>
        </div>
      </ConfirmationModal>
    </>
  );
}
