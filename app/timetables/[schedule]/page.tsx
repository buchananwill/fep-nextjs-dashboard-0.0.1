import React from 'react';
import { PeriodCardTransformer } from '../period-card';
import TimetablesContextProvider from '../timetables-context-provider';
import { FilteredLessonCycles } from '../filtered-lesson-cycles';
import { buildTimetablesState } from '../build-timetables-state';
import PendingScheduleEditionModal from '../pending-schedule-edit-modal';
import { SubjectFilters } from '../subject-filters';
import { Text, Title } from '@tremor/react';
import Link from 'next/link';
import { PeriodDTO } from '../../api/dtos/PeriodDTOSchema';
import { fetchAllPeriodsInCycle } from '../../api/actions/cycle-model';
import {
  fetchAllLessonCycles,
  fetchScheduleIds
} from '../../api/actions/timetables';
import { isNotUndefined } from '../../api/main';
import { DataNotFoundCard } from '../students/[schedule]/page';
import DropdownParam from '../../generic/components/dropdown/dropdown-param';
import BigTableCard from '../../generic/components/tables/big-table-card';
import DynamicDimensionTimetable, {
  HeaderTransformer
} from '../../generic/components/tables/dynamic-dimension-timetable';

export const dynamic = 'force-dynamic';

export default async function TimetablesPage({
  params: { schedule },
  searchParams: { q }
}: {
  params: { schedule: string };
  searchParams: { q: string };
}) {
  const { data: allPeriodsInCycle } = await fetchAllPeriodsInCycle();
  if (!isNotUndefined(allPeriodsInCycle))
    return <DataNotFoundCard>No periods found.</DataNotFoundCard>;

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

  const { data: scheduleIds } = await fetchScheduleIds();
  if (!isNotUndefined(scheduleIds))
    return <DataNotFoundCard>Schedules not found.</DataNotFoundCard>;
  const filteredIds = scheduleIds.map((value) => value.toString());

  const { data: allLessonCycles } = await fetchAllLessonCycles(scheduleId);
  if (!isNotUndefined(allLessonCycles))
    return <DataNotFoundCard>Lesson Cycles not found.</DataNotFoundCard>;

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
        <DropdownParam paramOptions={filteredIds} currentSelection={q} />
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
          <DynamicDimensionTimetable<string, PeriodDTO>
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
