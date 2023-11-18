import { produce } from 'immer';
import { FilterType } from './elective-filter-reducers';
import { ca, gl } from 'date-fns/locale';
import {
  ElectiveDTO,
  ElectivePreferenceDTO,
  StudentDTO
} from '../api/dto-interfaces';

interface SetCarousel {
  type: 'setCarousel';
  studentId: number;
  preferencePosition: number;
  assignedCarouselOrdinal: number;
}

interface SetActive {
  type: 'setActive';
  studentId: number;
  preferencePosition: number;
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

export type ElectiveStateActions =
  | SetCarousel
  | SetActive
  | FocusCarouselOption
  | FocusStudent
  | SetFilterType
  | SetFilterPending
  | SetPinnedStudent
  | SetHighlightedCourses;

export type ElectiveState = {
  highlightedCourses: string[];
  pinnedStudents: Set<number>;
  filterPending: boolean;
  filterType: FilterType;
  studentMap: Map<number, StudentDTO>;
  carouselOptionId: number;
  electiveDtoMap: Map<string, ElectiveDTO>[];
  electivePreferences: Record<number, ElectivePreferenceDTO[]>;
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
      const uuid = electivePreferences[studentId][preferencePosition].uuid;
      const carousel = electiveDtoMap[assignedCarouselOrdinal];
      const electiveDto = carousel && carousel.get(uuid);

      return produce(electivesState, (draftUpdate) => {
        draftUpdate.electivePreferences[studentId][
          preferencePosition
        ].assignedCarouselOptionId = electiveDto ? electiveDto.id : -1;
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

    case 'focusCarouselOption': {
      const { carouselOptionId } = action;
      const { carouselOptionId: oldCarouselOptionId } = electivesState;

      const carouselOptionIdMatch = carouselOptionId == oldCarouselOptionId;

      return produce(electivesState, (draftState) => {
        draftState.carouselOptionId = carouselOptionIdMatch
          ? NaN
          : carouselOptionId;
        draftState.filterPending = true;
      });
    }

    case 'focusStudent': {
      const { studentId } = action;

      return produce(electivesState, (draftState) => {
        draftState.userRoleId = studentId;
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

    default: {
      throw Error('Unknown action: ' + action);
    }
  }
}

export function createElectivePreferenceRecords(
  electivePreferenceList: ElectivePreferenceDTO[]
) {
  const groupedByPartyId = electivePreferenceList.reduce<
    Record<number, ElectivePreferenceDTO[]>
  >((acc, curr) => {
    if (!acc[curr.userRoleId]) {
      acc[curr.userRoleId] = [];
    }

    acc[curr.userRoleId].push(curr);
    return acc;
  }, {});

  return groupedByPartyId;
}

export function createElectiveDtoMap(
  electiveDtoList: ElectiveDTO[]
): Map<string, ElectiveDTO>[] {
  let max = 0;
  for (let electiveDTO of electiveDtoList) {
    max = Math.max(electiveDTO.carouselOrdinal, max);
  }
  max++;
  const electiveDtoListMap: Map<string, ElectiveDTO>[] = [];
  for (let i = 0; i < max; i++) {
    electiveDtoListMap.push(new Map<string, ElectiveDTO>());
  }
  electiveDtoList.forEach((electiveDto) =>
    electiveDtoListMap[electiveDto.carouselOrdinal].set(
      electiveDto.uuid,
      electiveDto
    )
  );
  return electiveDtoListMap;
}
