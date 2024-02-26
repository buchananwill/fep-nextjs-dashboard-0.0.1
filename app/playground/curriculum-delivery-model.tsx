'use client';
import { Badge, Card, Flex, Text, Title } from '@tremor/react';
import { WorkProjectSeriesSchemaDto } from '../api/dtos/WorkProjectSeriesSchemaDtoSchema';
import { DeliveryAllocationDto } from '../api/dtos/DeliveryAllocationDtoSchema';
import React, { useState } from 'react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid';
import { mode } from 'd3';

const allocationSizes = [1, 2];

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
      <div key={`allocation-${i}`} className={'flex m-0 p-1'}>
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

export function CurriculumDeliveryModel({
  model
}: {
  model: WorkProjectSeriesSchemaDto;
}) {
  const { name, deliveryAllocations: receivedAllocations } = model;

  return (
    <Card className={'overflow-x-auto p-4'}>
      <Title className={'mb-2'}>{model.workTaskType.knowledgeDomainName}</Title>
      <AdjustAllocation
        receivedAllocations={receivedAllocations}
      ></AdjustAllocation>

      <Flex className="mt-6">
        <Text>{model.workTaskType.knowledgeDomainName}</Text>
        <Text className="text-right">
          {model.workTaskType.serviceCategoryKnowledgeDomainDescriptor}
        </Text>
      </Flex>
    </Card>
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
      <Flex justifyContent="start" alignItems="baseline" className="space-x-2">
        {deliveryAllocations.map((deliveryAllocation, index) => (
          <div key={`del-al-${index}`}>
            <div
              className={
                'w-fit flex border-2 border-slate-400 rounded-lg divide-x mb-2 items-center'
              }
            >
              <button
                onClick={() =>
                  handleModifyAllocation(
                    deliveryAllocation.deliveryAllocationSize,
                    false
                  )
                }
              >
                <MinusIcon className={'w-6 h-6'}></MinusIcon>
              </button>
              <button
                onClick={() =>
                  handleModifyAllocation(
                    deliveryAllocation.deliveryAllocationSize,
                    true
                  )
                }
              >
                <PlusIcon className={'w-6 h-6'}></PlusIcon>
              </button>
              <Text className={'text-sm w-8 text-center'}>
                {deliveryAllocation.count}
              </Text>
            </div>
            <DeliveryAllocation
              key={deliveryAllocation.id}
              deliveryAllocation={deliveryAllocation}
            />
          </div>
        ))}
      </Flex>
      <Text>
        Total:{' '}
        {deliveryAllocations
          .map((da) => da.deliveryAllocationSize * da.count)
          .reduce((prev, curr) => prev + curr, 0)}
      </Text>
    </>
  );
}
