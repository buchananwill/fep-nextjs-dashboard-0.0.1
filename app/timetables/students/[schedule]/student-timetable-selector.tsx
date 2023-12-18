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
    console.log('Selection: ', value);
    const numberId = parseInt(value.id);
    if (!studentTimetables.get(numberId) && numberId) {
      const apiUrl = `../api?scheduleId=${scheduleId}&studentId=${numberId}`;
      console.log('Calling: ', apiUrl);
      const response = await fetch(apiUrl, {});
      const fetchedTimetable: LessonEnrollmentDTO[] = await response.json();
      const timetableDispatch = {
        type: 'setStudentTimetable',
        id: numberId,
        timetable: fetchedTimetable
      };
      console.log('Dispatch: ', timetableDispatch);
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
    <Listbox
      value={listSelection}
      by={'id'}
      onChange={(value) => updateStudentTimetable(value)}
    >
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span className="block truncate">
            <strong>
              {selectionDescriptor}
              {': '}
            </strong>
            {listSelection.name != '' ? listSelection.name : 'No Selection'}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-40">
            {selectionList.map((tuple, index) => (
              <Listbox.Option
                key={index}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                  }`
                }
                value={tuple}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? 'font-medium' : 'font-normal'
                      }`}
                    >
                      {tuple.name}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
