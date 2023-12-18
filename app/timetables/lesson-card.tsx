'use client';
import { LessonEnrollmentDTO, Period } from '../api/dto-interfaces';
import { CellDataTransformer } from '../components/dynamic-dimension-timetable';
import React, { useContext } from 'react';
import { TimetablesContext } from './timetables-context';
import { useSearchParams } from 'next/navigation';
import InteractiveTableCard from '../components/interactive-table-card';
import { Text } from '@tremor/react';

const freePeriod: LessonEnrollmentDTO = {
  id: NaN,
  periodId: NaN,
  lessonCycleId: '',
  userRoleId: NaN
};
export const LessonCardTransformer: CellDataTransformer<Period> = ({
  data
}) => {
  const { studentTimetables, lessonCycleMap } = useContext(TimetablesContext);
  const { periodId } = data;
  const readonlyURLSearchParams = useSearchParams();
  const student = readonlyURLSearchParams?.get('student');
  const studentId = student ? parseInt(student) : NaN;
  const thisLesson =
    studentTimetables
      .get(studentId)
      ?.find(
        (lessonEnrollmentDto) => lessonEnrollmentDto.periodId == periodId
      ) || freePeriod;
  let lessonText: string;
  if (thisLesson === freePeriod) {
    lessonText = 'Free';
  } else {
    const name = lessonCycleMap.get(thisLesson.lessonCycleId)?.name;

    lessonText = (name && name.substring(0, name.indexOf(','))) || '??';
  }

  return (
    <InteractiveTableCard additionalClassNames={['border-transparent w-24']}>
      <Text>{lessonText}</Text>
    </InteractiveTableCard>
  );
};
