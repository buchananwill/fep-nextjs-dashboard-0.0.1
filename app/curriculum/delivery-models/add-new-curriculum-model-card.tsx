'use client';
import { Card } from '@tremor/react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import React, { useMemo, useState } from 'react';

import { useWorkTaskTypeContext } from './contexts/use-work-task-type-context';

import { NameIdStringTuple } from '../../api/dtos/NameIdStringTupleSchema';
import { StringMap } from '../../contexts/string-map-context/string-map-reducer';
import { useCurriculumModelContext } from './contexts/use-curriculum-model-context';
import { AdjustAllocation } from './curriculum-delivery-model';
import { WorkTaskTypeDto } from '../../api/dtos/WorkTaskTypeDtoSchema';
import { WorkProjectSeriesSchemaDto } from '../../api/dtos/WorkProjectSeriesSchemaDtoSchema';
import { useSelectiveContextDispatchBoolean } from '../../generic/components/selective-context/selective-context-manager-boolean';
import { UnsavedCurriculumModelChanges } from './contexts/curriculum-models-context-provider';
import { useRouter } from 'next/navigation';
import { postModels } from '../../api/actions/curriculum-delivery-model';
import {
  getStepperInterface,
  StepperContext
} from '../../contexts/stepper/stepper-context-creator';
import LandscapeStepper from '../../generic/components/buttons/landscape-stepper';

import { getPayloadArray } from './use-editing-context-dependency';
import { AccessorFunction } from '../../generic/components/tables/rating/rating-table';
import {
  ConfirmActionModal,
  useModal
} from '../../generic/components/modals/confirm-action-modal';
import TupleSelector from '../../generic/components/dropdown/tuple-selector';

const noTaskType: NameIdStringTuple = { name: 'No Type Selected', id: 'n/a' };

export interface NameAccessor<T> extends AccessorFunction<T, string> {
  (object: T): string;
}

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
  alreadyUnsaved,
  yearGroup
}: {
  alreadyUnsaved: boolean;
  yearGroup: number;
}) {
  const { isOpen, closeModal, openModal } = useModal();
  const { workTaskTypeMap } = useWorkTaskTypeContext();
  const { dispatch, curriculumModelsMap } = useCurriculumModelContext();
  const [newModelTaskType, setNewModelTaskType] = useState(noTaskType);
  const [nextModelId, setNextModelId] = useState(crypto.randomUUID());
  const [revertUnsaved, setRevertUnsaved] = useState(true);
  const appRouterInstance = useRouter();
  const [teacherBandwidth, setTeacherBandwidth] = useState(1);

  const [studentToTeacherRatio, setStudentToTeacherRatio] = useState(30);

  const { currentState, dispatchWithoutControl } =
    useSelectiveContextDispatchBoolean(
      UnsavedCurriculumModelChanges,
      ':add-new-model',
      alreadyUnsaved
    );

  const taskTypeSelectionList = useMemo(() => {
    const filteredTaskTypes: StringMap<WorkTaskTypeDto> = {};
    Object.entries(workTaskTypeMap)
      .filter((entry) => entry[1].knowledgeLevelLevelOrdinal === yearGroup)
      .forEach((entry) => (filteredTaskTypes[entry[0]] = entry[1]));
    const tupleList = stringMapToIdNameTuple(
      (type) => type.name,
      filteredTaskTypes
    );
    tupleList.sort((t1, t2) => t1.name.localeCompare(t2.name));
    return tupleList;
  }, [workTaskTypeMap, yearGroup]);

  const handleOpen = () => {
    if (currentState) setRevertUnsaved(false);

    openModal();
  };

  const handleCancel = () => {
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
    const unsavedModel: WorkProjectSeriesSchemaDto = {
      ...curriculumModelsMap[nextModelId],
      id: nextModelId,
      workTaskType: workTaskTypeMap[newModelTaskType.id],
      workProjectBandwidth: 1,
      name: 'New model',
      userToProviderRatio: 30
    };

    postModels([unsavedModel]).then((r) => {
      if (r.data !== undefined) {
        const payloadArray = getPayloadArray(r.data, (schema) => schema.id);
        dispatch({ type: 'updateAll', payload: payloadArray });
      }
    });
    dispatchWithoutControl(false);
    setRevertUnsaved(true);
    closeModal();
    appRouterInstance.refresh();
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
      <ConfirmActionModal
        show={isOpen}
        onClose={closeModal}
        onConfirm={handleAddNewModel}
        onCancel={handleCancel}
        title={'Add New Curriculum Model'}
      >
        <div className={'h-60 flex flex-col gap-2 divide-y'}>
          <TupleSelector
            selectedState={newModelTaskType}
            selectionList={taskTypeSelectionList}
            updateSelectedState={setNewModelTaskType}
            selectionDescriptor={'Select Type'}
          ></TupleSelector>
          <AdjustAllocation modelId={nextModelId}></AdjustAllocation>
          <div className={'w-full pt-2 items-center gap-1 grid-cols-2 grid'}>
            Teacher bandwidth:{' '}
            <StepperContext.Provider
              value={getStepperInterface(
                setTeacherBandwidth,
                8,
                1,
                teacherBandwidth
              )}
            >
              <LandscapeStepper />
            </StepperContext.Provider>
          </div>
          <div className={'grid grid-cols-2 w-full pt-2 gap-1'}>
            Student-to-Teacher Ratio:{' '}
            <StepperContext.Provider
              value={getStepperInterface(
                setStudentToTeacherRatio,
                200,
                1,
                studentToTeacherRatio
              )}
            >
              {' '}
              <LandscapeStepper />
            </StepperContext.Provider>
          </div>
        </div>
      </ConfirmActionModal>
    </>
  );
}
