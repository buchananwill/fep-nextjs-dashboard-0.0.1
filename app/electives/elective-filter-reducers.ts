import { produce } from 'immer';
import { FilterOption } from '../components/filter-dropdown';
import { Student } from '../tables/student-table';

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

      console.log('Setting filters again: ', entryList);

      return produce(electiveFilterState, (draftState) => {
        draftState.courseFilters = entryList;
      });
    }

    default: {
      throw Error('Unkown action: ' + action);
    }
  }
}
