'use client';
import { Flex, Text } from '@tremor/react';
import { Card, CardBody } from '@nextui-org/card';
import { WorkProjectSeriesSchemaDto } from '../../api/dtos/WorkProjectSeriesSchemaDtoSchema';
import { DeliveryAllocationDto } from '../../api/dtos/DeliveryAllocationDtoSchema';
import React, { useMemo } from 'react';
import { Tab } from '@headlessui/react';
import LandscapeStepper from '../../generic/components/buttons/landscape-stepper';
import { StepperContext } from '../../contexts/stepper/stepper-context-creator';

import { useCurriculumModelContext } from './contexts/use-curriculum-model-context';
import { UnsavedCurriculumModelChanges } from './contexts/curriculum-models-context-provider';
import { useSelectiveContextDispatchBoolean } from '../../selective-context/components/typed/selective-context-manager-boolean';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { sumDeliveryAllocations } from './functions/sum-delivery-allocations';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/20/solid';

import { useRenameCurriculumDeliveryModel } from './use-rename-curriculum-delivery-model';
import { useDeleteCurriculumDeliveryModel } from './use-delete-curriculum-delivery-model';
import { DeletedOverlay } from '../../generic/components/overlays/deleted-overlay';
import { TwoStageClick } from '../../generic/components/buttons/two-stage-click';
import { TabStyled } from '../../generic/components/tab-layouts/tab-styled';
import { TabPanelStyled } from '../../generic/components/tab-layouts/tab-panel-styled';
import RenameModal from '../../generic/components/modals/rename-modal';
import { Button } from '@nextui-org/button';

const allocationSizes = [1, 2];

const CurriculumDeliveryModelCardKey = 'model-card';

export function CurriculumDeliveryModel({
  model
}: {
  model: WorkProjectSeriesSchemaDto;
}) {
  const listenerKey = `${CurriculumDeliveryModelCardKey}:${model.id}`;
  const { handleDelete, currentState, handleUnDelete } =
    useDeleteCurriculumDeliveryModel(model.id, listenerKey);

  const { openModal, renameModalProps } = useRenameCurriculumDeliveryModel(
    model.id,
    listenerKey
  );

  return (
    <Card className={'overflow-x-auto p-0'}>
      <CardBody>
        <DeletedOverlay
          show={currentState.includes(model.id)}
          handleUnDelete={handleUnDelete}
        />
        <Tab.Group>
          <div className={'grid grid-cols-4 mb-2 items-center gap-0.5'}>
            <div className={'col-span-2 flex items-center gap-1'}>
              <TwoStageClick
                standardAppearance={'light'}
                onPress={handleDelete}
                isIconOnly
              >
                {' '}
                <TrashIcon className={'h-4 w-4'}></TrashIcon>
              </TwoStageClick>
              <Button
                className={'w-3/4 flex overflow-hidden flex-nowrap'}
                onPress={openModal}
                size={'sm'}
                variant={'light'}
              >
                <span className={'truncate ... w-3/4'}>{model.name}</span>
                <PencilSquareIcon className={'h-4 w-4 grow'}></PencilSquareIcon>
              </Button>
            </div>
            <Tab.List className={'grid col-span-2 grow grid-cols-2'}>
              <TabStyled>Periods</TabStyled>
              <TabStyled>Details</TabStyled>
            </Tab.List>
          </div>

          <TabPanelStyled>
            <AdjustAllocation modelId={model.id}></AdjustAllocation>
          </TabPanelStyled>
          <TabPanelStyled>
            <Text>{model.workTaskType.knowledgeDomainName}</Text>
            <Text className="text-right">
              {model.workTaskType.serviceCategoryKnowledgeDomainDescriptor}
            </Text>
          </TabPanelStyled>
        </Tab.Group>
        <RenameModal {...renameModalProps} />
      </CardBody>
    </Card>
  );
}

