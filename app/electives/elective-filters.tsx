'use client';
import { Card, Text } from '@tremor/react';

import { useContext } from 'react';
import { ElectiveContext, ElectiveDispatchContext } from './elective-context';

import { FilterType } from './elective-filter-reducers';
import CommitChanges from './commit-changes';

import { FilterOption } from '../api/state-types';
import { ElectiveFilterDispatchContext } from './elective-filter-context';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '../generic/components/tooltips/tooltip';
import TooltipsContext from '../generic/components/tooltips/tooltips-context';
import { StandardTooltipContentOld } from '../generic/components/tooltips/standard-tooltip-content-old';
import { ElectiveDTO } from '../api/dtos/ElectiveDTOSchema';
import { FilterDropdown } from '../generic/components/dropdown/filter-dropdown';
import Union from '../generic/components/swaps/union';
import Intersection from '../generic/components/swaps/intersection';
import {
  FillableButton,
  PinIcons
} from '../generic/components/buttons/fillable-button';

interface Props {
  electiveDTOList: ElectiveDTO[];
}

function createDistinctFilterOptions(
  electiveDTOList: ElectiveDTO[]
): FilterOption<string>[] {
  if (!electiveDTOList) return [];

  const seenUuids = new Set<string>();

  return electiveDTOList
    .filter((electiveDTO) => {
      const { courseId } = electiveDTO;

      if (!seenUuids.has(courseId)) {
        seenUuids.add(courseId);
        return true;
      }
      return false;
    })
    .map(({ name, courseId }) => ({
      URI: courseId,
      label: name,
      operator: FilterType.all
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function ElectiveFilters({ electiveDTOList }: Props) {
  const { filterType, highlightedCourses } = useContext(ElectiveContext);
  const dispatch = useContext(ElectiveDispatchContext);
  useContext(ElectiveFilterDispatchContext);
  const distinctCourses = createDistinctFilterOptions(electiveDTOList);

  const { showTooltips } = useContext(TooltipsContext);

  function handleUnionIntersection(value: FilterType) {
    console.log('dispatching filtertype...', value);
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
    <Card className="max-w-5xl my-0 p-2 flex flex-row justify-between sticky top-4 z-30 select-none">
      <Tooltip enabled={showTooltips}>
        <TooltipTrigger>
          <FilterDropdown
            filterOptions={distinctCourses}
            filterReducerType={'setCourseFilters'}
            filterContextProperty={'courseFilters'}
          ></FilterDropdown>
        </TooltipTrigger>
        <TooltipContent>
          <StandardTooltipContentOld>
            Select <strong>course</strong> types to filter students.
          </StandardTooltipContentOld>
        </TooltipContent>
      </Tooltip>
      <Tooltip enabled={showTooltips}>
        <TooltipTrigger>
          <label className="ml-2 w-32 relative cursor-pointer font-mono">
            <input
              type={'checkbox'}
              className={'pointer-events-none absolute opacity-0 '}
              checked={filterType === FilterType.any}
              onChange={() => {
                console.log('Setting filtertype');
                handleUnionIntersection(
                  filterType === FilterType.any
                    ? FilterType.all
                    : FilterType.any
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
        </TooltipTrigger>
        <TooltipContent>
          <StandardTooltipContentOld>
            <p>
              <strong>All: </strong> filter students enrolled in all selected
              course types.
            </p>
            <p>
              <strong>Any: </strong>filter students enrolled in any of the
              selected course types.
            </p>
          </StandardTooltipContentOld>
        </TooltipContent>
      </Tooltip>
      <div className="flex flew-row items-center">
        <Text className="mr-2">Reset: </Text>
        <Tooltip enabled={showTooltips}>
          <TooltipTrigger>
            <FillableButton
              pinIcon={PinIcons.mortarBoard}
              className={''}
              isPinned={false}
              setPinned={handleResetMortarBoards}
              id={`reset-highlighted-mortar-boards`}
            ></FillableButton>
          </TooltipTrigger>
          <TooltipContent>
            <StandardTooltipContentOld>
              Reset highlighted mortar boards.
            </StandardTooltipContentOld>
          </TooltipContent>
        </Tooltip>
      </div>
      <CommitChanges>Commit Changes</CommitChanges>
    </Card>
  );
}
