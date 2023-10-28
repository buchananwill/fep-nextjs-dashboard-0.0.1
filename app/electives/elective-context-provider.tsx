'use client';

import { ReactNode, useReducer } from 'react';
import {
  ElectivesContext,
  ElectivesDispatchContext
} from './electives-context';
import { ElectivePreference } from './elective-subscriber-accordion';

import electiveStateReducer, {
  createdElectivePreferenceRecords,
  ElectiveState
} from './elective-reducers';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { YearGroupElectives } from './[yearGroup]/page';

interface Props {
  // lessonCycleFocus: ElectiveDTO;
  // studentFocus: number;
  // studentList: Student[];
  electivePreferenceList: ElectivePreference[];
  // electiveAvailability: ElectiveAvailability;
  children: ReactNode;
  yearGroupElectiveData: YearGroupElectives;
}

export default function ElectivesContextProvider({
  yearGroupElectiveData,
  electivePreferenceList,
  children
}: Props) {
  const initialElectiveState: ElectiveState = {
    courseFilters: [],
    courseCarouselFilters: [],
    pinnedStudents: [],
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
    <ElectivesContext.Provider value={electiveState}>
      <ElectivesDispatchContext.Provider value={dispatch}>
        {children}
      </ElectivesDispatchContext.Provider>
    </ElectivesContext.Provider>
  );
}