export function AdjustAllocation({
  // receivedAllocations,
  modelId
}: {
  // receivedAllocations: DeliveryAllocationDto[];
  modelId: string;
}) {
  const { curriculumModelsMap, dispatch } = useCurriculumModelContext();
  const unsavedChangesListenerId = useMemo(() => {
    return `${UnsavedCurriculumModelChanges}:${modelId}`;
  }, [modelId]);
  const workProjectSeriesSchemaDto = curriculumModelsMap[modelId];
  const currentAllocations = useMemo(() => {
    return allocationSizes.map((size: number) => {
      const found = workProjectSeriesSchemaDto?.deliveryAllocations.find(
        (da) => da.deliveryAllocationSize === size
      );
      return found || { id: NaN, count: 0, deliveryAllocationSize: size };
    });
  }, [workProjectSeriesSchemaDto]);

  const totalAllocations = useMemo(
    () => sumDeliveryAllocations(workProjectSeriesSchemaDto),
    [workProjectSeriesSchemaDto]
  );

  const { dispatchWithoutControl: setUnsaved } =
    useSelectiveContextDispatchBoolean(
      UnsavedCurriculumModelChanges,
      unsavedChangesListenerId,
      false
    );

  const handleModifyAllocation = (size: number, up: boolean) => {
    const updatedDevAlloc = currentAllocations.map((allocation) => {
      if (allocation.deliveryAllocationSize === size) {
        const newCount = up
          ? Math.min(allocation.count + 1, 10)
          : Math.max(allocation.count - 1, 0);
        return { ...allocation, count: newCount };
      } else return allocation;
    });
    const updatedSchema: WorkProjectSeriesSchemaDto = {
      ...workProjectSeriesSchemaDto,
      deliveryAllocations: updatedDevAlloc
    };
    dispatch({
      type: 'update',
      payload: { key: modelId, data: updatedSchema }
    });

    setUnsaved(true);
  };

  return (
    <div>
      <Text className={'px-2'}>Total Allocation: {totalAllocations}</Text>
      <Flex
        justifyContent="start"
        alignItems="baseline"
        className=" py-2 divide-x"
      >
        {currentAllocations.map((deliveryAllocation, index) => (
          <div key={`del-al-${index}`} className={'px-1'}>
            <StepperContext.Provider
              value={{
                increment: () =>
                  handleModifyAllocation(
                    deliveryAllocation.deliveryAllocationSize,
                    true
                  ),
                decrement: () =>
                  handleModifyAllocation(
                    deliveryAllocation.deliveryAllocationSize,
                    false
                  ),
                min: 0,
                max: 10,
                current: currentAllocations[index].count
              }}
            >
              <div className={'flex items-center'}>
                <AllocationUnitGroup
                  size={deliveryAllocation.deliveryAllocationSize}
                  indexOfGroup={index}
                />
                <LandscapeStepper></LandscapeStepper>
              </div>
              <div className={'h-1'}></div>
              <DeliveryAllocation
                key={deliveryAllocation.id}
                deliveryAllocation={deliveryAllocation}
              />
            </StepperContext.Provider>
          </div>
        ))}
      </Flex>
    </div>
  );
}

function DeliveryAllocation({
  deliveryAllocation: { deliveryAllocationSize, count }
}: {
  deliveryAllocation: DeliveryAllocationDto;
}) {
  const allocation: React.JSX.Element[] = [];
  for (let i = 0; i < count; i++) {
    allocation.push(
      <AllocationUnitGroup
        key={`unit-${i}`}
        size={deliveryAllocationSize}
        indexOfGroup={i}
      />
    );
  }

  return (
    <div className={'flex h-4 '}>
      {allocation.length > 0 ? (
        [...allocation]
      ) : (
        <XMarkIcon className={'h-4 w-4'}></XMarkIcon>
      )}
    </div>
  );
}

function AllocationUnitGroup({
  size,
  indexOfGroup
}: {
  size: number;
  indexOfGroup: number;
}) {
  const units: React.JSX.Element[] = [];
  for (let i = 0; i < size; i++) {
    units.push(<AllocationUnit key={`unit-${indexOfGroup}-${i}`} />);
  }
  return <div className={'flex m-0 p-0.5'}>{...units}</div>;
}

export function AllocationUnit() {
  return (
    <div
      className={
        'w-4 h-4 bg-blue-400 border-blue-600 border-2 rounded-md m-0 p-0'
      }
    ></div>
  );
}
