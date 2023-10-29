'use client';
import { Card, Text } from '@tremor/react';
import { FilterDropdown } from '../components/filter-dropdown';
import { useContext } from 'react';
import { ElectiveContext, ElectiveDispatchContext } from './elective-context';
import { ElectiveDTO } from './elective-card';
import Union from '../components/union';
import Intersection from '../components/intersection';
import { FilterOption, FilterType } from './elective-filter-reducers';

interface Props {
  electiveDTOList: ElectiveDTO[];
}

function createDistinctFilterOptions(
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
      label: courseDescription,
      operator: FilterType.all
    }));
}

export function ElectiveFilters({ electiveDTOList }: Props) {
  const { filterType } = useContext(ElectiveContext);
  const dispatch = useContext(ElectiveDispatchContext);

  const distinctCourses = createDistinctFilterOptions(electiveDTOList);

  function handleUnionIntersection(value: string) {
    dispatch({
      type: 'setFilterType',
      filterType: value
    });
  }

  return (
    <Card className="max-w-fit my-0 p-4 flex flex-row">
      <Text className={'absolute top-1 left-2'}>Filters</Text>
      <FilterDropdown
        filterOptions={distinctCourses}
        filterReducerType={'setCourseFilters'}
        filterContextProperty={'courseFilters'}
      ></FilterDropdown>
      <label className="swap ml-2 w-16 justify-end">
        <input
          type={'checkbox'}
          className="inline "
          value={filterType}
          onChange={(e) => handleUnionIntersection(e.target.value)}
        />
        <div className="swap-off">
          <Union size={30} className={''}>
            {filterType}
          </Union>
        </div>
        <div className="swap-on">
          <Intersection size={30} className={''}>
            {filterType}
          </Intersection>
        </div>
      </label>
    </Card>
  );
}
