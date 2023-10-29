'use client';
import React, { useContext, useEffect, useState, useTransition } from 'react';

import { Student } from '../tables/student-table';
import { usePathname, useRouter } from 'next/navigation';
import { checkAssignment } from './checkElectiveAssignments';
import { ElectiveState } from './elective-reducers';

import { ElectiveContext, ElectiveDispatchContext } from './elective-context';
import { ElectiveFilterContext } from './elective-filter-context';

import { FilterOption, FilterType } from './elective-filter-reducers';
import { PinButton, PinIcons } from '../components/pin-button';

export interface ElectivePreference {
  partyId: number;
  courseDescription: string;
  courseUUID: string;
  preferencePosition: number;
  assignedCarouselId: number;
  isActive: boolean;
}

export interface ElectiveAvailability {
  [key: string]: number[];
}

interface Props {
  electiveAvailability: ElectiveAvailability;
}

function filterStudentList(
  courseFilters: FilterOption[],
  electiveState: ElectiveState
): Student[] {
  const {
    electivePreferences,
    courseId,
    carouselId,
    studentList,
    filterType,
    pinnedStudents
  } = electiveState;
  const filteredList: Student[] = [];

  if (
    (!courseFilters || courseFilters.length == 0) &&
    (!pinnedStudents || pinnedStudents.length == 0) &&
    (!courseId || !carouselId)
  ) {
    return filteredList;
  }

  for (const student of studentList) {
    const nextStudentId = student.id;
    const nextStudentPrefs = electivePreferences[nextStudentId];
    const isPinned = pinnedStudents.some(
      (student) => student.id == nextStudentId
    );

    if (!isPinned) {
      if (filterType == FilterType.all) {
        let couldMatch = true;
        for (const courseFilter of courseFilters) {
          couldMatch =
            couldMatch &&
            nextStudentPrefs.some((electivePreference) => {
              let { courseUUID, isActive, assignedCarouselId } =
                electivePreference;
              return isActive && courseFilter.URI == courseUUID;
            });
          if (!couldMatch) break;
        }
        if (courseId && carouselId) {
          couldMatch =
            couldMatch &&
            nextStudentPrefs.some((electivePreference) => {
              const { courseUUID, isActive, assignedCarouselId } =
                electivePreference;
              if (
                isActive &&
                courseUUID == courseId &&
                assignedCarouselId == carouselId
              )
                return true;
            });
        }
        if (couldMatch) filteredList.push(student);
      } else if (filterType == FilterType.any) {
        let anyMatch = nextStudentPrefs.some((electivePreference) => {
          let { courseUUID, isActive } = electivePreference;
          return courseFilters.some(
            (filterOption) => isActive && filterOption.URI == courseUUID
          );
        });
        if (courseId && carouselId) {
          anyMatch =
            anyMatch ||
            nextStudentPrefs.some((electivePreference) => {
              const { courseUUID, isActive, assignedCarouselId } =
                electivePreference;
              if (
                isActive &&
                courseUUID == courseId &&
                assignedCarouselId == carouselId
              )
                return true;
            });
        }
        if (anyMatch) {
          filteredList.push(student);
        }
      }
    } else {
      filteredList.push(student);
    }
  }

  return filteredList;
}

