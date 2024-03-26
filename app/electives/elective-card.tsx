'use client';
import { Badge, Color, Text } from '@tremor/react';
import React, { useContext, useEffect, useState, useTransition } from 'react';
import { ElectiveContext, ElectiveDispatchContext } from './elective-context';
import { ElectiveState } from './elective-reducers';
import {
  FillableButton,
  PinIcons
} from '../components/buttons/fillable-button';
import { ElectiveFilterContext } from './elective-filter-context';

import InteractiveTableCard from '../components/interactive-table-card';
import { CellDataTransformer } from '../components/dynamic-dimension-timetable';
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
    'py-0 w-48'
  ];
  return (
    <InteractiveTableCard additionalClassNames={additionalClassNames}>
      <Tooltip enabled={showTooltips}>
        <TooltipTrigger className="outline-0 w-full border-0">
          {isPending && (
            <div className="absolute -left-1 top-0 bottom-0 flex items-center justify-center">
              <span className="loading loading-ring loading-sm"></span>
            </div>
          )}
          <div className="indicator grow w-full">
            {getFiltered(courseFilters, courseId) && (
              <span className="indicator-item badge indicator-start bg-emerald-300 badge-sm"></span>
            )}
            <div
              className="px-0 py-3 cursor-pointer grow inline"
              onClick={() => {
                handleCardClick(id);
              }}
            >
              <Text className="text-xs">{name}</Text>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <StandardTooltipContentOld>
            <p>
              Click the<strong> subject name </strong> to filter students taking
              this course.
            </p>{' '}
          </StandardTooltipContentOld>
        </TooltipContent>
      </Tooltip>

      <Tooltip enabled={showTooltips}>
        <TooltipTrigger className="m-0 outline-0 border-o">
          <FillableButton
            pinIcon={PinIcons.mortarBoard}
            className={`${highlightText} mr-1 align-middle py-2`}
            isPinned={highlightText != ''}
            setPinned={() => handleMortarBoardClick(courseId)}
            id={`course:highlight-matching:${courseId}`}
          ></FillableButton>
        </TooltipTrigger>
        <TooltipContent className="">
          <StandardTooltipContentOld>
            <p>
              Click the <strong> mortar board </strong> to show the locations of
              matching courses.
            </p>
          </StandardTooltipContentOld>
        </TooltipContent>
      </Tooltip>

      <Tooltip enabled={showTooltips}>
        <TooltipTrigger>
          <div className="py-2 flex">
            <Badge color={classesColor}>{numberOfClasses} </Badge>
            <Badge color={subscribersColor}>{subscribers}</Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <StandardTooltipContentOld>
            Number of classes in this block, with a max size of{' '}
            {aLevelClassLimitInt} students.
          </StandardTooltipContentOld>
        </TooltipContent>
      </Tooltip>
    </InteractiveTableCard>
  );
};

function getSubscribersColor(subscribers: number) {
  if (subscribers === 0) return 'red';
  if (subscribers < 5) return 'orange';
  if (subscribers < 10) return 'yellow';
  if (subscribers > 30) return 'indigo';
  if (subscribers > 20) return 'sky';
  else return 'emerald';
}

function getOpacity(isEnabled: boolean) {
  if (isEnabled) return 100;
  else return 50;
}

function getClassesColor(classes: number): Color {
  if (classes >= 3) return 'red';
  if (classes == 2) return 'amber';
  if (classes == 1) return 'green';
  else return 'gray';
}

export default ElectiveCard;
