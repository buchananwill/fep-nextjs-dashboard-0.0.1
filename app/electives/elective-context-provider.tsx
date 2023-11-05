'use client';

import { ReactNode, useReducer } from 'react';
import { ElectiveContext, ElectiveDispatchContext } from './elective-context';

import electiveStateReducer, {
  createdElectivePreferenceRecords,
  ElectiveState
} from './elective-reducers';
import { usePathname, useSearchParams } from 'next/navigation';
import { FilterType } from './elective-filter-reducers';
import { ElectivePreferenceDTO, StudentDTO } from '../api/dto-interfaces';

interface Props {
  // lessonCycleFocus: ElectiveDTO;
  // studentFocus: number;
  studentList: StudentDTO[];
  electivePreferenceList: ElectivePreferenceDTO[];
  // electiveAvailability: ElectiveAvailability;
  children: ReactNode;
  // yearGroupElectiveData: YearGroupElectives;
}

export default function ElectiveContextProvider({
  studentList,
  electivePreferenceList,
  children
}: Props) {
  const initialElectiveState: ElectiveState = {
    highlightedCourses: [],
    pinnedStudents: [],
    filterPending: false,
    filterType: FilterType.any,
    studentList,
    carouselId: 0,
    uuid: '',
    courseCarouselId: 0,
    electivePreferences: createdElectivePreferenceRecords(
      electivePreferenceList
    ),
    partyId: 0
  };
  const pathname = usePathname();

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
