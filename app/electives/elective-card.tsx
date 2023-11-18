'use client';
import { Badge, Card, Color, Text } from '@tremor/react';
import React, { useContext, useEffect, useState, useTransition } from 'react';
import { classNames } from '../utils/class-names';
import { ElectiveContext, ElectiveDispatchContext } from './elective-context';
import { ElectiveState } from './elective-reducers';
import { PinButton, PinIcons } from '../components/pin-button';
import { ElectiveFilterContext } from './elective-filter-context';
import { ElectiveDTO } from '../api/dto-interfaces';
import InteractiveTableCard from '../components/interactive-table-card';
import { CellDataTransformer } from '../components/dynamic-dimension-timetable';
import { da } from 'date-fns/locale';
import { FilterOption } from '../api/state-types';

const aLevelClassLimitInt = 25;

const calculateSubscribers = (
  electiveDTO: ElectiveDTO,
  electivesState: ElectiveState
) => {
  const { carouselId, uuid } = electiveDTO;
  let count = 0;
  for (const [partyId, preferenceList] of Object.entries(
    electivesState.electivePreferences
  )) {
    for (let electivePreference of preferenceList) {
      if (
        electivePreference.isActive &&
        electivePreference.uuid == uuid &&
        electivePreference.assignedCarouselOptionId == carouselId
      )
        count++;
    }
  }
  return count;
};

const getBorderVisible = (
  electiveState: ElectiveState,
  carouselId: number,
  uuid: string
) => {
  const { partyId } = electiveState;
  return electiveState?.electivePreferences[partyId]?.some(
    (electivePreference) =>
      electivePreference.isActive &&
      electivePreference.assignedCarouselOptionId == carouselId &&
      electivePreference.uuid == uuid
  )
    ? ''
    : 'border-transparent';
};

function getHighlighted(highlightedCourses: string[], uuid: string) {
  const isHighlighted =
    highlightedCourses && highlightedCourses.some((course) => course == uuid);
  return isHighlighted ? 'text-red-500' : '';
}

function getFiltered(courseFilters: FilterOption[], uuid: string) {
  return courseFilters.some((courseFilter) => courseFilter.URI == uuid);
}

const ElectiveCard: CellDataTransformer<ElectiveDTO> = ({ data }) => {
  const { name, carouselId, courseCarouselId, uuid } = data;

  const [subscribers, setSubscribers] = useState(0);
  const [borderVisible, setBorderVisible] = useState('border-transparent');
  const subscribersColor = getSubscribersColor(subscribers);
  const isEnabled = subscribers > 0;

  const [isPending, startTransition] = useTransition();
  const electivesState = useContext(ElectiveContext);
  const { courseFilters } = useContext(ElectiveFilterContext);
  const dispatch = useContext(ElectiveDispatchContext);
  const {
    courseCarouselId: focusCCID,
    carouselId: focusCId,
    highlightedCourses
  } = electivesState;

  useEffect(() => {
    const updatedSubscribers = calculateSubscribers(data, electivesState);
    setSubscribers(updatedSubscribers);
  }, [data, electivesState]);

  function handleCardClick(
    carouselId: number,
    courseCarouselId: number,
    uuid: string
  ) {
    startTransition(() => {
      dispatch({
        type: 'focusCourse',
        carouselId: carouselId,
        courseCarouselId: courseCarouselId,
        uuid: uuid
      });
      dispatch({
        type: 'setFilterPending',
        pending: true
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
    const borderNowVisible = getBorderVisible(electivesState, carouselId, uuid);
    setBorderVisible(borderNowVisible);
  }, [electivesState, carouselId, uuid]);

  const opacity = getOpacity(isEnabled);

  const highlightText = getHighlighted(highlightedCourses, uuid);

  const numberOfClasses = Math.ceil(subscribers / aLevelClassLimitInt);

  const classesColor = getClassesColor(numberOfClasses);

  const additionalClassNames = [
    `opacity-${opacity}`,
    borderVisible,
    courseCarouselId == focusCCID && carouselId == focusCId
      ? 'bg-emerald-100'
      : ''
  ];
  return (
    <InteractiveTableCard additionalClassNames={additionalClassNames}>
      {isPending && (
        <div className="absolute -left-1 top-0 bottom-0 flex items-center justify-center">
          <span className="loading loading-ring loading-sm"></span>
        </div>
      )}
      <div className="indicator grow ">
        {getFiltered(courseFilters, uuid) && (
          <span className="indicator-item badge indicator-start bg-emerald-300 badge-sm"></span>
        )}
        <div
          className="px-1 cursor-pointer grow inline"
          onClick={() => {
            handleCardClick(carouselId, courseCarouselId, uuid);
          }}
        >
          <Text className="text-xs">{name}</Text>
        </div>
      </div>

      <PinButton
        pinIcon={PinIcons.mortarBoard}
        className={`${highlightText} mr-1`}
        isPinned={highlightText != ''}
        setPinned={() => handleMortarBoardClick(uuid)}
      ></PinButton>
      <Badge color={classesColor}>{numberOfClasses} </Badge>
      <Badge color={subscribersColor}>{subscribers}</Badge>
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
