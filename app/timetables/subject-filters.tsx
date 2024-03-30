'use client';
import { Card, Text } from '@tremor/react';
import { useContext } from 'react';

import { LessonCycle } from '../api/state-types';
import {
  TimetablesContext,
  TimetablesDispatchContext
} from './timetables-context';
import { SubjectFilterDropdown } from './subject-filter-dropdown';
import Union from '../generic/components/swaps/union';
import Intersection from '../generic/components/swaps/intersection';
import {
  FillableButton,
  PinIcons
} from '../generic/components/buttons/fillable-button';
import { FilterType } from '../electives/elective-filter-reducers';

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
  const { filterType } = useContext(TimetablesContext);
  const dispatch = useContext(TimetablesDispatchContext);

  const distinctCourses = createDistinctFilterOptions(lessonCycleList);

  function handleUnionIntersection(value: string) {
    dispatch({
      type: 'setFilterType',
      filterType: value
    });
  }

  function handleResetMortarBoards() {
    dispatch({
      type: 'setHighlightedSubjects',
      subjects: []
    });
  }

  return (
    <Card className="max-w-5xl my-0 p-4 flex flex-row justify-between sticky top-4 z-30 select-none">
      <Text className={'absolute top-1 left-2'}>Filters</Text>
      <SubjectFilterDropdown
        filterOptions={distinctCourses}
        filterReducerType={'setHighlightedSubjects'}
      ></SubjectFilterDropdown>
      <label className="ml-2 w-32 relative cursor-pointer font-mono">
        <input
          type={'checkbox'}
          className={'pointer-events-none absolute opacity-0 '}
          checked={filterType === FilterType.any}
          onChange={() => {
            console.log('Setting filtertype');
            handleUnionIntersection(
              filterType === FilterType.any ? FilterType.all : FilterType.any
            );
          }}
        />

        {filterType === FilterType.any ? (
          <Union size={48}>
            <span>Match {filterType}</span>
          </Union>
        ) : (
          <Intersection size={48}>
            <span>Match {filterType}</span>
          </Intersection>
        )}
      </label>
      <div className="flex flew-row items-center">
        <Text className="mr-2">Reset: </Text>
        <FillableButton
          pinIcon={PinIcons.mortarBoard}
          className={''}
          isPinned={false}
          setPinned={handleResetMortarBoards}
          id={`courses:clear-highlighted`}
        ></FillableButton>
      </div>
      {/*<CommitChanges>Commit Changes</CommitChanges>*/}
    </Card>
  );
}
