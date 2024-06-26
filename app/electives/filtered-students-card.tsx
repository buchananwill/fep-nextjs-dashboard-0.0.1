import React from 'react';
import StudentsDisclosureGroup from './students-disclosure-group';

import { FilteredStudentCardTitle } from './filtered-student-card-title';
import RightHandToolCard from '../generic/components/tool-card/right-hand-tool-card';

const FilteredStudentsCard = () => {
  return (
    <RightHandToolCard>
      <RightHandToolCard.UpperSixth>
        <div className="w-64 rounded-2xl shadow p-2 m-0 text-xl font-semibold border-2 items-center relative">
          <FilteredStudentCardTitle />
        </div>
      </RightHandToolCard.UpperSixth>

      <RightHandToolCard.LowerFiveSixths>
        <div className="text-center py-2 select-none px-2">
          <StudentsDisclosureGroup />
        </div>
      </RightHandToolCard.LowerFiveSixths>
    </RightHandToolCard>
  );
};

export default FilteredStudentsCard;
