'use client';

import React, { Suspense, useContext } from 'react';
import { useSearchParams } from 'next/navigation';
import { ElectiveContext } from './elective-context';

import ElectiveSubscriberDisclosureGroup from './elective-subscriber-disclosure-group';

import RightHandToolCard from '../components/right-hand-tool-card';
import { ElectiveAvailability } from '../api/state-types';

interface Props {
  electiveAvailability: ElectiveAvailability;
}

const FilteredStudentsCard = ({ electiveAvailability }: Props) => {
  const toolTips = useSearchParams()?.get('toolTips') == 'show';

  const { filterPending } = useContext(ElectiveContext);

  return (
    <RightHandToolCard>
      <RightHandToolCard.UpperSixth>
        <div className="w-64 rounded-2xl shadow p-2 m-0 text-xl font-semibold border-2 items-center relative">
          Filtered Students{' '}
          {filterPending && (
            <span className="absolute right-6 inset-y-1/3 loading loading-dots loading-xs z-20"></span>
          )}
        </div>
      </RightHandToolCard.UpperSixth>

      <RightHandToolCard.LowerFiveSixths>
        <div className="text-center py-2 select-none px-2">
          <ElectiveSubscriberDisclosureGroup
            electiveAvailability={electiveAvailability}
          />
        </div>
      </RightHandToolCard.LowerFiveSixths>
    </RightHandToolCard>
  );
};

export default FilteredStudentsCard;
