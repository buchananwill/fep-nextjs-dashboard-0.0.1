'use client';
import React, { useEffect, useState, useTransition } from 'react';
import { Badge, Title } from '@tremor/react';
import { ElectiveDTO } from './elective-card';
import { Student } from '../tables/student-table';
import { usePathname, useRouter } from 'next/navigation';

export interface ElectivePreference {
  partyId: number;
  courseDescription: string;
  preferencePosition: number;
  assignedCarousel: number;
}

interface Props {
  lessonCycleFocus: ElectiveDTO;
  studentFocus: number;
  studentList: Student[];
  electivePreferenceList: ElectivePreference[];
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const ElectiveSubscriberAccordion = ({
  lessonCycleFocus,
  studentFocus,
  studentList,
  electivePreferenceList
}: Props) => {
  const electivePreferences: ElectivePreference[][] = studentList.map(
    (student) =>
      electivePreferenceList.filter(
        (ePreference) => ePreference.partyId === student.id
      )
  );

  const { replace } = useRouter();
  const pathname = usePathname();
  const [toggleArray, setToggleArray] = useState<boolean[][]>(() =>
    electivePreferences.map((student) =>
      student.map((ePref) => ePref.assignedCarousel >= 0)
    )
  );
  const [isPending, startTransition] = useTransition();

  const onCollapseClick = (clickedId: number) => {
    const params = new URLSearchParams(window.location.search);

    params.set('partyId', clickedId.toString());

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  const handleToggleClick = (student: number, preferencePosition: number) => {
    const updatedStudent = toggleArray[student];
    const updatedValue = updatedStudent[preferencePosition] ? false : true;
    const updatedToggles = updatedStudent.map((toggle, index) =>
      index === preferencePosition ? updatedValue : toggle
    );

    const updatedToggleArray = toggleArray.map((studentToggles, index) =>
      index == student ? updatedToggles : studentToggles
    );

    setToggleArray(updatedToggleArray);
  };

  return (
    <>
      <div className="sticky top-0 z-10 backdrop-blur-xl p-2 m-0">
        {' '}
        {isPending && (
          <div className="absolute right-1 top-0 bottom-0 flex items-center justify-center">
            <span className="loading loading-ring loading-sm"></span>
          </div>
        )}
        <Title className="text-center">
          {lessonCycleFocus.courseDescription}
        </Title>
      </div>
      <div className="pb-4">
        {studentList.map((student, studentIndex) => (
          <div
            key={student.id}
            tabIndex={studentIndex}
            onClick={() => onCollapseClick(student.id)}
            className={classNames(
              studentFocus == student.id ? 'collapse-open' : 'collapse-close',
              'gap-0 collapse bg-base-200 py-0 px-2 m-0.5'
            )}
          >
            <div className="collapse-title font-medium text-sm m-0 gap-0 py-2 min-h-0">
              {student.name}
            </div>
            <div className="collapse-content m-0 text-sm py-0 min-h-0">
              <div className="flex flex-col m-0 w-full ">
                {electivePreferences[studentIndex].map(
                  ({
                    preferencePosition,
                    courseDescription,
                    assignedCarousel
                  }) => (
                    <div
                      key={`${student.name}-${preferencePosition}`}
                      className="flex grow-0 w-full justify-between"
                    >
                      <span>{courseDescription} </span>
                      <span className="grow "></span>
                      <span className="grow-1 px-1 w-6">
                        {preferencePosition}
                      </span>
                      <span className="grow-1 px-1 w-8">
                        {assignedCarousel}
                      </span>
                      <input
                        type="checkbox"
                        className="toggle toggle-success grow-0"
                        defaultChecked={
                          toggleArray?.[studentIndex]?.[preferencePosition] ??
                          false
                        }
                        onClick={() =>
                          handleToggleClick(studentIndex, preferencePosition)
                        }
                      ></input>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ElectiveSubscriberAccordion;
