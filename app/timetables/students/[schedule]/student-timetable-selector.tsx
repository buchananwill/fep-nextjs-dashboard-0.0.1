'use client';
import { useContext, useEffect, useState } from 'react';
import {
  TimetablesContext,
  TimetablesDispatchContext
} from '../../timetables-context';
import { NameIdStringTuple } from '../../../api/dtos/NameIdStringTupleSchema';
import { LessonEnrollmentDTO } from '../../../api/dtos/LessonEnrollmentDTOSchema';
import TupleSelector from '../../../generic/components/dropdown/tuple-selector';

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
  return (
    <TupleSelector
      selectedState={listSelection}
      selectionList={selectionList}
      updateSelectedState={updateStudentTimetable}
      selectionDescriptor={'Student: '}
    />
  );
}
