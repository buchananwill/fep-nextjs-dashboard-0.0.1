import { produce } from 'immer';
import { FilterType } from './elective-filter-reducers';

import { ElectiveAvailability } from '../api/state-types';
import { StudentDTO } from '../api/dtos/StudentDTOSchema';
import { ElectivePreferenceDTO } from '../api/dtos/ElectivePreferenceDTOSchema';
import { ElectiveDTO } from '../api/dtos/ElectiveDTOSchema';

interface SetCarousel {
  type: 'setCarousel';
  studentId: number;
  preferencePosition: number; // one-indexed
  assignedCarouselOrdinal: number; // one-indexed
}

interface SetActive {
  type: 'setActive';
  studentId: number;
  preferencePosition: number; // one-indexed
}

interface FocusCarouselOption {
  type: 'focusCarouselOption';
  carouselOptionId: number;
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

interface SetFilteredStudents {
  type: 'setFilteredStudents';
  filteredStudents: StudentDTO[];
}

export interface UpdateElectivePreference {
  type: 'updateElectivePreference';
  electivePreference: ElectivePreferenceDTO;
}

export interface ClearModifications {
  type: 'clearModifications';
}

export type ElectiveStateActions =
  | SetCarousel
  | SetActive
  | FocusCarouselOption
  | FocusStudent
  | SetFilterType
  | SetFilterPending
  | SetPinnedStudent
  | SetHighlightedCourses
  | SetFilteredStudents
  | UpdateElectivePreference
  | ClearModifications;

export type ElectiveState = {
  highlightedCourses: string[];
  pinnedStudents: Set<number>;
  filteredStudents: StudentDTO[];
  filterPending: boolean;
  filterType: FilterType;
  studentMap: Map<number, StudentDTO>;
  carouselOptionIdSet: Set<number>;
  electiveDtoMap: Map<string, ElectiveDTO>[];
  electiveAvailability: ElectiveAvailability;
  electivePreferences: Map<number, ElectivePreferenceDTO[]>;
  // TODO Currently stores the preference position, but should really store the actual ID of the preference.
  modifiedPreferences: Map<number, Set<number>>;
  userRoleId: number;
};

export default function electivePreferencesReducer(
  electivesState: ElectiveState,
  action: ElectiveStateActions
) {
  switch (action.type) {
    case 'setCarousel': {
      const { studentId, preferencePosition, assignedCarouselOrdinal } = action;

      const { electiveDtoMap, electivePreferences } = electivesState;
      const preferenceList = electivePreferences.get(studentId);
      if (!preferenceList) return electivesState;
      const { courseId } = preferenceList[preferencePosition - 1];
      const carousel = electiveDtoMap[assignedCarouselOrdinal - 1];
      const electiveDto = carousel && carousel.get(courseId);

      return produce(electivesState, (draftUpdate) => {
        const preferencesListToUpdate =
          draftUpdate.electivePreferences.get(studentId);
        if (preferencesListToUpdate) {
          preferencesListToUpdate[
            preferencePosition - 1
          ].assignedCarouselOptionId = electiveDto ? electiveDto.id : -1;
          draftUpdate.modifiedPreferences
            .get(studentId)
            ?.add(preferencePosition);
        }
      });
    }
    case 'setActive': {
      const { studentId, preferencePosition } = action;

      return produce(electivesState, (draftElectiveState) => {
        const mutablePreferencesList =
          draftElectiveState.electivePreferences.get(studentId);
        if (mutablePreferencesList) {
          mutablePreferencesList[preferencePosition - 1].active =
            !mutablePreferencesList[preferencePosition - 1].active;
          draftElectiveState.modifiedPreferences
            .get(studentId)
            ?.add(preferencePosition);
        }
      });
    }

    case 'focusCarouselOption': {
      const { carouselOptionId } = action;
      const { carouselOptionIdSet: oldCarouselOptionIdSet } = electivesState;
      console.log(carouselOptionId, oldCarouselOptionIdSet);
      const carouselOptionIdMatch =
        oldCarouselOptionIdSet.has(carouselOptionId);

      return produce(electivesState, (draftState) => {
        if (!carouselOptionIdMatch)
          draftState.carouselOptionIdSet.add(carouselOptionId);
        else draftState.carouselOptionIdSet.delete(carouselOptionId);
        draftState.filterPending = true;
      });
    }

    case 'focusStudent': {
      const { studentId } = action;

      const isCurrentFocus = electivesState.userRoleId == studentId;

      return produce(electivesState, (draftState) => {
        draftState.userRoleId = isCurrentFocus ? NaN : studentId;
      });
    }

    case 'setFilterType': {
      const { filterType } = action;
      console.log('received type:', filterType);
      const updatedType =
        filterType == FilterType.all ? FilterType.any : FilterType.all;
      return produce(electivesState, (draftState) => {
        draftState.filterType = filterType;
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
      const { pinnedStudents, studentMap } = electivesState;

      const currentlyPinned = pinnedStudents && pinnedStudents.has(id);

      return produce(electivesState, (updatedState) => {
        if (currentlyPinned) {
          updatedState.pinnedStudents.delete(id);
        } else {
          const optionalStudent = studentMap.get(id);
          optionalStudent &&
            updatedState.pinnedStudents.add(optionalStudent.id);
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
    case 'setFilteredStudents': {
      const { filteredStudents } = action;
      return produce(electivesState, (draftState) => {
        draftState.filteredStudents = filteredStudents;
      });
    }
    case 'updateElectivePreference': {
      const { electivePreference } = action;
      const { userRoleId, preferencePosition } = electivePreference;
      return produce(electivesState, (updatedState) => {
        const preferenceList = updatedState.electivePreferences.get(userRoleId);
        if (preferenceList) {
          preferenceList[preferencePosition - 1] = electivePreference; // convert from one-indexed to zero-indexed
        }
      });
    }
    case 'clearModifications': {
      return produce(electivesState, (draft) => {
        for (let modifiedPreference of draft.modifiedPreferences) {
          modifiedPreference[1].clear();
        }
      });
    }

    default: {
      throw Error('Unknown action: ' + action);
    }
  }
}

function setModifiedPreference(
  preference: ElectivePreferenceDTO,
  modifiedList: ElectivePreferenceDTO[]
): ElectivePreferenceDTO[] {
  if (modifiedList.length == 0) return [preference];
  let changed = false;
  const responseList = [];
  for (let nextPreference of modifiedList) {
    const { preferencePosition, userRoleId } = preference;
    const { preferencePosition: nextPref, userRoleId: nextId } = nextPreference;
    if (preferencePosition == nextPref && userRoleId == nextId) {
      responseList.push(preference);
      changed = true;
    } else responseList.push(nextPreference);
  }
  if (!changed) {
    responseList.push(preference);
  }
  return responseList;
}
