'use client';
import { Button } from '@nextui-org/button';
import { Card } from '@nextui-org/card';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import React, { useMemo, useState } from 'react';

import { NameIdStringTuple } from '../../api/dtos/NameIdStringTupleSchema';
import { StringMap } from '../../contexts/string-map-context/string-map-reducer';
import { WorkTaskTypeDto } from '../../api/dtos/WorkTaskTypeDtoSchema';
import { WorkProjectSeriesSchemaDto } from '../../api/dtos/WorkProjectSeriesSchemaDtoSchema';
import { useRouter } from 'next/navigation';
import {
  getStepperInterface,
  StepperContext
} from '../../contexts/stepper/stepper-context-creator';
import LandscapeStepper from '../../generic/components/buttons/landscape-stepper';
import { AccessorFunction } from '../../generic/components/tables/rating/rating-table';
import {
  ConfirmActionModal,
  useModal
} from '../../generic/components/modals/confirm-action-modal';
import TupleSelector from '../../generic/components/dropdown/tuple-selector';
import { EmptyArray, isNotNull, isNotUndefined } from '../../api/main';
import { postOne } from '../../api/READ-ONLY-generated-actions/WorkProjectSeriesSchema';
import { AdjustAllocation } from './adjust-allocation';
import { useSelectiveContextListenerReadAll } from '../../selective-context/components/base/generic-selective-context-creator';
import { SelectiveContextGlobal } from '../../selective-context/components/global/selective-context-creator-global';
import { useSelectiveContextGlobalListener } from '../../selective-context/components/global/selective-context-manager-global';
import { getIdListContextKey } from '../../selective-context/components/controllers/dto-id-list-controller';
import { getEntityNamespaceContextKey } from '../../selective-context/hooks/dtoStores/use-dto-store';
import { parseTen } from '../../api/date-and-time';

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

const UnsavedModel: WorkProjectSeriesSchemaDto = {
  id: '',
  workTaskTypeId: NaN,
  workProjectBandwidth: 1,
  name: 'New model',
  userToProviderRatio: 30,
  deliveryAllocations: [],
  shortCode: ''
};

export function AddNewCurriculumModelCard({
  yearGroup
}: {
  alreadyUnsaved: boolean;
  yearGroup: number;
}) {
  const { show, onClose, openModal } = useModal();
  const selectiveContextReadAll =
    useSelectiveContextListenerReadAll<WorkTaskTypeDto>(SelectiveContextGlobal);
  const { currentState: workTaskTypeIdList } =
    useSelectiveContextGlobalListener({
      contextKey: getIdListContextKey('workTaskType'),
      listenerKey: 'addCurriculumModel',
      initialValue: EmptyArray
    });

  const [newModelTaskType, setNewModelTaskType] =
    useState<NameIdStringTuple | null>(null);

  const appRouterInstance = useRouter();
  const [teacherBandwidth, setTeacherBandwidth] = useState(1);
  const [studentToTeacherRatio, setStudentToTeacherRatio] = useState(30);
  const [unSavedModel, setUnsavedModel] = useState(UnsavedModel);

  const taskTypeSelectionList = useMemo(() => {
    const tupleList = workTaskTypeIdList
      .map((id) =>
        selectiveContextReadAll(
          getEntityNamespaceContextKey('workTaskType', id)
        )
      )
      .filter(isNotUndefined)
      .filter(
        (workTaskType) => workTaskType?.knowledgeLevelLevelOrdinal === yearGroup
      )
      .map((wtt) => ({ id: `${wtt.id}`, name: wtt.name }));
    tupleList.sort((t1, t2) => t1.name.localeCompare(t2.name));
    return tupleList;
  }, [selectiveContextReadAll, workTaskTypeIdList, yearGroup]);

  const handleOpen = () => {
    setUnsavedModel((model) => ({ ...model, id: crypto.randomUUID() }));

    openModal();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleAddNewModel = () => {
    if (!isNotNull(newModelTaskType)) return;
    const modelToPost: WorkProjectSeriesSchemaDto = {
      ...unSavedModel,
      workTaskTypeId: parseTen(newModelTaskType.id)
    };
    postOne(modelToPost).then((r) => appRouterInstance.refresh());

    onClose();
  };

  return (
    <>
      <Card className={'p-4'}>
        <Button
          className={' w-full h-full '}
          variant={'ghost'}
          color={'primary'}
          onPress={handleOpen}
        >
          Add New Model <PlusCircleIcon className={'w-8 h-8'}></PlusCircleIcon>
        </Button>
      </Card>
      <ConfirmActionModal
        show={show}
        onClose={onClose}
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
          <AdjustAllocation
            entity={unSavedModel}
            entityClass={'workProjectSeriesSchema'}
            deleted={false}
            dispatchWithoutControl={setUnsavedModel}
          ></AdjustAllocation>
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
