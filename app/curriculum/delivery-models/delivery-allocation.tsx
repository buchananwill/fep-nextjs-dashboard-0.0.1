import { DeliveryAllocationDto } from '../../api/dtos/DeliveryAllocationDtoSchema';
import React from 'react';
import { AllocationUnitGroup } from './allocation-unit-group';
import { XMarkIcon } from '@heroicons/react/24/outline';

export function DeliveryAllocation({
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
