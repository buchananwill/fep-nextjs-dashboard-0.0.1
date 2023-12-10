'use client';
import { LessonCycle } from '../api/state-types';
import RightHandToolCard from '../components/right-hand-tool-card';
import ListDisclosurePanel from '../components/list-disclosure-panel';
import { ButtonTransformerLessonCycle } from './button-transformer-lesson-cycle';
import ButtonSurroundLessonCycle from './button-surround-lesson-cycle';
import { PanelTransformerConcrete } from './panel-transformer-lesson-cycle';
import React, { useContext } from 'react';
import { TimetablesContext } from './timetables-context';

function filterLessonCycles(
  data: LessonCycle[],
  pinnedLessonCycles: Set<string>,
  focusPeriodId: number,
  periodIdToLessonCycleMap: Map<number, Set<string>>,
  cycleDayFocusId: number,
  lessonCycleMap: Map<string, LessonCycle>
) {
  const setFromMap = periodIdToLessonCycleMap.get(focusPeriodId);

  console.log('focusPeriodId: ', focusPeriodId);

  if (
    pinnedLessonCycles.size == 0 &&
    isNaN(focusPeriodId) &&
    cycleDayFocusId < 0
  )
    return [];

  const filteredLessonCycles: LessonCycle[] = [];

  const cyclesToAdd = new Set<string>();

  pinnedLessonCycles.forEach((cycleId) => cyclesToAdd.add(cycleId));

  setFromMap && setFromMap.forEach((cycleId) => cyclesToAdd.add(cycleId));

  return data.filter((lessonCycle) => cyclesToAdd.has(lessonCycle.id));
}

export function FilteredLessonCycles({ data }: { data: LessonCycle[] }) {
  const {
    filterPending,
    pinnedLessonCycles,
    focusPeriodId,
    periodIdToLessonCycleMap,
    cycleDayFocusId,
    lessonCycleMap
  } = useContext(TimetablesContext);

  const filteredLessonCycles = filterLessonCycles(
    data,
    pinnedLessonCycles,
    focusPeriodId,
    periodIdToLessonCycleMap,
    cycleDayFocusId,
    lessonCycleMap
  );

  return (
    <RightHandToolCard>
      <RightHandToolCard.UpperSixth>Lesson Cycles</RightHandToolCard.UpperSixth>
      <RightHandToolCard.LowerFiveSixths>
        <ListDisclosurePanel
          data={filteredLessonCycles}
          buttonTransformer={ButtonTransformerLessonCycle}
          buttonSurround={ButtonSurroundLessonCycle}
          panelTransformer={PanelTransformerConcrete}
        />
      </RightHandToolCard.LowerFiveSixths>
    </RightHandToolCard>
  );
}
