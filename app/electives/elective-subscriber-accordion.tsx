'use client';
import React, { useContext, useTransition } from 'react';

import { Student } from '../tables/student-table';
import { usePathname, useRouter } from 'next/navigation';
import { checkAssignment } from './checkElectiveAssignments';
import { ElectiveState } from './elective-reducers';

import {
  ElectivesContext,
  ElectivesDispatchContext
} from './electives-context';
import { ElectivesFilterContext } from './electives-filter-context';
import { ElectiveFilterState } from './elective-filter-reducers';
import { FilterOption } from '../components/filter-dropdown';

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
  const { electivePreferences, courseId, carouselId, studentList } =
    electiveState;
  const filteredList: Student[] = [];

  for (let electivePreferencesKey in electivePreferences) {
    const numericKey = parseInt(electivePreferencesKey);
    const nextStudentPrefs = electivePreferences[numericKey];

    const foundStudent = nextStudentPrefs.some((electivePreference) => {
      let { courseUUID, isActive } = electivePreference;
      return courseFilters.some(
        (filterOption) => isActive && filterOption.URI == courseUUID
      );
    });
    if (foundStudent) {
      const student = studentList.find((student) => student.id == numericKey);
      student && filteredList.push(student);
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

  const electiveState = useContext(ElectivesContext);
  const { electivePreferences, partyId, studentList } = electiveState;
  const electiveFilterState = useContext(ElectivesFilterContext);

  const { courseFilters } = electiveFilterState;

  const filteredStudents = filterStudentList(courseFilters, electiveState);

  const dispatch = useContext(ElectivesDispatchContext);

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

  try {
    return (
      <>
        <div className="pb-4">
          {filteredStudents.map((student) => (
            <div
              key={`${student.id}-prefs`}
              className="gap-0 collapse bg-base-200 py-2 px-0 m-0"
            >
              <input type="checkbox" className="min-h-0" />
              <div className="collapse-title flex items-center font-medium text-sm mx-0 gap-0 px-2 py-0 min-h-0">
                <div className="absolute left-8 top-4 flex items-center justify-center">
                  {isPending && partyId == student.id && (
                    <span className="z-20 loading loading-dots loading-xs"></span>
                  )}
                </div>
                <input
                  type="radio"
                  name="student-focus"
                  className="radio radio-xs mr-1 ml-0 z-10"
                  checked={student.id == partyId}
                  onChange={(e) => {
                    handleRadioClick(student.id);
                  }}
                ></input>
                <span>{student.name}</span>
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
                              handleToggleClick(student.id, preferencePosition);
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
