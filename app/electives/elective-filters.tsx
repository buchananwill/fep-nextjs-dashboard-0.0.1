'use client';
import { Card, Text } from '@tremor/react';
import { FilterDropdown } from '../components/filter-dropdown';
import { useContext } from 'react';
import { ElectiveContext, ElectiveDispatchContext } from './elective-context';
import Union from '../components/union';
import Intersection from '../components/intersection';
import { FilterOption, FilterType } from './elective-filter-reducers';
import CommitChanges from './commit-changes';
import { PinButton, PinIcons } from '../components/pin-button';
import { ElectiveDTO } from '../api/dto-interfaces';

interface Props {
  electiveDTOList: ElectiveDTO[];
}

function createDistinctFilterOptions(
  electiveDTOList: ElectiveDTO[]
): FilterOption[] {
  if (!electiveDTOList) return [];

  const seenUuids = new Set<string>();

  return electiveDTOList
    .filter((electiveDTO) => {
      const { uuid } = electiveDTO;

      if (!seenUuids.has(uuid)) {
        seenUuids.add(uuid);
        return true;
      }
      return false;
    })
    .map(({ name, uuid }) => ({
      URI: uuid,
      label: name,
      operator: FilterType.all
    }));
}

export function ElectiveFilters({ electiveDTOList }: Props) {
  const { filterType, highlightedCourses } = useContext(ElectiveContext);
  const dispatch = useContext(ElectiveDispatchContext);

  const distinctCourses = createDistinctFilterOptions(electiveDTOList);

  function handleUnionIntersection(value: string) {
    dispatch({
      type: 'setFilterType',
      filterType: value
    });
  }

  function handleResetMortarBoards() {
    highlightedCourses.forEach((uuid) =>
      dispatch({
        type: 'setHighlightedCourses',
        id: uuid
      })
    );
  }

  return (
    <Card className="max-w-4xl my-0 p-4 flex flex-row justify-between sticky top-4 z-30">
      <Text className={'absolute top-1 left-2'}>Filters</Text>
      <FilterDropdown
        filterOptions={distinctCourses}
        filterReducerType={'setCourseFilters'}
        filterContextProperty={'courseFilters'}
      ></FilterDropdown>
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
        <PinButton
          pinIcon={PinIcons.mortarBoard}
          classNames={''}
          isPinned={false}
          setPinned={handleResetMortarBoards}
        ></PinButton>
      </div>
      <CommitChanges>Commit Changes</CommitChanges>
    </Card>
  );
}
