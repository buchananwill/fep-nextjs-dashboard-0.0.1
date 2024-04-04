'use client';
import { Badge } from '@nextui-org/badge';
import { Chip } from '@nextui-org/chip';
import React, { useContext, useEffect, useState, useTransition } from 'react';
import { ElectiveContext, ElectiveDispatchContext } from './elective-context';
import { ElectiveState } from './elective-reducers';

import { ElectiveFilterContext } from './elective-filter-context';

import { FilterOption } from '../api/state-types';
import TooltipsContext from '../generic/components/tooltips/tooltips-context';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '../generic/components/tooltips/tooltip';
import { StandardTooltipContentOld } from '../generic/components/tooltips/standard-tooltip-content-old';
import { ElectiveDTO } from '../api/dtos/ElectiveDTOSchema';
import { ElectivePreferenceDTO } from '../api/dtos/ElectivePreferenceDTOSchema';
import { CellDataTransformer } from '../generic/components/tables/dynamic-dimension-timetable';
import InteractiveTableCard from '../generic/components/tables/interactive-table-card';
import {
  FillableButton,
  PinIcons
} from '../generic/components/buttons/fillable-button';
import { PendingOverlay } from '../generic/components/overlays/pending-overlay';

const aLevelClassLimitInt = 25;

const calculateSubscribers = (
  electiveDTO: ElectiveDTO,
  electivePreferences: Map<number, ElectivePreferenceDTO[]>
) => {
  const { id } = electiveDTO;

  let count = 0;
  for (let preferenceList of electivePreferences.values()) {
    for (let electivePreference of preferenceList) {
      if (
        electivePreference.active &&
        electivePreference.assignedCarouselOptionId == id
      )
        count++;
    }
  }
  return count;
};

const getBorderVisible = (
  electiveState: ElectiveState,
  carouselOptionId: number
) => {
  const { userRoleId } = electiveState;
  return electiveState.electivePreferences
    .get(userRoleId)
    ?.some(
      (electivePreference) =>
        electivePreference.active &&
        electivePreference.assignedCarouselOptionId == carouselOptionId
    )
    ? ''
    : 'border-transparent';
};

function getHighlighted(highlightedCourses: string[], uuid: string) {
  const isHighlighted =
    highlightedCourses && highlightedCourses.some((course) => course == uuid);
  return isHighlighted ? 'text-red-500' : '';
}

function getFiltered(courseFilters: FilterOption<string>[], uuid: string) {
  return courseFilters.some((courseFilter) => courseFilter.URI == uuid);
}

