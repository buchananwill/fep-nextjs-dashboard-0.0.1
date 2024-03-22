import { AvailabilityTable } from '../../contexts/availability/availability-table';
import { Suspense } from 'react';

export default function AvailabilityPage() {
  return (
    <Suspense
      fallback={
        <div className={'w-fit whitespace-nowrap '}>Loading availability</div>
      }
    >
      <AvailabilityTable />
    </Suspense>
  );
}
