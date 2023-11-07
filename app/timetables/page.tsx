import React, { ReactNode } from 'react';

import { Period } from '../api/dto-interfaces';
import RightHandToolCard from '../components/right-hand-tool-card';
import BigTableCard from '../components/big-table-card';
import DynamicDimensionTimetable from './dynamic-dimension-timetable';
import { fetchAllPeriodsInCycle } from '../api/request-schedule';

export default async function TimetablesPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  const allPeriodsInCycle = await fetchAllPeriodsInCycle();

  return (
    <div className="flex w-full items-top justify-between pt-4  select-none">
      <BigTableCard>
        <DynamicDimensionTimetable<string, Period>
          tableContents={allPeriodsInCycle}
          cellDataTransformer={(cellData) => cellDataTransformer(cellData)}
          headerTransformer={(header) => headerTransformer(header)}
        ></DynamicDimensionTimetable>
      </BigTableCard>
      <RightHandToolCard>
        <RightHandToolCard.UpperSixth>Stuff</RightHandToolCard.UpperSixth>
        <RightHandToolCard.LowerFiveSixths>
          More stuff
        </RightHandToolCard.LowerFiveSixths>
      </RightHandToolCard>
    </div>
  );
}

function cellDataTransformer(cellData: Period): React.ReactNode {
  return (
    <>
      <p className="w-24">{cellData.startTime?.substring(0, 5)}</p>
      <p> {(cellData.periodId || 0) % 6 || 6}</p>
    </>
  );
}

function headerTransformer(header: string): ReactNode {
  return header;
}
