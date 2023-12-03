'use client';
import { Card, Text } from '@tremor/react';
import { FilterDropdown } from '../components/filter-dropdown';
import { useContext } from 'react';

import Union from '../components/union';
import Intersection from '../components/intersection';

import { FillableButton, PinIcons } from '../components/fillable-button';
import { FilterOption, LessonCycle } from '../api/state-types';
import { FilterType } from '../electives/elective-filter-reducers';
import {
  TimetablesContext,
  TimetablesDispatchContext
} from './timetables-context';
import { SubjectFilterDropdown } from './subject-filter-dropdown';

interface Props {
  lessonCycleList: LessonCycle[];
}

function createDistinctFilterOptions(lessonCycleList: LessonCycle[]): string[] {
  if (!lessonCycleList) return [];

  const seenSubjects = new Set<string>();

  return lessonCycleList
    .filter((lessonCycle) => {
      const { subject } = lessonCycle;

      if (!seenSubjects.has(subject)) {
        seenSubjects.add(subject);
        return true;
      }
      return false;
    })
    .map(({ subject }) => subject)
    .sort((a, b) => a.localeCompare(b));
}

export function SubjectFilters({ lessonCycleList }: Props) {
  const { filterType, highlightedSubjects } = useContext(TimetablesContext);
  const dispatch = useContext(TimetablesDispatchContext);

  const distinctCourses = createDistinctFilterOptions(lessonCycleList);

  function handleUnionIntersection(value: string) {
    dispatch({
      type: 'setFilterType',
      filterType: value
    });
  }

  function handleResetMortarBoards() {
    highlightedSubjects.forEach((subject) =>
      dispatch({
        type: 'setHighlightedSubjects',
        id: subject
      })
    );
  }

  return (
    <Card className="max-w-5xl my-0 p-4 flex flex-row justify-between sticky top-4 z-30 select-none">
      <Text className={'absolute top-1 left-2'}>Filters</Text>
      <SubjectFilterDropdown
        filterOptions={distinctCourses}
        filterReducerType={'setHighlightedSubjects'}
      ></SubjectFilterDropdown>
      <label className="swap ml-2 w-32">
        <input
          type={'checkbox'}
          className="inline w-32"
          value={filterType}
          onChange={(e) => handleUnionIntersection(e.target.value)}
        />
        <div className="swap-off ">
          <Union size={48} className={''}>
            <span>Match {filterType}</span>
          </Union>
        </div>
        <div className="swap-on">
          <Intersection size={48} className={''}>
            <span>Match {filterType}</span>
          </Intersection>
        </div>
      </label>
      <div className="flex flew-row items-center">
        <Text className="mr-2">Reset: </Text>
        <FillableButton
          pinIcon={PinIcons.mortarBoard}
          className={''}
          isPinned={false}
          setPinned={handleResetMortarBoards}
        ></FillableButton>
      </div>
      {/*<CommitChanges>Commit Changes</CommitChanges>*/}
    </Card>
  );
}
