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

function getTextStyling(lessonText: string): { color: string } {
  switch (lessonText) {
    case 'Free': {
      return { color: 'gray-200' };
    }
    case 'German':
    case 'French':
    case 'Computing':
    case 'Classical Civ':
    case 'Latin': {
      return { color: 'blue-400' };
    }
    case 'Maths': {
      return { color: 'fuchsia-400' };
    }
    case 'Physics':
    case 'Biology':
    case 'Chemistry': {
      return { color: 'emerald-400' };
    }
    case 'English': {
      return { color: 'yellow-600' };
    }
    case 'Art':
    case 'Design And T': {
      return { color: 'lime-500' };
    }
    case 'Geography':
    case 'History': {
      return { color: 'orange-400' };
    }
    case 'Registration': {
      return { color: 'gray-300' };
    }
    case 'Games':
    case 'Pe': {
      return { color: 'teal-400' };
    }
    default: {
      return { color: 'red-400' };
    }
  }
}

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

    lessonText = (name && name.substring(0, name.indexOf(','))) || 'Free';
  }

  const textStyling = getTextStyling(lessonText);

  const classNameStyling = `text-sm font-medium text-${textStyling.color}`;

  return (
    <InteractiveTableCard additionalClassNames={['border-transparent w-28 ']}>
      <Text className={classNameStyling}>{lessonText}</Text>
    </InteractiveTableCard>
  );
};
