import React, { ReactNode } from 'react';
import TimetablesContextProvider from '../../timetables-context-provider';
import { buildTimetablesState } from '../../build-timetables-state';
import PendingScheduleEditionModal from '../../pending-schedule-edit-modal';
import { Card, Text, Title } from '@tremor/react';

import Link from 'next/link';
import { LessonCardTransformer } from '../../lesson-card';
import fetchAllStudents from '../../../api/actions/student-search';
import { StudentTimetableSelector } from './student-timetable-selector';
import { PeriodDTO } from '../../../api/dtos/PeriodDTOSchema';
import { fetchAllPeriodsInCycle } from '../../../api/actions/cycle-model';
import {
  fetchAllLessonCycles,
  fetchScheduleIds
} from '../../../api/actions/timetables';
import DropdownParam from '../../../generic/components/dropdown/dropdown-param';
import DynamicDimensionTimetable, {
  HeaderTransformer
} from '../../../generic/components/tables/dynamic-dimension-timetable';

export const dynamic = 'force-dynamic';

export function DataNotFoundCard({ children }: { children: ReactNode }) {
  return <Card>{children}</Card>;
}

export default async function TimetablesPage({
  params: { schedule },
  searchParams: { year, id }
}: {
  params: { schedule: string };
  searchParams: { year: string; id: string };
}) {
  const { data: allPeriodsInCycle } = await fetchAllPeriodsInCycle();

  if (allPeriodsInCycle === undefined) {
    return <DataNotFoundCard>No Data!</DataNotFoundCard>;
  }

  allPeriodsInCycle.headerData = allPeriodsInCycle.headerData.map(
    (label) =>
      label.substring(0, 3) +
      ' ' +
      label.substring(label.length - 3, label.length)
  );
  const scheduleId = schedule ? parseInt(schedule) : NaN;

  if (isNaN(scheduleId)) {
    return <DataNotFoundCard>No schedules found.</DataNotFoundCard>;
  }

  const studentId = id ? parseInt(id) : NaN;

  const { data: studentDTOS } = await fetchAllStudents({ q: 'ell' });
  if (studentDTOS === undefined) {
    return <Card>No students found.</Card>;
  }

  const nameIdTupleList = studentDTOS.map((studentDTO) => ({
    name: studentDTO.name,
    id: studentDTO.id.toString()
  }));

  const { data: scheduleIds } = await fetchScheduleIds();
  if (scheduleIds === undefined) {
    return <DataNotFoundCard>Schedules not found.</DataNotFoundCard>;
  }
  const scheduleIdsToString = scheduleIds.map((value) => value.toString());

  const { data: allLessonCycles } = await fetchAllLessonCycles(scheduleId);
  if (allLessonCycles === undefined) {
    return <DataNotFoundCard>Lesson cycles not found.</DataNotFoundCard>;
  }

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
        <DropdownParam
          paramOptions={scheduleIdsToString}
          currentSelection={schedule}
        />
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
            <DynamicDimensionTimetable<string, PeriodDTO>
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
