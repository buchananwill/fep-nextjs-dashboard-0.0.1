'use client';
import React, { useEffect, useState, useTransition } from 'react';
import { Title } from '@tremor/react';
import { ElectiveDTO } from './elective-card';
import { Student } from '../tables/student-table';
import { usePathname, useRouter } from 'next/navigation';
import { checkAssignment } from './checkElectiveAssignments';
import { number } from 'prop-types';

export interface ElectivePreference {
  partyId: number;
  courseDescription: string;
  courseUUID: string;
  preferencePosition: number;
  assignedCarousel: number;
  isActive: boolean;
}

export interface ElectiveAvailability {
  [key: string]: number[];
}

interface Props {
  lessonCycleFocus: ElectiveDTO;
  studentFocus: number;
  studentList: Student[];
  electivePreferenceList: ElectivePreference[];
  electiveAvailability: ElectiveAvailability;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const ElectiveSubscriberAccordion = ({
  lessonCycleFocus,
  studentFocus,
  studentList,
  electivePreferenceList,
  electiveAvailability
}: Props) => {
  const { replace } = useRouter();
  const [radioActive, setRadioActive] = useState(studentFocus);
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [electivePreferences, setElectivePreferences] = useState<
    Record<number, ElectivePreference[]>
  >(() => {
    const groupedByPartyId = electivePreferenceList.reduce<
      Record<number, ElectivePreference[]>
    >((acc, curr) => {
      if (!acc[curr.partyId]) {
        acc[curr.partyId] = [];
      }
      // This will get removed once the preferences arrive with their active state from the database.
      if (curr.assignedCarousel < 0) curr.isActive = false;
      else curr.isActive = true;

      acc[curr.partyId].push(curr);
      return acc;
    }, {});

    return groupedByPartyId;
  });

  const handleAssignmentChange = (
    studentId: number,
    preferencePosition: number,
    carouselNumber: number
  ) => {
    const preferenceToUpdate =
      electivePreferences[studentId][preferencePosition];

    const updatedPreference: ElectivePreference = { ...preferenceToUpdate };
    updatedPreference.assignedCarousel = carouselNumber;

    const updatedState: Record<number, ElectivePreference[]> = {};

    for (const [key, preferenceList] of Object.entries(electivePreferences)) {
      const numericKey = parseInt(key);
      if (numericKey !== studentId) {
        updatedState[numericKey] = preferenceList;
      } else {
        updatedState[numericKey] = preferenceList.map(
          (preference, preferenceIndex) =>
            preferenceIndex === preferencePosition
              ? updatedPreference
              : preference
        );
      }
    }

    setElectivePreferences(updatedState);

    setUnsaved();
  };

  const setUnsaved = () => {
    const params = new URLSearchParams(window.location.search);

    params.set('unsaved', 'true');

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const onRadioClick = (clickedId: number) => {
    const params = new URLSearchParams(window.location.search);

    setRadioActive(clickedId);

    params.set('partyId', clickedId.toString());

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const handleToggleClick = (studentId: number, preferencePosition: number) => {
    const updatedStudent = electivePreferences[studentId];
    const updatedPreference = { ...updatedStudent[preferencePosition] };
    updatedPreference.isActive = !updatedPreference.isActive;

    const updatedState: Record<number, ElectivePreference[]> = {};

    for (const [key, preferenceList] of Object.entries(electivePreferences)) {
      const numericKey = parseInt(key);
      if (numericKey !== studentId) {
        updatedState[numericKey] = preferenceList;
      } else {
        updatedState[numericKey] = preferenceList.map(
          (preference, preferenceIndex) =>
            preferenceIndex === preferencePosition
              ? updatedPreference
              : preference
        );
      }

      setUnsaved();
    }

    setElectivePreferences(updatedState);
  };
  try {
    return (
      <>
        <div className="pb-4">
          {studentList.map((student) => (
            <div
              key={`${student.id}-prefs`}
              className="gap-0 collapse bg-base-200 py-2 px-0 m-0"
            >
              <input type="checkbox" className="min-h-0" />
              <div className="collapse-title flex items-center font-medium text-sm mx-0 gap-0 px-2 py-0 min-h-0">
                <div className="absolute left-8 top-4 flex items-center justify-center">
                  {isPending && radioActive == student.id && (
                    <span className="z-20 loading loading-dots loading-xs"></span>
                  )}
                </div>
                <input
                  type="radio"
                  name="student-focus"
                  className="radio radio-xs mr-1 ml-0 z-10"
                  checked={student.id == radioActive}
                  onChange={(e) => {
                    onRadioClick(student.id);
                  }}
                ></input>
                <span>{student.name}</span>
              </div>

              <div className="collapse-content m-0 text-sm min-h-0">
                <div className="flex flex-col mx-0 my-2 w-full ">
                  <div>Rank Subject </div>
                  {electivePreferences[student.id].map(
                    ({
                      preferencePosition,
                      courseDescription,
                      assignedCarousel
                    }) => {
                      return (
                        <div
                          key={`${student.id}-${preferencePosition}`}
                          className="flex grow-0 w-full justify-between"
                        >
                          <span className="px-1 w-6">{preferencePosition}</span>
                          <span>{courseDescription} </span>
                          <span className="grow"></span>
                          <div className="indicator">
                            {getAssignmentIndicator(
                              checkAssignment(
                                electivePreferences[student.id],
                                preferencePosition
                              )
                            )}
                            <select
                              className="select select-xs select-bordered w-12 grow-1"
                              value={assignedCarousel}
                              onChange={(e) =>
                                handleAssignmentChange(
                                  student.id,
                                  preferencePosition,
                                  parseInt(e.target.value)
                                )
                              }
                            >
                              <option
                                value={assignedCarousel}
                                className="p-0 m-0 text-left"
                              >
                                {assignedCarousel >= 0 ? assignedCarousel : '-'}
                              </option>
                              {mapOtherOptions(
                                electiveAvailability,
                                courseDescription,
                                assignedCarousel,
                                student.id,
                                preferencePosition
                              )}
                            </select>
                          </div>
                          <input
                            type="checkbox"
                            className="toggle toggle-success ml-2"
                            defaultChecked={
                              electivePreferences?.[student.id]?.[
                                preferencePosition
                              ].isActive
                            }
                            onClick={() =>
                              handleToggleClick(student.id, preferencePosition)
                            }
                          ></input>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  } catch (error) {
    console.log('Error: ', error);
  }
};

export default ElectiveSubscriberAccordion;

function getAssignmentIndicator(assignmentCheck: boolean) {
  const indicator = 'rose-400';

  return assignmentCheck ? (
    <></>
  ) : (
    <span className={`indicator-item badge bg-${indicator} text-xs`}>!</span>
  );
}

function mapOtherOptions(
  electiveAvailability: ElectiveAvailability,
  courseDescription: string,
  assignedCarousel: number,
  studentId: number,
  preferencePosition: number
) {
  try {
    return electiveAvailability[courseDescription].map(
      (carouselNumber, index) => {
        if (carouselNumber !== assignedCarousel) {
          return (
            <option
              key={`${studentId}-${preferencePosition}-${index}`}
              className="p-0 m-0 text-left"
              value={carouselNumber}
            >
              {' '}
              {carouselNumber}
            </option>
          );
        }
      }
    );
  } catch (error) {}
}
