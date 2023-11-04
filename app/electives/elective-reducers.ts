import { ElectivePreference } from './elective-subscriber-disclosure-group';
import { produce } from 'immer';
import { Student } from '../tables/student-table';
import { FilterType } from './elective-filter-reducers';
import { ca, gl } from 'date-fns/locale';

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

interface SetFilterType {
  type: 'setFilterType';
  filterType: FilterType;
}

interface SetFilterPending {
  type: 'setFilterPending';
  pending: boolean;
}

interface SetPinnedStudent {
  type: 'setPinnedStudent';
  id: number;
}

interface SetHighlightedCourses {
  type: 'setHighlightedCourses';
  id: string;
}

export type ElectiveStateActions =
  | SetCarousel
  | SetActive
  | FocusCourse
  | FocusStudent
  | SetFilterType
  | SetFilterPending
  | SetPinnedStudent
  | SetHighlightedCourses;

export type ElectiveState = {
  highlightedCourses: string[];
  pinnedStudents: Student[];
  filterPending: boolean;
  filterType: FilterType;
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
      const {
        carouselId: oldCarouselId,
        courseCarouselId: oldCourseCarouselId,
        courseId: oldCourseId
      } = electivesState;

      const carouselMatch = carouselId == oldCarouselId;
      const courseCarouselMatch = courseCarouselId == oldCourseCarouselId;
      const UUIDMatch = courseId == oldCourseId;

      const globalMatch = carouselMatch && courseCarouselMatch && UUIDMatch;

      return produce(electivesState, (draftState) => {
        draftState.carouselId = globalMatch ? -1 : carouselId;
        draftState.courseCarouselId = globalMatch ? -1 : courseCarouselId;
        draftState.courseId = globalMatch ? '' : courseId;
        draftState.filterPending = true;
      });
    }

    case 'focusStudent': {
      const { studentId } = action;

      return produce(electivesState, (draftState) => {
        draftState.partyId = studentId;
      });
    }

    case 'setFilterType': {
      const { filterType } = action;

      const updatedType =
        filterType == FilterType.all ? FilterType.any : FilterType.all;
      return produce(electivesState, (draftState) => {
        draftState.filterType = updatedType;
        draftState.filterPending = true;
      });
    }
    case 'setFilterPending': {
      const { pending } = action;
      return produce(electivesState, (updatedState) => {
        updatedState.filterPending = pending;
      });
    }

    case 'setPinnedStudent': {
      const { id } = action;
      const { pinnedStudents, studentList } = electivesState;

      const currentlyPinned =
        pinnedStudents && pinnedStudents.some((student) => student.id == id);

      return produce(electivesState, (updatedState) => {
        if (currentlyPinned) {
          updatedState.pinnedStudents = pinnedStudents.filter(
            (student) => student.id !== id
          );
        } else {
          const optionalStudent = studentList.find(
            (student) => student.id == id
          );
          optionalStudent && updatedState.pinnedStudents.push(optionalStudent);
        }
      });
    }
    case 'setHighlightedCourses': {
      const { id } = action;
      const { highlightedCourses } = electivesState;
      const currentlyHighlighted =
        highlightedCourses && highlightedCourses.some((course) => course == id);

      return produce(electivesState, (updatedState) => {
        if (currentlyHighlighted) {
          updatedState.highlightedCourses = highlightedCourses.filter(
            (course) => course != id
          );
        } else {
          updatedState.highlightedCourses.push(id);
        }
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
