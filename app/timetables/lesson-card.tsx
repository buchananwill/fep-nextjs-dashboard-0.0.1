'use client';
import { LessonEnrollmentDTO } from '../api/dto-interfaces';
import React, { useContext, useEffect, useState } from 'react';
import { TimetablesContext } from './timetables-context';
import { useSearchParams } from 'next/navigation';
import { Text } from '@tremor/react';

import { produce } from 'immer';
import { PeriodDTO } from '../api/dtos/PeriodDTOSchema';
import { CellDataTransformer } from '../generic/components/tables/dynamic-dimension-timetable';
import { defaultColorState } from '../generic/components/color/color-context';
import InteractiveTableCard from '../generic/components/tables/interactive-table-card';
import {
  ColorCoding,
  ColorCodingDispatch,
  ModalColorSelectContext
} from '../generic/components/color/color-coding-context';

export const LessonCardTransformer: CellDataTransformer<PeriodDTO> = ({
  data
}) => {
  const { studentTimetables, lessonCycleMap, studentId } =
    useContext(TimetablesContext);
  const { id } = data;
  useSearchParams();
  const [lesson, setLesson] = useState(freePeriod);
  const [lessonText, setLessonText] = useState('Free');
  const [textColor, setTextColor] = useState(defaultColorState);
  const subjectColorCoding = useContext(ColorCoding);
  const { setColorCoding } = useContext(ColorCodingDispatch);
  const { setModalText: setModalLessonText, openModal } = useContext(
    ModalColorSelectContext
  );

  useEffect(() => {
    const timetables = studentTimetables.get(studentId);
    let updatedLesson = freePeriod;
    if (timetables && timetables.find) {
      updatedLesson =
        timetables?.find(
          (lessonEnrollmentDto) => lessonEnrollmentDto.periodId == id
        ) || freePeriod;
    }
    setLesson(updatedLesson);
  }, [setLesson, studentId, studentTimetables, lessonCycleMap, id]);

  useEffect(() => {
    let updatedText: string;
    if (lesson === freePeriod) {
      updatedText = 'Free';
    } else {
      const name = lessonCycleMap.get(lesson.lessonCycleId)?.name;
      updatedText = (name && name.substring(0, name.indexOf(','))) || 'Free';
    }
    setLessonText(updatedText);
  }, [lesson, setLessonText, lessonCycleMap]);

  useEffect(() => {
    const subjectColorCodingElement = subjectColorCoding[lessonText];
    let updatedTextColor;
    if (!subjectColorCodingElement) {
      const subjectColorCodingState = produce(subjectColorCoding, (draft) => {
        draft[lessonText] = defaultColorState;
      });
      setColorCoding(subjectColorCodingState);
      updatedTextColor = defaultColorState;
    } else {
      updatedTextColor = subjectColorCodingElement;
    }
    setTextColor(updatedTextColor);
  }, [lessonText, setTextColor, subjectColorCoding, setColorCoding]);

  const { hue, lightness } = textColor;

  const classNameStyling = `text-xs font-medium text-${hue.id}-${lightness.id}`;

  const handleCardClick = () => {
    setModalLessonText(lessonText);
    openModal();
  };

  return (
    <>
      <InteractiveTableCard
        additionalClassNames={['border-transparent w-28 py-0']}
      >
        <div
          className="py-2 w-full h-full text-center"
          onClick={() => handleCardClick()}
        >
          <Text className={classNameStyling}>{lessonText}</Text>
        </div>
      </InteractiveTableCard>
    </>
  );
};

const freePeriod: LessonEnrollmentDTO = {
  id: NaN,
  periodId: NaN,
  lessonCycleId: '',
  userRoleId: NaN
};
