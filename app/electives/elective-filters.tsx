'use client';
import { Card, Text } from '@tremor/react';
import { FilterDropdown } from '../components/dropdown/filter-dropdown';
import { useContext } from 'react';
import { ElectiveContext, ElectiveDispatchContext } from './elective-context';
import Union from '../components/union';
import Intersection from '../components/intersection';
import { FilterType } from './elective-filter-reducers';
import CommitChanges from './commit-changes';
import { FillableButton, PinIcons } from '../components/fillable-button';

import { FilterOption } from '../api/state-types';
import {
  ElectiveFilterContext,
  ElectiveFilterDispatchContext
} from './elective-filter-context';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '../components/tooltips/tooltip';
import TooltipsContext from '../components/tooltips/tooltips-context';
import { StandardTooltipContentOld } from '../components/tooltips/standard-tooltip-content-old';
import { ElectiveDTO } from '../api/dtos/ElectiveDTOSchema';

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
  const filterDispatch = useContext(ElectiveFilterDispatchContext);

  const distinctCourses = createDistinctFilterOptions(electiveDTOList);

  const { showTooltips } = useContext(TooltipsContext);

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
