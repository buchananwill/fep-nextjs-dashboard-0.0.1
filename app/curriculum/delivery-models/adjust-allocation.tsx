import { useCurriculumModelContext } from './contexts/use-curriculum-model-context';
import React, { useMemo } from 'react';
import { UnsavedCurriculumModelChanges } from './contexts/curriculum-models-context-provider';
import { sumDeliveryAllocations } from './functions/sum-delivery-allocations';
import { useSelectiveContextDispatchBoolean } from '../../selective-context/components/typed/selective-context-manager-boolean';
import { WorkProjectSeriesSchemaDto } from '../../api/dtos/WorkProjectSeriesSchemaDtoSchema';
import { Flex, Text } from '@tremor/react';
import { StepperContext } from '../../contexts/stepper/stepper-context-creator';
import { AllocationUnitGroup } from './allocation-unit-group';
import LandscapeStepper from '../../generic/components/buttons/landscape-stepper';
import { DeliveryAllocation } from './delivery-allocation';
import { DtoComponentUiProps } from '../../playground/dto-component-wrapper';
import { isNotUndefined } from '../../api/main';
import { DeliveryAllocationDto } from '../../api/dtos/DeliveryAllocationDtoSchema';
import { TransientIdOffset } from '../../graphing/editing/functions/graph-edits';

export const allocationSizes = [1, 2];

export function AdjustAllocation({
  entity: workProjectSeriesSchemaDto,
  dispatchWithoutControl
}: DtoComponentUiProps<WorkProjectSeriesSchemaDto>) {
  const currentAllocations = useMemo(() => {
    return allocationSizes.map((size: number) => {
      const found = workProjectSeriesSchemaDto?.deliveryAllocations.find(
        (da) => da.deliveryAllocationSize === size
      );
      const nullAllocation: DeliveryAllocationDto = {
        id: TransientIdOffset + size, // TODO improve this transient ID allocation
        count: 0,
        deliveryAllocationSize: size,
        priority: 1,
        workProjectSeriesSchemaId: workProjectSeriesSchemaDto.id,
        workTaskTypeId: workProjectSeriesSchemaDto.workTaskTypeId
      };
      return found || nullAllocation;
    });
  }, [workProjectSeriesSchemaDto]);

  const totalAllocations = useMemo(
    () => sumDeliveryAllocations(workProjectSeriesSchemaDto),
    [workProjectSeriesSchemaDto]
  );

  const handleModifyAllocation = (size: number, up: boolean) => {
    if (!isNotUndefined(dispatchWithoutControl)) return;
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
    dispatchWithoutControl(updatedSchema);
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
