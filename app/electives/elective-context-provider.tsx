'use client';

import { ReactNode, useReducer } from 'react';
import { ElectiveContext, ElectiveDispatchContext } from './elective-context';
import { ElectivePreference } from './elective-subscriber-accordion';

import electiveStateReducer, {
  createdElectivePreferenceRecords,
  ElectiveState
} from './elective-reducers';
import { usePathname, useSearchParams } from 'next/navigation';
import { Student } from '../tables/student-table';
import { FilterType } from './elective-filter-reducers';

interface Props {
  // lessonCycleFocus: ElectiveDTO;
  // studentFocus: number;
  studentList: Student[];
  electivePreferenceList: ElectivePreference[];
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
    courseId: '',
    courseCarouselId: 0,
    electivePreferences: createdElectivePreferenceRecords(
      electivePreferenceList
    ),
    partyId: 0
  };
  const pathname = usePathname();

  const searchParams = useSearchParams();

  const courseCarouselIdStr = searchParams?.get('courseCarouselId');
  const courseIdStr = searchParams?.get('courseId');
  const partyIdStr = searchParams?.get('partyId');

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
