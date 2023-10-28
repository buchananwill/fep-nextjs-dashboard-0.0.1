'use client';
import { Card, Text } from '@tremor/react';
import { FilterDropdown, FilterOption } from '../components/filter-dropdown';
import { useContext } from 'react';
import {
  ElectivesContext,
  ElectivesDispatchContext
} from './electives-context';
import { ElectiveDTO } from './elective-card';
import { type } from 'os';

interface Props {
  electiveDTOList: ElectiveDTO[];
}

function aggregateDistinctCourses(
  electiveDTOList: ElectiveDTO[]
): FilterOption[] {
  if (!electiveDTOList) return [];

  const seenCourseUUIDs = new Set<string>();

  return electiveDTOList
    .filter((electiveDTO) => {
      const { courseUUID } = electiveDTO;

      if (!seenCourseUUIDs.has(courseUUID)) {
        seenCourseUUIDs.add(courseUUID);
        return true;
      }
      return false;
    })
    .map(({ courseDescription, courseUUID }) => ({
      URI: courseUUID,
      label: courseDescription
    }));
}

export function ElectiveFilters({ electiveDTOList }: Props) {
  const electiveContext = useContext(ElectivesContext);
  const dispatch = useContext(ElectivesDispatchContext);

  const distinctCourses = aggregateDistinctCourses(electiveDTOList);

  const handleSelectionClick = (selections: string[]) => {
    console.log(selections);
  };

  return (
    <Card className="max-w-fit m-0 p-4">
      <Text className={'absolute top-1 left-2'}>Filters</Text>
      <FilterDropdown
        filterOptions={distinctCourses}
        filterReducerType={'setCourseFilters'}
        contextProperty={'courseFilters'}
      ></FilterDropdown>
    </Card>
  );
}
