'use client';
import React, { useContext, useEffect, useState, useTransition } from 'react';
import { ElectiveState } from './elective-reducers';

import { ElectiveContext, ElectiveDispatchContext } from './elective-context';
import { ElectiveFilterContext } from './elective-filter-context';

import { FilterType } from './elective-filter-reducers';
import { ElectivePreferenceDTO, StudentDTO } from '../api/dto-interfaces';
import { FilterOption } from '../api/state-types';
import ListDisclosurePanel from '../components/list-disclosure-panel';
import { ButtonStudent } from './button-student';
import { ButtonClusterStudent } from './button-cluster-student';
import { StudentPanelTransformer } from './student-panel-transformer';
import genericPredicateFactorySupplier from './elective-filters/elective-preference-factory-supplier';
import {
  packageRequest,
  PredicateFactory,
  PredicateRequest
} from '../components/filters/filter-types';

function filterStudentList(
  courseFilters: FilterOption<string>[],
  electiveState: ElectiveState
): StudentDTO[] {
  const {
    electivePreferences,
    studentMap,
    filterType,
    pinnedStudents,
    carouselOptionIdSet
  } = electiveState;
  const filteredList: StudentDTO[] = [];

  const courseIdSet = new Set<string>();

  const strings = courseFilters.map((filterOption) => filterOption.URI);

  if (strings?.length > 0) {
    strings.forEach((string) => courseIdSet.add(string));
  }

  console.log('Course URI strings: ', strings);

  const coursePredicateFactoryList = courseFilters.map(({ URI }) =>
    genericPredicateFactorySupplier(
      electivePreferences,
      ({ courseId, active }) => active && URI == courseId
    )
  );

  const carouselOptionPredicateFactoryList: PredicateFactory<StudentDTO>[] = [];

  for (let number of carouselOptionIdSet) {
    carouselOptionPredicateFactoryList.push(
      genericPredicateFactorySupplier(
        electivePreferences,
        ({ assignedCarouselOptionId, active }) =>
          active && assignedCarouselOptionId == number
      )
    );
  }

  const pinnedStudentsPredicateFactory = genericPredicateFactorySupplier(
    electivePreferences,
    (preference) => pinnedStudents.has(preference.userRoleId)
  );

  const operatorValue = filterType == FilterType.all ? 'AND' : 'OR';

  const coursesAndOptionsRequest: PredicateRequest<StudentDTO> = {
    id: 0,
    name: 'Test',
    predicateFactoryList: [
      ...coursePredicateFactoryList,
      ...carouselOptionPredicateFactoryList
    ],
    operator: operatorValue
  };

  const pinnedRequest: PredicateRequest<StudentDTO> = {
    id: 1,
    name: 'Pinned Test',
    predicateFactoryList: [pinnedStudentsPredicateFactory],
    operator: 'AND',
    inversion: true
  };

  const pinnedFactoryInverted = packageRequest(pinnedRequest);

  const requestAsFactory = packageRequest(coursesAndOptionsRequest, false);

  const notPinnedAndOtherFilter: PredicateRequest<StudentDTO> = {
    id: 2,
    name: 'Not Pinned and is Filtered',
    predicateFactoryList: [pinnedFactoryInverted, requestAsFactory],
    operator: 'AND'
  };

  const finalPackage = packageRequest(notPinnedAndOtherFilter);

  const completedPredicate = finalPackage();

  for (let value of studentMap.values()) {
    if (completedPredicate(value)) filteredList.push(value);
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
