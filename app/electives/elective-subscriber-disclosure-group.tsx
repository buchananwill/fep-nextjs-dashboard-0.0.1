'use client';
import React, { useContext, useEffect, useState, useTransition } from 'react';

import { usePathname, useRouter } from 'next/navigation';
import {
  checkAssignment,
  matchCarouselOrdinal
} from './checkElectiveAssignments';
import { ElectiveState } from './elective-reducers';

import { ElectiveContext, ElectiveDispatchContext } from './elective-context';
import { ElectiveFilterContext } from './elective-filter-context';

import { FilterType } from './elective-filter-reducers';
import { FillableButton, PinIcons } from '../components/fillable-button';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import { Disclosure } from '@headlessui/react';
import { ElectiveDTO, StudentDTO } from '../api/dto-interfaces';
import { ElectiveAvailability, FilterOption } from '../api/state-types';
import { ca } from 'date-fns/locale';

interface Props {
  electiveAvailability: ElectiveAvailability;
}

function filterStudentList(
  courseFilters: FilterOption<string>[],
  electiveState: ElectiveState
): StudentDTO[] {
  const {
    electivePreferences,
    studentMap,
    filterType,
    pinnedStudents,
    carouselOptionId
  } = electiveState;
  const filteredList: StudentDTO[] = [];

  if ((courseFilters && courseFilters.length > 0) || carouselOptionId) {
    studentMap.forEach((nextStudent, nextStudentId) => {
      const isPinned = pinnedStudents.has(nextStudentId);
      const nextStudentPrefs = electivePreferences.get(nextStudentId);
      if (!nextStudentPrefs) {
        return;
      }

      if (!isPinned) {
        if (filterType == FilterType.all) {
          let couldMatch = true;
          for (const { URI } of courseFilters) {
            couldMatch =
              couldMatch &&
              nextStudentPrefs.some((electivePreference) => {
                let { courseId, active } = electivePreference;
                if (active && URI == courseId) {
                  return true;
                }
              });
            if (!couldMatch) break;
          }
          if (carouselOptionId) {
            couldMatch =
              couldMatch &&
              nextStudentPrefs.some((electivePreference) => {
                const { active, assignedCarouselOptionId } = electivePreference;
                if (active && assignedCarouselOptionId == carouselOptionId)
                  return true;
              });
          }
          if (couldMatch) {
            const studentDto = studentMap.get(nextStudentId);
            studentDto && filteredList.push(studentDto);
          }
        } else if (filterType == FilterType.any) {
          let anyMatch = nextStudentPrefs.some((electivePreference) => {
            let { courseId: nextUuid, active } = electivePreference;
            return courseFilters.some(
              (filterOption) => active && filterOption.URI == nextUuid
            );
          });
          if (carouselOptionId) {
            anyMatch =
              anyMatch ||
              nextStudentPrefs.some((electivePreference) => {
                const { active, assignedCarouselOptionId } = electivePreference;
                if (active && assignedCarouselOptionId == carouselOptionId)
                  return true;
              });
          }
          if (anyMatch) {
            filteredList.push(nextStudent);
          }
        }
      }
    });
  }

  const pinnedStudentDtos: StudentDTO[] = [];
  if (pinnedStudents && pinnedStudents.size > 0) {
    pinnedStudents.forEach((studentId) => {
      const student = studentMap.get(studentId);
      student && pinnedStudentDtos.push(student);
    });
  }
  pinnedStudentDtos.sort((a, b) => a.name.localeCompare(b.name));
  filteredList.sort((a, b) => a.name.localeCompare(b.name));

  console.log(pinnedStudentDtos, filteredList);

  return [...pinnedStudentDtos, ...filteredList];
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
    userRoleId,
    pinnedStudents,
    highlightedCourses,
    electiveDtoMap
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
    assignedCarouselOrdinal: number
  ) {
    dispatch({
      type: 'setCarousel',
      studentId: studentId,
      preferencePosition: preferencePosition,
      assignedCarouselOrdinal: assignedCarouselOrdinal
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

    const activePreferencesThisStudent = electivePreferences
      .get(id)
      ?.filter((preference) => preference.active);

    activePreferencesThisStudent?.forEach((preference) =>
      dispatch({
        type: 'setHighlightedCourses',
        id: preference.courseId
      })
    );
  }

  const isPinned = (id: number) => {
    return pinnedStudents && pinnedStudents.has(id);
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
                              {isPending && userRoleId == student.id && (
                                <span className="z-20 loading loading-dots loading-xs"></span>
                              )}
                            </div>
                            <FillableButton
                              pinIcon={PinIcons.arrowLeftCircle}
                              className="z-20"
                              isPinned={student.id == userRoleId}
                              setPinned={() => handleRadioClick(student.id)}
                            ></FillableButton>

                            <Disclosure.Button className="border-x-2 border-dotted grow py-2 text-left text-sm font-medium hover:bg-emerald-100 focus:outline-none focus-visible:ring focus-visible:ring-emerald-500/75">
                              <span className="grow ml-2">{student.name}</span>
                            </Disclosure.Button>
                            <FillableButton
                              pinIcon={PinIcons.mapPin}
                              className="z-20"
                              isPinned={isPinned(student.id)}
                              setPinned={() => handlePinnedStudent(student.id)}
                            ></FillableButton>
                            <FillableButton
                              pinIcon={PinIcons.mortarBoard}
                              className={`mr-1`}
                              isPinned={false}
                              setPinned={() =>
                                handleMortarBoardClick(student.id)
                              }
                            ></FillableButton>
                            <ChevronUpIcon
                              className={`${
                                open ? 'rotate-180 transform' : ''
                              } h-5 w-5 mr-1`}
                            />
                          </div>
                          <Disclosure.Panel className="border-dotted rounded border-2 px-4 pt-4 pb-2 text-sm text-gray-500">
                            <div className="flex flex-col mx-0 my-2 w-full ">
                              <div></div>
                              {electivePreferences
                                .get(student.id)
                                ?.map(
                                  ({
                                    preferencePosition,
                                    name,
                                    assignedCarouselOptionId,
                                    courseId
                                  }) => {
                                    const nextPreferences =
                                      electivePreferences.get(student.id);
                                    if (!nextPreferences) return <></>;
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
                                              electiveDtoMap,
                                              nextPreferences,
                                              preferencePosition
                                            )
                                          )}
                                          <select
                                            className="select select-xs select-bordered w-16 grow-1"
                                            value={matchCarouselOrdinal(
                                              courseId,
                                              assignedCarouselOptionId,
                                              electiveDtoMap
                                            )}
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
                                              courseId,
                                              student.id,
                                              preferencePosition
                                            )}
                                          </select>
                                        </div>
                                        <input
                                          type="checkbox"
                                          className="toggle toggle-success ml-2"
                                          defaultChecked={
                                            nextPreferences[preferencePosition]
                                              .active
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
  uuid: string,
  studentId: number,
  preferencePosition: number
) {
  try {
    return electiveAvailability[uuid].map(
      (carouselOrdinal, index) => {
        return (
          <option
            key={`${studentId}-${preferencePosition}-${index}`}
            className="p-0 m-0 text-left"
            value={carouselOrdinal}
          >
            {carouselOrdinal}
          </option>
        );
      }
      // }
    );
  } catch (error) {}
}
