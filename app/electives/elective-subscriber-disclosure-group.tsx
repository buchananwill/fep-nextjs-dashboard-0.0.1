'use client';
import React, { useContext, useEffect, useState, useTransition } from 'react';

import { usePathname, useRouter } from 'next/navigation';
import { checkAssignment } from './checkElectiveAssignments';
import { ElectiveState } from './elective-reducers';

import { ElectiveContext, ElectiveDispatchContext } from './elective-context';
import { ElectiveFilterContext } from './elective-filter-context';

import { FilterOption, FilterType } from './elective-filter-reducers';
import { PinButton, PinIcons } from '../components/pin-button';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import { Disclosure } from '@headlessui/react';
import { StudentDTO } from '../api/dto-interfaces';

export interface ElectiveAvailability {
  [key: string]: number[];
}

interface Props {
  electiveAvailability: ElectiveAvailability;
}

function filterStudentList(
  courseFilters: FilterOption[],
  electiveState: ElectiveState
): StudentDTO[] {
  const {
    electivePreferences,
    uuid,
    carouselId,
    studentList,
    filterType,
    pinnedStudents
  } = electiveState;
  const filteredList: StudentDTO[] = [];

  console.log('Beginning Filter: ', electiveState);

  if (
    (!courseFilters || courseFilters.length == 0) &&
    (!pinnedStudents || pinnedStudents.length == 0) &&
    (!uuid || !carouselId)
  ) {
    console.log('No filters selected.');
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
              let {
                uuid: nextUuid,
                isActive,
                assignedCarouselId
              } = electivePreference;
              return isActive && courseFilter.URI == nextUuid;
            });
          if (!couldMatch) break;
        }
        if (uuid && carouselId) {
          couldMatch =
            couldMatch &&
            nextStudentPrefs.some((electivePreference) => {
              const {
                uuid: nextUuid,
                isActive,
                assignedCarouselId
              } = electivePreference;
              if (
                isActive &&
                uuid == nextUuid &&
                assignedCarouselId == carouselId
              )
                return true;
            });
        }
        if (couldMatch) filteredList.push(student);
      } else if (filterType == FilterType.any) {
        let anyMatch = nextStudentPrefs.some((electivePreference) => {
          let { uuid: nextUuid, isActive } = electivePreference;
          return courseFilters.some(
            (filterOption) => isActive && filterOption.URI == nextUuid
          );
        });
        if (uuid && carouselId) {
          anyMatch =
            anyMatch ||
            nextStudentPrefs.some((electivePreference) => {
              const {
                uuid: nextUuid,
                isActive,
                assignedCarouselId
              } = electivePreference;
              if (
                isActive &&
                uuid == nextUuid &&
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

  console.log('Filtered list:', filteredList);

  return filteredList;
}

export default function ElectiveSubscriberDisclosureGroup({
  // studentList,
  electiveAvailability
}: Props) {
  const { replace } = useRouter();
  // const [radioActive, setRadioActive] = useState(studentFocus);
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  // const [filteredList, setFilteredList] = useState<Student[]>(studentList);
  const [filteredStudents, setFilteredStudents] = useState<StudentDTO[]>([]);

  const electiveState = useContext(ElectiveContext);
  const {
    electivePreferences,
    partyId,
    studentList,
    filterPending,
    pinnedStudents,
    highlightedCourses
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

  function handleMortarBoardClick(id: number) {
    highlightedCourses.forEach((course) =>
      dispatch({
        type: 'setHighlightedCourses',
        id: course
      })
    );

    const activePreferencesThisStudent = electivePreferences[id].filter(
      (preference) => preference.isActive
    );

    activePreferencesThisStudent.forEach((preference) =>
      dispatch({
        type: 'setHighlightedCourses',
        id: preference.uuid
      })
    );
  }

  const isPinned = (id: number) => {
    return pinnedStudents && pinnedStudents.some((student) => student.id == id);
  };
  try {
    return (
      <>
        <div className="pb-4 justify-left">
          {filteredStudents &&
            filteredStudents.map((student) => (
              <div key={`${student.id}-prefs`}>
                <div className="w-full px-0 py-0 m-0">
                  <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-0">
                    <Disclosure>
                      {({ open }) => (
                        <>
                          {' '}
                          <div className="flex w-full items-center grow-0 justify-between rounded-lg bg-gray-100">
                            <div className="absolute left-8 top-4 flex items-center justify-center">
                              {isPending && partyId == student.id && (
                                <span className="z-20 loading loading-dots loading-xs"></span>
                              )}
                            </div>
                            <PinButton
                              pinIcon={PinIcons.arrowLeftCircle}
                              classNames="z-20"
                              isPinned={student.id == partyId}
                              setPinned={() => handleRadioClick(student.id)}
                            ></PinButton>

                            <Disclosure.Button className="border-x-2 border-dotted grow py-2 text-left text-sm font-medium hover:bg-emerald-100 focus:outline-none focus-visible:ring focus-visible:ring-emerald-500/75">
                              <span className="grow ml-2">{student.name}</span>
                            </Disclosure.Button>
                            <PinButton
                              pinIcon={PinIcons.mapPin}
                              classNames="z-20"
                              isPinned={isPinned(student.id)}
                              setPinned={() => handlePinnedStudent(student.id)}
                            ></PinButton>
                            <PinButton
                              pinIcon={PinIcons.mortarBoard}
                              classNames={`mr-1`}
                              isPinned={false}
                              setPinned={() =>
                                handleMortarBoardClick(student.id)
                              }
                            ></PinButton>
                            <ChevronUpIcon
                              className={`${
                                open ? 'rotate-180 transform' : ''
                              } h-5 w-5 mr-1`}
                            />
                          </div>
                          <Disclosure.Panel className="border-dotted rounded border-2 px-4 pt-4 pb-2 text-sm text-gray-500">
                            <div className="flex flex-col mx-0 my-2 w-full ">
                              <div></div>
                              {electivePreferences[student.id].map(
                                ({
                                  preferencePosition,
                                  name,
                                  assignedCarouselId
                                }) => {
                                  return (
                                    <div
                                      key={`${student.id}-${preferencePosition}`}
                                      className="flex grow-0 w-full justify-between"
                                    >
                                      {/* <span className="px-1 w-6">{preferencePosition}</span> */}
                                      <span>{name} </span>
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
                                            name,
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
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
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
