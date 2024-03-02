'use client';
import { Card, Flex, Text, Title } from '@tremor/react';
import { WorkProjectSeriesSchemaDto } from '../api/dtos/WorkProjectSeriesSchemaDtoSchema';
import { DeliveryAllocationDto } from '../api/dtos/DeliveryAllocationDtoSchema';
import React, { Fragment, useMemo, useState } from 'react';
import { Tab } from '@headlessui/react';
import LandscapeStepper from '../components/landscape-stepper';
import { StepperContext } from '../components/stepper/stepper-context-creator';
import { TabStyled } from '../components/tab-layouts/tab-styled';
import { TabPanelStyled } from '../components/tab-layouts/tab-panel-styled';
import { useCurriculumModelContext } from './contexts/use-curriculum-model-context';
import { sumDeliveryAllocations } from '../graphing/components/curriculum-delivery-details';
import { UnsavedCurriculumModelChanges } from './contexts/curriculum-models-context-provider';
import {
  useSelectiveContextControllerBoolean,
  useSelectiveContextDispatchBoolean,
  useSelectiveContextListenerBoolean
} from '../components/selective-context/selective-context-manager-boolean';

const allocationSizes = [1, 2];

export function CurriculumDeliveryModel({
  model
}: {
  model: WorkProjectSeriesSchemaDto;
}) {
  const { workTaskType } = model;
  const workTaskTypeName = workTaskType.name;
  const lastColon = workTaskTypeName.lastIndexOf(':');
  const name = workTaskTypeName.substring(lastColon + 1);

  return (
    <Card className={'overflow-x-auto p-4'}>
      <Tab.Group>
        <div className={'grid grid-cols-4 mb-2 items-center'}>
          <Title className={'text-left grow col-span-2'}>{name}</Title>
          <Tab.List className={'grid col-span-2 grow grid-cols-2'}>
            <TabStyled>Allocations</TabStyled>
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

  const { currentState: unsavedChanges, dispatchWithoutControl: setUnsaved } =
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
    <>
      <Flex
        justifyContent="start"
        alignItems="baseline"
        className="space-x-2 p-2"
      >
        {currentAllocations.map((deliveryAllocation, index) => (
          <div key={`del-al-${index}`}>
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
              <LandscapeStepper></LandscapeStepper>
              <DeliveryAllocation
                key={deliveryAllocation.id}
                deliveryAllocation={deliveryAllocation}
              />
            </StepperContext.Provider>
          </div>
        ))}
      </Flex>
      <Text className={'px-2 pb-2'}>Total: {totalAllocations}</Text>
    </>
  );
}

function DeliveryAllocation({
  deliveryAllocation: { deliveryAllocationSize, count }
}: {
  deliveryAllocation: DeliveryAllocationDto;
}) {
  const allocation: React.JSX.Element[] = [];
  for (let i = 0; i < count; i++) {
    const units: React.JSX.Element[] = [];
    for (let j = 0; j < deliveryAllocationSize; j++) {
      allocation.push(<AllocationUnit key={`unit-${j}-${i}`}></AllocationUnit>);
    }
    allocation.push(
      <div key={`allocation-${i}`} className={'flex m-0 p-0.5'}>
        {[...units]}
      </div>
    );
  }

  return <div className={'flex'}>{[...allocation]}</div>;
}

function AllocationUnit() {
  return (
    <div
      className={
        'w-4 h-4 bg-blue-400 border-blue-600 border-2 rounded-md m-0 p-0'
      }
    ></div>
  );
}
