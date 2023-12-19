'use client';
import NameIdTupleSelector from '../../../components/name-id-tuple-selector';
import React, {
  Fragment,
  useContext,
  useEffect,
  useState,
  useTransition
} from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/20/solid';
import {
  TimetablesContext,
  TimetablesDispatchContext
} from '../../timetables-context';
import { useSearchParams } from 'next/navigation';
import {
  LessonEnrollmentDTO,
  NameIdStringTuple
} from '../../../api/dto-interfaces';
import StateSelector from '../../../components/state-selector';

const noSelection = { name: '', id: '' };

export function StudentTimetableSelector({
  selectionList
}: {
  selectionList: { name: string; id: string }[];
}) {
  const { studentTimetables, studentId, scheduleId } =
    useContext(TimetablesContext);
  const dispatch = useContext(TimetablesDispatchContext);
  const [listSelection, setListSelection] = useState(noSelection);
  const [pending, startTransition] = useTransition();

  const updateStudentTimetable = async (value: NameIdStringTuple) => {
    const numberId = parseInt(value.id);
    if (!studentTimetables.get(numberId) && numberId) {
      const apiUrl = `../api?scheduleId=${scheduleId}&studentId=${numberId}`;
      const response = await fetch(apiUrl, {});
      const fetchedTimetable: LessonEnrollmentDTO[] = await response.json();
      const timetableDispatch = {
        type: 'setStudentTimetable',
        id: numberId,
        timetable: fetchedTimetable
      };
      dispatch(timetableDispatch);
    }
    if (numberId) {
      dispatch({
        type: 'setStudent',
        id: numberId
      });
    }
  };

  useEffect(() => {
    const find =
      selectionList.find((tuple) => tuple.id == studentId.toString()) ||
      noSelection;
    setListSelection(find);
  }, [listSelection, studentId, setListSelection, selectionList]);

  const selectionDescriptor = 'Student: ';

  return (
    <StateSelector
      selectedState={listSelection}
      selectionList={selectionList}
      updateSelectedState={updateStudentTimetable}
      selectionDescriptor={'Student: '}
    />
  );
}
