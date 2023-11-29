'use client';
import { LessonCycle } from '../api/state-types';
import RightHandToolCard from '../components/right-hand-tool-card';
import FilterDisclosurePanel from '../components/filtered-disclosure-panel';
import { ButtonTransformerLessonCycle } from './button-transformer-lesson-cycle';
import ButtonSurroundLessonCycle from './button-surround-lesson-cycle';
import { PanelTransformerConcrete } from './panel-transformer-lesson-cycle';
import React, { useContext } from 'react';
import { TimetablesContext } from './timetables-context';

function filterLessonCycles(
  data: LessonCycle[],
  pinnedLessonCycles: Set<number>,
  focusPeriodId: number,
  periodIdToLessonCycleMap: Map<number, Set<LessonCycle>>,
  cycleDayFocusId: number,
  lessonCycleMap: Map<number, LessonCycle>
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

  const cyclesToAdd = new Set<number>();

  pinnedLessonCycles.forEach((cycleId) => cyclesToAdd.add(cycleId));

  setFromMap && setFromMap.forEach((cycle) => cyclesToAdd.add(cycle.id));

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
        <FilterDisclosurePanel
          data={filteredLessonCycles}
          buttonTransformer={ButtonTransformerLessonCycle}
          buttonSurround={ButtonSurroundLessonCycle}
          panelTransformer={PanelTransformerConcrete}
        />
      </RightHandToolCard.LowerFiveSixths>
    </RightHandToolCard>
  );
}
