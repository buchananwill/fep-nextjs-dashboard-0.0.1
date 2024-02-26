'use client';
import { Badge, Card, Flex, Text, Title } from '@tremor/react';
import { WorkProjectSeriesSchemaDto } from '../api/dtos/WorkProjectSeriesSchemaDtoSchema';
import { DeliveryAllocationDto } from '../api/dtos/DeliveryAllocationDtoSchema';
import React, { Fragment, useState } from 'react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid';
import { mode } from 'd3';
import { Tab } from '@headlessui/react';
import LandscapeStepper from '../components/landscape-stepper';
import { StepperContext } from '../components/stepper/stepper-context-creator';

const allocationSizes = [1, 2];

export function CurriculumDeliveryModel({
  model
}: {
  model: WorkProjectSeriesSchemaDto;
}) {
  const { name, deliveryAllocations: receivedAllocations } = model;

  return (
    <Card className={'overflow-x-auto p-4'}>
      <Tab.Group>
        <div className={'flex'}>
          <Title className={'mb-2 mx-4'}>
            {model.workTaskType.knowledgeDomainName}
          </Title>
          <Tab.List className={'grid grid-cols-2 grow'}>
            <TabStyled>Allocations</TabStyled>
            <TabStyled>Details</TabStyled>
          </Tab.List>
        </div>

        <TabPanelStyled>
          <AdjustAllocation
            receivedAllocations={receivedAllocations}
          ></AdjustAllocation>
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

function TabStyled({ children }: { children: string }) {
  return (
    <Tab as={Fragment}>
      {({ selected }) => (
        <button
          className={`w-full btn btn-sm btn-outline px-0 ${
            selected ? '' : 'opacity-50'
          }`}
        >
          <span className={'text-xs'}>{children}</span>
        </button>
      )}
    </Tab>
  );
}

function TabPanelStyled({ children }: { children: React.ReactNode }) {
  return (
    <Tab.Panel
      className={
        'outline-2 outline-slate-200 overflow-auto outline outline-offset-2 rounded-md'
      }
    >
      {children}
    </Tab.Panel>
  );
}

function AdjustAllocation({
  receivedAllocations
}: {
  receivedAllocations: DeliveryAllocationDto[];
}) {
  const startingAllocations = allocationSizes.map((size: number) => {
    const found = receivedAllocations.find(
      (da) => da.deliveryAllocationSize === size
    );
    return found || { id: NaN, count: 0, deliveryAllocationSize: size };
  });

  const [deliveryAllocations, setDeliveryAllocations] =
    useState(startingAllocations);

  const handleModifyAllocation = (size: number, up: boolean) => {
    const updatedDevAlloc = deliveryAllocations.map((allocation) => {
      if (allocation.deliveryAllocationSize === size) {
        const newCount = up
          ? Math.min(allocation.count + 1, 10)
          : Math.max(allocation.count - 1, 0);
        return { ...allocation, count: newCount };
      } else return allocation;
    });
    setDeliveryAllocations(updatedDevAlloc);
  };

  return (
    <>
      <Flex
        justifyContent="start"
        alignItems="baseline"
        className="space-x-2 p-2"
      >
        {deliveryAllocations.map((deliveryAllocation, index) => (
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
                current: deliveryAllocations[index].count
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
      <Text className={'px-2 pb-2'}>
        Total:{' '}
        {deliveryAllocations
          .map((da) => da.deliveryAllocationSize * da.count)
          .reduce((prev, curr) => prev + curr, 0)}
      </Text>
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
