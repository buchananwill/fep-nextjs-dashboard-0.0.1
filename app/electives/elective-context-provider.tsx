'use client';

import { ReactNode, useReducer } from 'react';
import { ElectiveContext, ElectiveDispatchContext } from './elective-context';
import { enableMapSet } from 'immer';

import electiveStateReducer, {
  createElectiveDtoMap,
  createElectivePreferenceRecords,
  ElectiveState
} from './elective-reducers';
import { usePathname, useSearchParams } from 'next/navigation';
import { FilterType } from './elective-filter-reducers';
import {
  ElectiveDTO,
  ElectivePreferenceDTO,
  StudentDTO
} from '../api/dto-interfaces';
import { ElectiveAvailability } from '../api/state-types';

interface Props {
  electiveDtoList: ElectiveDTO[];
  studentList: StudentDTO[];
  electivePreferenceList: ElectivePreferenceDTO[];
  electiveAvailability: ElectiveAvailability;
  children: ReactNode;
}

function createStudentDtoMap(studentList: StudentDTO[]) {
  const studentDtoMap = new Map<number, StudentDTO>();
  studentList.forEach((student) => studentDtoMap.set(student.id, student));

  return studentDtoMap;
}

function createModificationMap(studentList: StudentDTO[]) {
  const map = new Map<number, Set<number>>();
  studentList.forEach((student) => map.set(student.id, new Set()));
  return map;
}

export default function ElectiveContextProvider({
  studentList,
  electivePreferenceList,
  children,
  electiveDtoList,
  electiveAvailability
}: Props) {
  const initialElectiveState: ElectiveState = {
    highlightedCourses: [],
    pinnedStudents: new Set<number>(),
    filterPending: false,
    filterType: FilterType.any,
    studentMap: createStudentDtoMap(studentList),
    carouselOptionIdSet: new Set(),
    electiveDtoMap: createElectiveDtoMap(electiveDtoList),
    electiveAvailability: electiveAvailability,
    electivePreferences: createElectivePreferenceRecords(
      electivePreferenceList
    ),
    modifiedPreferences: createModificationMap(studentList),
    userRoleId: 0
  };
  const pathname = usePathname();

  enableMapSet();

  const [electiveState, dispatch] = useReducer(
    electiveStateReducer,
    initialElectiveState
  );

  return (
    <ElectiveContext.Provider value={electiveState}>
      <ElectiveDispatchContext.Provider value={dispatch}>
        {children}
      </ElectiveDispatchContext.Provider>
    </ElectiveContext.Provider>
  );
}
