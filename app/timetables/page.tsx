import React from 'react';

import fetchSchedule from '../api/request-schedule';
import Timetable from './timetable';
import fetchResults from '../api/student-search';
import StudentSelector from './student-selector';
import { StudentDTO } from '../api/dto-interfaces';
import RightHandToolCard from '../components/right-hand-tool-card';

export default async function TimetablesPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  return (
    <div>
      <RightHandToolCard>
        <RightHandToolCard.UpperSixth>Stuff</RightHandToolCard.UpperSixth>
        <RightHandToolCard.LowerFiveSixths>
          More stuff
        </RightHandToolCard.LowerFiveSixths>
      </RightHandToolCard>
    </div>
  );
}
