import React from 'react';

import { LessonCycleDTO, Period } from '../../api/dto-interfaces';
import BigTableCard from '../../components/big-table-card';
import DynamicDimensionTimetable, {
  HeaderTransformer
} from '../../components/dynamic-dimension-timetable';
import {
  fetchAllLessonCycles,
  fetchAllPeriodsInCycle,
  fetchScheduleIds
} from '../api/route';
import { PeriodCardTransformer } from '../period-card';
import { LessonCycle } from '../../api/state-types';

import TimetablesContextProvider from '../timetables-context-provider';
import { FilteredLessonCycles } from '../filtered-lesson-cycles';

import { buildTimetablesState } from '../build-timetables-state';
import PendingScheduleEditionModal from '../pending-schedule-edit-modal';
import { bold } from 'next/dist/lib/picocolors';
import { SubjectFilters } from '../subject-filters';
import { Text, Title } from '@tremor/react';
import DropdownParam from '../../components/dropdown-param';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function TimetablesPage({
  params: { schedule },
  searchParams
}: {
  params: { schedule: string };
  searchParams: { q: string };
}) {
  const allPeriodsInCycle = await fetchAllPeriodsInCycle();

  allPeriodsInCycle.headerData = allPeriodsInCycle.headerData.map(
    (label) =>
      label.substring(0, 3) +
      ' ' +
      label.substring(label.length - 3, label.length)
  );
  const scheduleId = schedule ? parseInt(schedule) : NaN;

  if (isNaN(scheduleId)) {
    return <Text>No schedules found.</Text>;
  }

  const scheduleIds = await fetchScheduleIds();
  const filteredIds = scheduleIds.map((value) => value.toString());

  console.log('schedule id:', scheduleId);

  const allLessonCycles = await fetchAllLessonCycles(scheduleId);

  const { initialState, lessonCycleArray } = buildTimetablesState(
    allPeriodsInCycle,
    allLessonCycles,
    scheduleId
  );

  return (
    <TimetablesContextProvider initialState={initialState}>
      <div className="flex w-full items-baseline grow-0 mb-2">
        <Title>Schedule Version Id: {scheduleId}</Title>
        <Text className="mx-2">Schedule Layout</Text>
        <DropdownParam paramOptions={filteredIds} />
      </div>
      <SubjectFilters lessonCycleList={lessonCycleArray}></SubjectFilters>
      <div className="flex w-full items-top justify-between pt-4  select-none">
        <BigTableCard>
          {allLessonCycles.length == 0 && (
            <>
              <Text className="max-w-2xl">
                No lesson cycles were returned from the database. The schedule
                build may not have completed.
              </Text>
              <Text>
                {' '}
                Recommendation: consult the corresponding{' '}
                <Link
                  href={`/build-metrics/${scheduleId}`}
                  className="text-gray-950 font-bold hover:text-accent"
                >
                  Build Metric.
                </Link>
              </Text>
            </>
          )}
          <PendingScheduleEditionModal></PendingScheduleEditionModal>
          <DynamicDimensionTimetable<string, Period>
            tableContents={allPeriodsInCycle}
            cellDataTransformer={PeriodCardTransformer}
            headerTransformer={HeaderTransformerConcrete}
          ></DynamicDimensionTimetable>
        </BigTableCard>
        <FilteredLessonCycles data={lessonCycleArray} />
      </div>
    </TimetablesContextProvider>
  );
}

const HeaderTransformerConcrete: HeaderTransformer<string> = ({ data }) => {
  return <p className="w-18">{data}</p>;
};