const ElectiveCard: CellDataTransformer<ElectiveDTO> = ({ data }) => {
  const { name, carouselOrdinal, id, courseId } = data;
  const { showTooltips } = useContext(TooltipsContext);

  const [subscribers, setSubscribers] = useState(0);
  const [borderVisible, setBorderVisible] = useState('border-transparent');
  const subscribersColor = getSubscribersColor(subscribers);
  const isEnabled = subscribers > 0;

  const [isPending, startTransition] = useTransition();
  const electivesState = useContext(ElectiveContext);
  const { courseFilters } = useContext(ElectiveFilterContext);
  const dispatch = useContext(ElectiveDispatchContext);
  const {
    carouselOptionIdSet,
    highlightedCourses,
    electivePreferences,
    studentMap
  } = electivesState;

  let yearInt = 0;
  for (let value of studentMap.values()) {
    if (value.yearGroup) {
      yearInt = value.yearGroup;
      break;
    }
  }

  useEffect(() => {
    const updatedSubscribers = calculateSubscribers(data, electivePreferences);
    setSubscribers(updatedSubscribers);
  }, [data, electivePreferences]);

  function handleCardClick(carouselOptionId: number) {
    startTransition(() => {
      dispatch({
        type: 'focusCarouselOption',
        carouselOptionId: carouselOptionId
      });
    });
  }

  function handleMortarBoardClick(id: string) {
    dispatch({
      type: 'setHighlightedCourses',
      id: id
    });
  }

  useEffect(() => {
    const borderNowVisible = getBorderVisible(electivesState, id);
    setBorderVisible(borderNowVisible);
  }, [electivesState, carouselOrdinal, id]);

  const opacity = getOpacity(isEnabled);

  const highlightText = getHighlighted(highlightedCourses, courseId);

  const classSizeLimit = yearInt == 9 ? 30 : aLevelClassLimitInt;

  const numberOfClasses = Math.ceil(subscribers / classSizeLimit);

  const classesColor = getClassesColor(numberOfClasses);

  const additionalClassNames = [
    `opacity-${opacity}`,
    borderVisible,
    carouselOptionIdSet.has(id) ? 'bg-emerald-100' : '',
    'w-48'
  ];
  return (
    <InteractiveTableCard additionalClassNames={additionalClassNames}>
      <div
        className={'w-full h-full flex grow items-center relative gap-0.5 px-1'}
      >
        <div
          className={
            'flex absolute w-full h-full top-0 right-0 z-10 pointer-events-none'
          }
        >
          <Badge
            content={''}
            color={'success'}
            size={'sm'}
            placement={'top-right'}
            isInvisible={!getFiltered(courseFilters, courseId)}
          >
            <div></div>
          </Badge>
        </div>
        <div className={'grow relative rounded-md overflow-hidden'}>
          <PendingOverlay pending={isPending} />
          <Tooltip enabled={showTooltips}>
            <TooltipTrigger>
              <div
                className="px-0 py-3 cursor-pointer grow  text-xs  truncate ..."
                onClick={() => {
                  handleCardClick(id);
                }}
              >
                {name}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <StandardTooltipContentOld>
                <p>
                  Click the<strong> subject name </strong> to filter students
                  taking this course.
                </p>{' '}
              </StandardTooltipContentOld>
            </TooltipContent>
          </Tooltip>
        </div>

        <Tooltip enabled={showTooltips}>
          <TooltipTrigger className="m-0 outline-0 border-o">
            <FillableButton
              pinIcon={PinIcons.mortarBoard}
              className={`${highlightText} `}
              isPinned={highlightText != ''}
              setPinned={() => handleMortarBoardClick(courseId)}
              id={`course:highlight-matching:${courseId}`}
            ></FillableButton>
          </TooltipTrigger>
          <TooltipContent className="">
            <StandardTooltipContentOld>
              <p>
                Click the <strong> mortar board </strong> to show the locations
                of matching courses.
              </p>
            </StandardTooltipContentOld>
          </TooltipContent>
        </Tooltip>

        <Tooltip enabled={showTooltips}>
          <TooltipTrigger>
            <div className="py-2 flex">
              <Chip variant={'flat'} color={classesColor}>
                {numberOfClasses}{' '}
              </Chip>
              <Chip variant={'flat'} color={subscribersColor}>
                {subscribers}
              </Chip>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <StandardTooltipContentOld>
              Number of classes in this block, with a max size of{' '}
              {aLevelClassLimitInt} students.
            </StandardTooltipContentOld>
          </TooltipContent>
        </Tooltip>
      </div>
    </InteractiveTableCard>
  );
};

function getSubscribersColor(subscribers: number) {
  if (subscribers === 0) return 'default';
  if (subscribers < 5) return 'danger';
  if (subscribers < 10) return 'warning';
  if (subscribers > 30) return 'secondary';
  if (subscribers > 20) return 'primary';
  else return 'success';
}

function getOpacity(isEnabled: boolean) {
  if (isEnabled) return 100;
  else return 50;
}

function getClassesColor(classes: number) {
  if (classes >= 3) return 'danger';
  if (classes == 2) return 'warning';
  if (classes == 1) return 'success';
  else return 'default';
}

export default ElectiveCard;
