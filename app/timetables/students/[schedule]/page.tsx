import React from 'react';

import { Period } from '../../../api/dto-interfaces';
import BigTableCard from '../../../components/big-table-card';
import DynamicDimensionTimetable, {
  HeaderTransformer
} from '../../../components/dynamic-dimension-timetable';

import TimetablesContextProvider from '../../timetables-context-provider';
import { FilteredLessonCycles } from '../../filtered-lesson-cycles';

import { buildTimetablesState } from '../../build-timetables-state';
import PendingScheduleEditionModal from '../../pending-schedule-edit-modal';
import { Card, Text, Title } from '@tremor/react';
import DropdownParam from '../../../components/dropdown-param';
import Link from 'next/link';
import { LessonCardTransformer } from '../../lesson-card';
import fetchAllStudents from '../../../api/actions/student-search';
import { StudentTimetableSelector } from './student-timetable-selector';
import NameIdTupleSelector from '../../../components/name-id-tuple-selector';
import ColorSelector, {
  useColorState
} from '../../../components/color-selector';
import {
  fetchAllLessonCycles,
  fetchAllPeriodsInCycle,
  fetchLessonEnrollments,
  fetchScheduleIds
} from '../../data-fetching-functions';

export const dynamic = 'force-dynamic';

export default async function TimetablesPage({
  params: { schedule },
  searchParams: { year, id }
}: {
  params: { schedule: string };
  searchParams: { year: string; id: string };
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

  const studentId = id ? parseInt(id) : NaN;

  const studentDTOS = await fetchAllStudents({ q: 'ell' });

  const nameIdTupleList = studentDTOS.map((studentDTO) => ({
    name: studentDTO.name,
    id: studentDTO.id.toString()
  }));

  const scheduleIds = await fetchScheduleIds();
  const scheduleIdsToString = scheduleIds.map((value) => value.toString());

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
        <DropdownParam paramOptions={scheduleIdsToString} />
        <StudentTimetableSelector selectionList={nameIdTupleList} />
      </div>

      <div className="flex w-full items-top justify-between pt-4  select-none">
        <Card className="flex-shrink-0 flex-grow max-w-full max-h-min h-min overflow-x-auto p-2">
          <div className="m-2 p-2 min-w-max max-h-min overflow-visible flex">
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
          </div>
        </Card>
      </div>
    </TimetablesContextProvider>
  );
}

const HeaderTransformerConcrete: HeaderTransformer<string> = ({ data }) => {
  return <p className="w-18">{data}</p>;
};
