import React from 'react';

import { LessonCycleDTO, Period } from '../api/dto-interfaces';
import BigTableCard from '../components/big-table-card';
import DynamicDimensionTimetable, {
  HeaderTransformer
} from '../components/dynamic-dimension-timetable';
import {
  fetchAllLessonCycles,
  fetchAllPeriodsInCycle
} from '../api/request-schedule';
import { PeriodCardTransformer } from './period-card';
import { LessonCycle } from '../api/state-types';

import TimetablesContextProvider from './timetables-context-provider';
import { FilteredLessonCycles } from './filtered-lesson-cycles';

import { buildTimetablesState } from './build-timetables-state';

function convertDtoToState({
  id,
  enrolledStudentIds,
  assignedTeacherIds,
  periodVenueAssignments,
  requiredNumberOfPeriods,
  name,
  subject
}: LessonCycleDTO): LessonCycle {
  const enrolledStudentIdSet = new Set<number>();
  enrolledStudentIds.forEach((id) => enrolledStudentIdSet.add(id));
  const assignedTeacherIdSet = new Set<number>();
  assignedTeacherIds.forEach((id) => assignedTeacherIdSet.add(id));
  const periodVenueAssignmentMap = new Map<number, string>();
  for (let periodVenueAssignmentsKey in periodVenueAssignments) {
    const keyAsNumber = parseInt(periodVenueAssignmentsKey);
    periodVenueAssignmentMap.set(
      keyAsNumber,
      periodVenueAssignments[periodVenueAssignmentsKey]
    );
  }

  return {
    enrolledStudentIds: enrolledStudentIdSet,
    id: id,
    name: name,
    requiredNumberOfPeriods: requiredNumberOfPeriods,
    periodVenueAssignments: periodVenueAssignmentMap,
    assignedTeacherIds: assignedTeacherIdSet,
    subject: subject
  };
}

export default async function TimetablesPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  const allPeriodsInCycle = await fetchAllPeriodsInCycle();

  allPeriodsInCycle.headerData = allPeriodsInCycle.headerData.map(
    (label) =>
      label.substring(0, 3) +
      ' ' +
      label.substring(label.length - 3, label.length)
  );

  const allLessonCycles = await fetchAllLessonCycles();

  const lessonCycleMap = new Map<number, LessonCycle>();

  const lessonCycleArray: LessonCycle[] = [];

  allLessonCycles.forEach((lessonCycleDTO) => {
    const stateObject = convertDtoToState(lessonCycleDTO);
    lessonCycleMap.set(stateObject.id, stateObject);
    lessonCycleArray.push(stateObject);
  });

  const periodToLessonCycleMap = new Map<number, Set<LessonCycle>>();

  allPeriodsInCycle.cellDataAndMetaData.forEach(
    ({ cellData: { periodId } }) => {
      if (periodId) {
        const stringOfId = periodId.toString();
        const setOfLessonCycles = new Set<LessonCycle>();
        allLessonCycles.forEach((dto) => {
          if (stringOfId in dto.periodVenueAssignments) {
            const retrievedCycle = lessonCycleMap.get(dto.id);
            if (retrievedCycle) setOfLessonCycles.add(retrievedCycle);
          }
        });
        periodToLessonCycleMap.set(periodId, setOfLessonCycles);
      }
    }
  );

  const initialState = buildTimetablesState(
    lessonCycleMap,
    periodToLessonCycleMap
  );

  return (
    <TimetablesContextProvider initialState={initialState}>
      <div className="flex w-full items-top justify-between pt-4  select-none">
        <BigTableCard>
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
