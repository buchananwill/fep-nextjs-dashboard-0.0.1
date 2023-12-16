'use client';
import React, { useContext, useEffect, useState, useTransition } from 'react';

import { ElectiveContext, ElectiveDispatchContext } from './elective-context';
import { ElectiveFilterContext } from './elective-filter-context';
import { ElectivePreferenceDTO, StudentDTO } from '../api/dto-interfaces';
import ListDisclosurePanel from '../components/list-disclosure-panel';
import { ButtonStudent } from './button-student';
import { ButtonClusterStudent } from './button-cluster-student';
import { StudentPanelTransformer } from './student-panel-transformer';
import { filterStudentList } from './filter-student-list';

export default function StudentsDisclosureGroup() {
  const [isPending, startTransition] = useTransition();
  // const [filteredStudents, setFilteredStudents] = useState<StudentDTO[]>([]);

  const electiveState = useContext(ElectiveContext);
  const electiveFilterState = useContext(ElectiveFilterContext);

  const {
    filteredStudents,
    electivePreferences,
    studentMap,
    filterType,
    carouselOptionIdSet,
    pinnedStudents
  } = electiveState;

  const { courseFilters } = electiveFilterState;
  const dispatch = useContext(ElectiveDispatchContext);

  useEffect(() => {
    dispatch({
      type: 'setFilterPending',
      pending: true
    });
    startTransition(() => {
      const updatedFilterList = filterStudentList(
        courseFilters,
        electivePreferences,
        studentMap,
        filterType,
        pinnedStudents,
        carouselOptionIdSet
      );
      dispatch({
        type: 'setFilteredStudents',
        filteredStudents: updatedFilterList
      });
    });
    dispatch({
      type: 'setFilterPending',
      pending: false
    });
  }, [
    courseFilters,
    dispatch,
    pinnedStudents,
    carouselOptionIdSet,
    electivePreferences,
    studentMap,
    filterType
  ]);

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

const matchCarouselOptionIdSet = (
  nextStudentPrefs: ElectivePreferenceDTO[],
  carouselOptionIdSet: Set<number>
) => {
  let matchesFound = 0;
  for (let { assignedCarouselOptionId, active } of nextStudentPrefs) {
    if (active && carouselOptionIdSet.has(assignedCarouselOptionId)) {
      matchesFound++;
      if (matchesFound == carouselOptionIdSet.size) return true;
    }
  }
  return false;
};
