import React from 'react';

import { Period } from '../../../api/dto-interfaces';
import BigTableCard from '../../../components/big-table-card';
import DynamicDimensionTimetable, {
  HeaderTransformer
} from '../../../components/dynamic-dimension-timetable';
import {
  fetchAllLessonCycles,
  fetchAllPeriodsInCycle,
  fetchLessonEnrollments,
  fetchScheduleIds
} from '../../api/route';

import TimetablesContextProvider from '../../timetables-context-provider';
import { FilteredLessonCycles } from '../../filtered-lesson-cycles';

import { buildTimetablesState } from '../../build-timetables-state';
import PendingScheduleEditionModal from '../../pending-schedule-edit-modal';
import { SubjectFilters } from '../../subject-filters';
import { Text, Title } from '@tremor/react';
import DropdownParam from '../../../components/dropdown-param';
import Link from 'next/link';
import { LessonCardTransformer } from '../../lesson-card';

export const dynamic = 'force-dynamic';

export default async function TimetablesPage({
  params: { schedule },
  searchParams: { year, student }
}: {
  params: { schedule: string };
  searchParams: { year: string; student: string };
}) {
  const allPeriodsInCycle = await fetchAllPeriodsInCycle();

  allPeriodsInCycle.headerData = allPeriodsInCycle.headerData.map(
    (label) =>
      label.substring(0, 3) +
      ' ' +
      label.substring(label.length - 3, label.length)
  );
  const scheduleId = schedule ? parseInt(schedule) : NaN;

  const studentId = student ? parseInt(student) : NaN;

  if (isNaN(scheduleId) || isNaN(studentId)) {
    return <Text>No schedules found.</Text>;
  }

  const scheduleIds = await fetchScheduleIds();
  const filteredIds = scheduleIds.map((value) => value.toString());

  const allLessonCycles = await fetchAllLessonCycles(scheduleId);
  const lessonEnrollmentDTOS = await fetchLessonEnrollments(
    studentId,
    scheduleId
  );

  console.log('Enrollments for ', studentId, ': ', lessonEnrollmentDTOS);

  const { initialState, lessonCycleArray } = buildTimetablesState(
    allPeriodsInCycle,
    allLessonCycles,
    scheduleId
  );

  if (lessonEnrollmentDTOS) {
    initialState.studentTimetables.set(studentId, lessonEnrollmentDTOS);
  }

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
            cellDataTransformer={LessonCardTransformer}
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
