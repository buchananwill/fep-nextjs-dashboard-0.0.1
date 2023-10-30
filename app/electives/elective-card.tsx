'use client';
import { Badge, Card, Color } from '@tremor/react';
import React, { useContext, useEffect, useState, useTransition } from 'react';
import { classNames } from '../utils/class-names';
import { ElectiveContext, ElectiveDispatchContext } from './elective-context';
import { ElectiveState } from './elective-reducers';
import { PinButton, PinIcons } from '../components/pin-button';
import { ElectiveFilterContext } from './elective-filter-context';
import { FilterOption } from './elective-filter-reducers';

export interface ElectiveDTO {
  courseDescription: string;
  courseUUID: string;
  courseCarouselId: number;
  carouselId: number;
  subscriberPartyIDs: number[];
}

const aLevelClassLimitInt = 25;

const calculateSubscribers = (
  electiveDTO: ElectiveDTO,
  electivesState: ElectiveState
) => {
  const { carouselId, courseUUID } = electiveDTO;
  let count = 0;
  for (const [partyId, preferenceList] of Object.entries(
    electivesState.electivePreferences
  )) {
    for (let electivePreference of preferenceList) {
      if (
        electivePreference.isActive &&
        electivePreference.courseUUID == courseUUID &&
        electivePreference.assignedCarouselId == carouselId
      )
        count++;
    }
  }
  return count;
};

const getBorderVisible = (
  electiveState: ElectiveState,
  carouselId: number,
  courseUUID: string
) => {
  const { partyId } = electiveState;
  return electiveState?.electivePreferences[partyId]?.some(
    (electivePreference) =>
      electivePreference.isActive &&
      electivePreference.assignedCarouselId == carouselId &&
      electivePreference.courseUUID == courseUUID
  )
    ? ''
    : 'border-transparent';
};

function getHighlighted(highlightedCourses: string[], courseUUID: string) {
  const isHighlighted =
    highlightedCourses &&
    highlightedCourses.some((course) => course == courseUUID);
  return isHighlighted ? 'text-red-500' : '';
}

function getFiltered(courseFilters: FilterOption[], courseUUID: string) {
  return courseFilters.some((courseFilter) => courseFilter.URI == courseUUID);
}

export default function ElectiveCard({
  electiveDTO
}: {
  electiveDTO: ElectiveDTO;
}) {
  const { courseDescription, carouselId, courseCarouselId, courseUUID } =
    electiveDTO;
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
    const updatedSubscribers = calculateSubscribers(
      electiveDTO,
      electivesState
    );
    setSubscribers(updatedSubscribers);
  }, [electiveDTO, electivesState]);

  function handleCardClick(
    carouselId: number,
    courseCarouselId: number,
    courseUUID: string
  ) {
    startTransition(() => {
      dispatch({
        type: 'focusCourse',
        carouselId: carouselId,
        courseCarouselId: courseCarouselId,
        courseId: courseUUID
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
    console.log('Now highlighted: ', highlightedCourses);
  }

  useEffect(() => {
    const borderNowVisible = getBorderVisible(
      electivesState,
      carouselId,
      courseUUID
    );
    setBorderVisible(borderNowVisible);
  }, [electivesState, carouselId, courseUUID]);

  const opacity = getOpacity(isEnabled);

  const highlightText = getHighlighted(highlightedCourses, courseUUID);

  const numberOfClasses = Math.ceil(subscribers / aLevelClassLimitInt);

  const classesColor = getClassesColor(numberOfClasses);

  return (
    <Card
      className={classNames(
        `opacity-${opacity}`,
        borderVisible,
        'flex py-2 px-1 m-0 items-center hover:scale-110 hover:z-10 hover:transition-transform hover:duration-300 duration-300 transition-transform',
        courseCarouselId == focusCCID && carouselId == focusCId
          ? 'bg-emerald-100'
          : ''
      )}
      decoration="left"
      decorationColor="emerald"
    >
      {isPending && (
        <div className="absolute -left-1 top-0 bottom-0 flex items-center justify-center">
          <span className="loading loading-ring loading-sm"></span>
        </div>
      )}
      <div className="indicator grow">
        {getFiltered(courseFilters, courseUUID) && (
          <span className="indicator-item badge indicator-start bg-emerald-300 badge-sm"></span>
        )}
        <div
          className="px-1 cursor-pointer grow inline"
          onClick={() => {
            handleCardClick(carouselId, courseCarouselId, courseUUID);
          }}
        >
          {courseDescription}
        </div>
      </div>

      <PinButton
        pinIcon={PinIcons.mortarBoard}
        classNames={`${highlightText} mr-1`}
        isPinned={highlightText != ''}
        setPinned={() => handleMortarBoardClick(courseUUID)}
      ></PinButton>
      <Badge color={classesColor}>{numberOfClasses} </Badge>
      <Badge color={subscribersColor}>{subscribers}</Badge>
    </Card>
  );
}

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
