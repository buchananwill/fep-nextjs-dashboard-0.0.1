import { ElectivePreference } from './elective-subscriber-accordion';
import { produce } from 'immer';
import { FilterOption } from '../components/filter-dropdown';
import { Student } from '../tables/student-table';

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

interface FocusStudent {
  type: 'focusStudent';
  studentId: number;
}

export type ElectiveStateActions =
  | SetCarousel
  | SetActive
  | FocusCourse
  | FocusStudent;

export type ElectiveState = {
  studentList: Student[];
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
