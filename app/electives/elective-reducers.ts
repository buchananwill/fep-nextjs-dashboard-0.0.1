import { ElectivePreference } from './elective-subscriber-accordion';
import { produce } from 'immer';
import { FilterOption } from '../components/filter-dropdown';

interface SetCarousel {
  type: 'setCarousel';
  studentId: number;
  preferencePosition: number;
  assignedCarouselId: number;
}

interface SetActive {
  type: 'setActive';
  studentId: number;
  preferencePosition: number;
}

interface FocusCourse {
  type: 'focusCourse';
  carouselId: number;
  courseCarouselId: number;
  courseId: string;
}

export interface SetCourseFilters {
  type: 'setCourseFilters';
  entryList: FilterOption[];
}

interface FocusStudent {
  type: 'focusStudent';
  studentId: number;
}

export type ElectiveStateActions =
  | SetCarousel
  | SetActive
  | FocusCourse
  | FocusStudent
  | SetCourseFilters;

export type ElectiveState = {
  courseFilters: FilterOption[];
  courseCarouselFilters: { courseUUID: string; carouselId: string }[];
  pinnedStudents: number[];
  carouselId: number;
  courseId: string;
  courseCarouselId: number;
  electivePreferences: Record<number, ElectivePreference[]>;
  partyId: number;
};

export default function electivePreferencesReducer(
  electivesState: ElectiveState,
  action: ElectiveStateActions
) {
  switch (action.type) {
    case 'setCarousel': {
      const { studentId, preferencePosition, assignedCarouselId } = action;

      return produce(electivesState, (draftUpdate) => {
        draftUpdate.electivePreferences[studentId][
          preferencePosition
        ].assignedCarouselId = assignedCarouselId;
      });
    }
    case 'setActive': {
      const { studentId, preferencePosition } = action;

      return produce(electivesState, (draftElectiveState) => {
        draftElectiveState.electivePreferences[studentId][
          preferencePosition
        ].isActive =
          !draftElectiveState.electivePreferences[studentId][preferencePosition]
            .isActive;
      });
    }

    case 'focusCourse': {
      const { carouselId, courseCarouselId, courseId } = action;

      return produce(electivesState, (draftState) => {
        draftState.carouselId = carouselId;
        draftState.courseCarouselId = courseCarouselId;
        draftState.courseId = courseId;
      });
    }

    case 'focusStudent': {
      const { studentId } = action;

      return produce(electivesState, (draftState) => {
        draftState.partyId = studentId;
      });
    }
    case 'setCourseFilters': {
      const { entryList } = action;

      console.log('Setting filters again: ', entryList);

      return produce(electivesState, (draftState) => {
        draftState.courseFilters = entryList;
      });
    }

    default: {
      throw Error('Unkown action: ' + action);
    }
  }
}

export function createdElectivePreferenceRecords(
  electivePreferenceList: ElectivePreference[]
) {
  const groupedByPartyId = electivePreferenceList.reduce<
    Record<number, ElectivePreference[]>
  >((acc, curr) => {
    if (!acc[curr.partyId]) {
      acc[curr.partyId] = [];
    }

    acc[curr.partyId].push(curr);
    return acc;
  }, {});

  return groupedByPartyId;
}
