import { produce } from 'immer';
import {
  Filter,
  FilterOption,
  FilterType
} from '../components/filter-dropdown';
import { ElectiveDTO } from './elective-card';
import { ElectivePreference } from './elective-subscriber-accordion';

export interface SetCourseFilters {
  type: 'setCourseFilters';
  entryList: FilterOption[];
}
export interface SetCourseCarouselFilters {
  type: 'setCourseCarouselFilters';
  entryList: FilterOption[];
}
export interface SetStudentFilters {
  type: 'setStudentFilters';
  entryList: FilterOption[];
}

export type ElectiveFilterStateActions =
  | SetStudentFilters
  | SetCourseCarouselFilters
  | SetCourseFilters;

export type ElectiveFilterState = {
  courseFilters: FilterOption[];
  courseCarouselFilters: FilterOption[];
  studentFilters: FilterOption[];
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
      throw Error('Unkown action: ' + action);
    }
  }
}

interface CourseFilter extends Filter<Record<string, ElectivePreference[]>> {
  URI: string;
  label: string;
  filterType: FilterType;
}

function createCourseFilter(filterOption: FilterOption): CourseFilter {
  return {
    URI: filterOption.URI,
    label: filterOption.label,
    filterType: filterOption.operator,
    apply: function (
      record: Record<string, ElectivePreference[]>
    ): Record<string, ElectivePreference[]> {
      const filteredSet: Record<string, ElectivePreference[]> = {};
      for (let electivePreferencesKey in record) {
        const numericKey = parseInt(electivePreferencesKey);
        const nextStudentPrefs = record[numericKey];

        const foundStudent = nextStudentPrefs.some((electivePreference) => {
          let { courseUUID, isActive } = electivePreference;
          return isActive && this.URI == courseUUID;
        });

        if (foundStudent) {
          filteredSet[electivePreferencesKey] = nextStudentPrefs;
        }
      }
      return filteredSet;
    }
  };
}
