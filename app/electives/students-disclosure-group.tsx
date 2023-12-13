'use client';
import React, { useContext, useEffect, useState, useTransition } from 'react';
import { ElectiveState } from './elective-reducers';

import { ElectiveContext, ElectiveDispatchContext } from './elective-context';
import { ElectiveFilterContext } from './elective-filter-context';

import { FilterType } from './elective-filter-reducers';
import { StudentDTO } from '../api/dto-interfaces';
import { FilterOption } from '../api/state-types';
import ListDisclosurePanel from '../components/list-disclosure-panel';
import { ButtonStudent } from './button-student';
import { ButtonClusterStudent } from './button-cluster-student';
import { StudentPanelTransformer } from './student-panel-transformer';

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

  return [...pinnedStudentDtos, ...filteredList];
}

export default function StudentsDisclosureGroup() {
  const [isPending, startTransition] = useTransition();
  const [filteredStudents, setFilteredStudents] = useState<StudentDTO[]>([]);

  const electiveState = useContext(ElectiveContext);
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

  try {
    return (
      <ListDisclosurePanel
        data={filteredStudents}
        buttonCluster={ButtonClusterStudent}
        disclosureLabelTransformer={ButtonStudent}
        panelTransformer={StudentPanelTransformer}
      />
    );
  } catch (error) {
    console.error('Error: ', error);
  }
}
