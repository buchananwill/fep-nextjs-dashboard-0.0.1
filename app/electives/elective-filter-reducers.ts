import { produce } from 'immer';

import { ElectivePreferenceDTO } from '../api/dto-interfaces';
import { FilterOption } from '../api/state-types';

export interface Filter<T> {
  apply(setOfElements: T): T;
}

export enum FilterType {
  all = 'all',
  any = 'any'
}

export interface SetCourseFilters {
  type: 'setCourseFilters';
  entryList: FilterOption<string>[];
}
export interface SetCourseCarouselFilters {
  type: 'setCourseCarouselFilters';
  entryList: FilterOption<string>[];
}
export interface SetStudentFilters {
  type: 'setStudentFilters';
  entryList: FilterOption<number>[];
}

export type ElectiveFilterStateActions =
  | SetStudentFilters
  | SetCourseCarouselFilters
  | SetCourseFilters;

export type ElectiveFilterState = {
  courseFilters: FilterOption<string>[];
  courseCarouselFilters: FilterOption<string>[];
  studentFilters: FilterOption<number>[];
};

export default function electiveFilterReducer(
  electiveFilterState: ElectiveFilterState,
  action: ElectiveFilterStateActions
) {
  switch (action.type) {
    case 'setCourseFilters': {
      const { entryList } = action;

      return produce(electiveFilterState, (draftState) => {
        draftState.courseFilters = entryList;
      });
    }

    default: {
      throw Error('Unknown action: ' + action);
    }
  }
}

interface CourseFilter extends Filter<Record<string, ElectivePreferenceDTO[]>> {
  URI: string;
  label: string;
  filterType: FilterType;
}

function createCourseFilter(filterOption: FilterOption<string>): CourseFilter {
  return {
    URI: filterOption.URI,
    label: filterOption.label,
    filterType: filterOption.operator,
    apply: function (
      record: Record<string, ElectivePreferenceDTO[]>
    ): Record<string, ElectivePreferenceDTO[]> {
      const filteredSet: Record<string, ElectivePreferenceDTO[]> = {};
      for (let electivePreferencesKey in record) {
        const numericKey = parseInt(electivePreferencesKey);
        const nextStudentPrefs = record[numericKey];

        const foundStudent = nextStudentPrefs.some((electivePreference) => {
          let { courseId, isActive } = electivePreference;
          return isActive && this.URI == courseId;
        });

        if (foundStudent) {
          filteredSet[electivePreferencesKey] = nextStudentPrefs;
        }
      }
      return filteredSet;
    }
  };
}