export default function ElectiveSubscriberAccordion({
  // studentList,
  electiveAvailability
}: Props) {
  const { replace } = useRouter();
  // const [radioActive, setRadioActive] = useState(studentFocus);
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  // const [filteredList, setFilteredList] = useState<Student[]>(studentList);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

  const electiveState = useContext(ElectiveContext);
  const {
    electivePreferences,
    partyId,
    studentList,
    filterPending,
    pinnedStudents
  } = electiveState;
  const electiveFilterState = useContext(ElectiveFilterContext);

  const { courseFilters } = electiveFilterState;
  const dispatch = useContext(ElectiveDispatchContext);

  useEffect(() => {
    startTransition(() => {
      const updatedFilterList = filterStudentList(courseFilters, electiveState);
      setFilteredStudents(updatedFilterList);
      dispatch({
        type: 'setFilterPending',
        pending: false
      });
    });
  }, [courseFilters, dispatch, electiveState]);

  // useEffect(() => {
  //   const filteredStudentList = filterStudentList(electiveState, studentList);
  //
  //   setFilteredList(filteredStudentList);
  // }, [studentList, electiveState]);

  function handleAssignmentChange(
    studentId: number,
    preferencePosition: number,
    assignedCarouselId: number
  ) {
    dispatch({
      type: 'setCarousel',
      studentId: studentId,
      preferencePosition: preferencePosition,
      assignedCarouselId: assignedCarouselId
    });
  }

  function handleToggleClick(studentId: number, preferencePosition: number) {
    dispatch({
      type: 'setActive',
      studentId: studentId,
      preferencePosition: preferencePosition
    });
  }

  const setUnsaved = (state: boolean) => {
    if (state) {
      const params = new URLSearchParams(window.location.search);

      params.set('unsaved', 'true');

      startTransition(() => {
        replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    }
  };

  function handleRadioClick(clickedId: number) {
    dispatch({
      type: 'focusStudent',
      studentId: clickedId
    });
  }

  function handlePinnedStudent(id: number) {
    dispatch({
      type: 'setPinnedStudent',
      id: id
    });
  }

  const isPinned = (id: number) => {
    return pinnedStudents && pinnedStudents.some((student) => student.id == id);
  };
  try {
    return (
      <>
        <div className="pb-4">
          {filteredStudents &&
            filteredStudents.map((student) => (
              <div
                key={`${student.id}-prefs`}
                className="gap-0 collapse bg-base-200 py-2 px-0 m-0"
              >
                <input type="checkbox" className="min-h-0" />
                <div className="collapse-title grow-1 flex items-center font-medium text-sm mx-0 gap-0 px-2 py-0 min-h-0">
                  <div className="absolute left-8 top-4 flex items-center justify-center">
                    {isPending && partyId == student.id && (
                      <span className="z-20 loading loading-dots loading-xs"></span>
                    )}
                  </div>
                  <input
                    type="radio"
                    name="student-focus"
                    className="radio radio-xs mx-2 z-10 hover:border-accent"
                    checked={student.id == partyId}
                    onChange={(e) => {
                      handleRadioClick(student.id);
                    }}
                  ></input>
                  <span className="grow">{student.name}</span>
                  <PinButton
                    pinIcon={PinIcons.mapPin}
                    classNames="z-20"
                    isPinned={isPinned(student.id)}
                    setPinned={() => handlePinnedStudent(student.id)}
                  ></PinButton>
                </div>

                <div className="collapse-content m-0 text-sm min-h-0">
                  <div className="flex flex-col mx-0 my-2 w-full ">
                    <div></div>
                    {electivePreferences[student.id].map(
                      ({
                        preferencePosition,
                        courseDescription,
                        assignedCarouselId
                      }) => {
                        return (
                          <div
                            key={`${student.id}-${preferencePosition}`}
                            className="flex grow-0 w-full justify-between"
                          >
                            {/* <span className="px-1 w-6">{preferencePosition}</span> */}
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
                                className="select select-xs select-bordered w-16 grow-1"
                                value={assignedCarouselId}
                                onChange={(e) => {
                                  handleAssignmentChange(
                                    student.id,
                                    preferencePosition,
                                    parseInt(e.target.value)
                                  );
                                  setUnsaved(true);
                                }}
                              >
                                {mapOptions(
                                  electiveAvailability,
                                  courseDescription,
                                  assignedCarouselId,
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
                              onClick={() => {
                                handleToggleClick(
                                  student.id,
                                  preferencePosition
                                );
                                setUnsaved(true);
                              }}
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
}

function getAssignmentIndicator(assignmentCheck: boolean) {
  const indicator = 'rose-400';

  return assignmentCheck ? (
    <></>
  ) : (
    <span className={`indicator-item badge bg-${indicator} text-xs`}>!</span>
  );
}

function mapOptions(
  electiveAvailability: ElectiveAvailability,
  courseDescription: string,
  assignedCarousel: number,
  studentId: number,
  preferencePosition: number
) {
  try {
    return electiveAvailability[courseDescription].map(
      (carouselNumber, index) => {
        // if (carouselNumber !== assignedCarousel) {
        return (
          <option
            key={`${studentId}-${preferencePosition}-${index}`}
            className="p-0 m-0 text-left"
            value={carouselNumber}
          >
            {carouselNumber}
          </option>
        );
      }
      // }
    );
  } catch (error) {}
}
