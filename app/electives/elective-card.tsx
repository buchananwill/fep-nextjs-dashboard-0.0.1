'use client';
import { Badge, Card, Color, Text } from '@tremor/react';
import React, { useContext, useEffect, useState, useTransition } from 'react';
import { classNames } from '../utils/class-names';
import { ElectiveContext, ElectiveDispatchContext } from './elective-context';
import { ElectiveState } from './elective-reducers';
import { FillableButton, PinIcons } from '../components/fillable-button';
import { ElectiveFilterContext } from './elective-filter-context';
import { ElectiveDTO } from '../api/dto-interfaces';
import InteractiveTableCard from '../components/interactive-table-card';
import { CellDataTransformer } from '../components/dynamic-dimension-timetable';
import { da } from 'date-fns/locale';
import { FilterOption } from '../api/state-types';
import TooltipsContext from '../components/tooltips/tooltips-context';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '../components/tooltips/tooltip';

const aLevelClassLimitInt = 25;

const calculateSubscribers = (
  electiveDTO: ElectiveDTO,
  electivesState: ElectiveState
) => {
  const { id } = electiveDTO;
  const { electivePreferences } = electivesState;
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
  return electiveState?.electivePreferences
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
  const { name, carouselOrdinal, electiveOrdinal, id, courseId } = data;
  const { showTooltips } = useContext(TooltipsContext);

  const [subscribers, setSubscribers] = useState(0);
  const [borderVisible, setBorderVisible] = useState('border-transparent');
  const subscribersColor = getSubscribersColor(subscribers);
  const isEnabled = subscribers > 0;

  const [isPending, startTransition] = useTransition();
  const electivesState = useContext(ElectiveContext);
  const { courseFilters } = useContext(ElectiveFilterContext);
  const dispatch = useContext(ElectiveDispatchContext);
  const { carouselOptionId: focusCarouselOptionId, highlightedCourses } =
    electivesState;

  useEffect(() => {
    const updatedSubscribers = calculateSubscribers(data, electivesState);
    setSubscribers(updatedSubscribers);
  }, [data, electivesState]);

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

  const numberOfClasses = Math.ceil(subscribers / aLevelClassLimitInt);

  const classesColor = getClassesColor(numberOfClasses);

  const additionalClassNames = [
    `opacity-${opacity}`,
    borderVisible,
    id == focusCarouselOptionId ? 'bg-emerald-100' : '',
    'py-0'
  ];
  return (
    <Tooltip enabled={showTooltips}>
      <TooltipTrigger>
        <InteractiveTableCard additionalClassNames={additionalClassNames}>
          {isPending && (
            <div className="absolute -left-1 top-0 bottom-0 flex items-center justify-center">
              <span className="loading loading-ring loading-sm"></span>
            </div>
          )}
          <div className="indicator grow ">
            {getFiltered(courseFilters, courseId) && (
              <span className="indicator-item badge indicator-start bg-emerald-300 badge-sm"></span>
            )}
            <div
              className="px-1 py-3 cursor-pointer grow inline"
              onClick={() => {
                handleCardClick(id);
              }}
            >
              <Text className="text-xs">{name}</Text>
            </div>
          </div>

          <FillableButton
            pinIcon={PinIcons.mortarBoard}
            className={`${highlightText} mr-1`}
            isPinned={highlightText != ''}
            setPinned={() => handleMortarBoardClick(courseId)}
          ></FillableButton>
          <Badge color={classesColor}>{numberOfClasses} </Badge>
          <Badge color={subscribersColor}>{subscribers}</Badge>
        </InteractiveTableCard>
      </TooltipTrigger>
      <TooltipContent>
        Click the mortar board to show the locations of matching courses.
      </TooltipContent>
    </Tooltip>
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
