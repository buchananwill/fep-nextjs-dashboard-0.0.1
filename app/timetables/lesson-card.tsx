'use client';
import { LessonEnrollmentDTO, Period } from '../api/dto-interfaces';
import { CellDataTransformer } from '../components/dynamic-dimension-timetable';
import React, { useContext, useEffect, useState } from 'react';
import { TimetablesContext } from './timetables-context';
import { useSearchParams } from 'next/navigation';
import InteractiveTableCard from '../components/interactive-table-card';
import { Text } from '@tremor/react';
import {
  ModalColorSelectContext,
  SubjectColorCoding,
  SubjectColorCodingDispatch
} from '../subject-color-coding/context';
import { current, produce } from 'immer';
import { useColorState } from '../components/color-selector';
import { ColorSelectModal, useModal } from '../components/color-select-modal';
import {
  ColorState,
  defaultColorState,
  HUE_OPTIONS,
  LIGHTNESS_OPTIONS
} from '../components/color-context';
import { HueOption } from '../components/hue-selector';
import { LightnessOption } from '../components/lightness-selector';

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
  const [lessonText, setLessonText] = useState('Free');
  const [textColor, setTextColor] = useState(defaultColorState);
  const subjectColorCoding = useContext(SubjectColorCoding);
  const { setSubjectColorCoding } = useContext(SubjectColorCodingDispatch);
  const {
    setLessonText: setModalLessonText,
    openModal,
    setHue,
    setLightness
  } = useContext(ModalColorSelectContext);

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
      setSubjectColorCoding(subjectColorCodingState);
      updatedTextColor = defaultColorState;
    } else {
      updatedTextColor = subjectColorCodingElement;
    }
    setTextColor(updatedTextColor);
  }, [setSubjectColorCoding, lessonText, setTextColor, subjectColorCoding]);

  const { hue, lightness } = textColor;

  const classNameStyling = `text-sm font-medium text-${hue.id}-${lightness.id}`;

  const handleCardClick = () => {
    setHue(hue);
    setLightness(lightness);
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
