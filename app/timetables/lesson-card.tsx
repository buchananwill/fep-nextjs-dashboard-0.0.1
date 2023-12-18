'use client';
import { LessonEnrollmentDTO, Period } from '../api/dto-interfaces';
import { CellDataTransformer } from '../components/dynamic-dimension-timetable';
import React, { useContext, useEffect, useState } from 'react';
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
  const { studentTimetables, lessonCycleMap, studentId } =
    useContext(TimetablesContext);
  const { periodId } = data;
  const readonlyURLSearchParams = useSearchParams();
  const student = readonlyURLSearchParams?.get('id');
  const [lesson, setLesson] = useState(freePeriod);

  useEffect(() => {
    const timetables = studentTimetables.get(studentId);
    let updatedLesson = freePeriod;
    if (timetables && timetables.find) {
      updatedLesson =
        timetables?.find(
          (lessonEnrollmentDto) => lessonEnrollmentDto.periodId == periodId
        ) || freePeriod;
    }
    setLesson(updatedLesson);
  }, [setLesson, studentId, studentTimetables, lessonCycleMap, periodId]);
  let lessonText: string;
  if (lesson === freePeriod) {
    lessonText = 'Free';
  } else {
    const name = lessonCycleMap.get(lesson.lessonCycleId)?.name;

    lessonText = (name && name.substring(0, name.indexOf(','))) || '??';
  }

  return (
    <InteractiveTableCard additionalClassNames={['border-transparent w-24']}>
      <Text>{lessonText}</Text>
    </InteractiveTableCard>
  );
};
