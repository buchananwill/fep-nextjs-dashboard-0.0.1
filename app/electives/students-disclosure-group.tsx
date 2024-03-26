'use client';
import React, { useContext, useEffect, useTransition } from 'react';

import { ElectiveContext, ElectiveDispatchContext } from './elective-context';
import { ElectiveFilterContext } from './elective-filter-context';

import { ButtonStudent } from './button-student';
import { ButtonClusterStudent } from './button-cluster-student';
import { StudentPanelTransformer } from './student-panel-transformer';
import { filterStudentList } from './filter-student-list';
import DisclosureListPanel from '../generic/components/disclosure-list/disclosure-list-panel';

export default function StudentsDisclosureGroup() {
  const [isPending, startTransition] = useTransition();

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
      <DisclosureListPanel
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
