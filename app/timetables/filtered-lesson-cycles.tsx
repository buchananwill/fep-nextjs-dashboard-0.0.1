'use client';
import { LessonCycle } from '../api/state-types';

import { DisclosureButtonLessonCycle } from './disclosure-button-lesson-cycle';
import ButtonClusterLessonCycle from './button-cluster-lesson-cycle';
import { PanelTransformerConcrete } from './panel-transformer-lesson-cycle';
import React, { useContext } from 'react';
import { TimetablesContext } from './timetables-context';
import RightHandToolCard from '../generic/components/tool-card/right-hand-tool-card';
import DisclosureListPanel from '../generic/components/disclosure-list/disclosure-list-panel';

function filterLessonCycles(
  data: LessonCycle[],
  pinnedLessonCycles: Set<string>,
  focusPeriodId: number,
  periodIdToLessonCycleMap: Map<number, Set<string>>,
  cycleDayFocusId: number
) {
  const setFromMap = periodIdToLessonCycleMap.get(focusPeriodId);

  if (
    pinnedLessonCycles.size == 0 &&
    isNaN(focusPeriodId) &&
    cycleDayFocusId < 0
  )
    return [];
  const cyclesToAdd = new Set<string>();

  pinnedLessonCycles.forEach((cycleId) => cyclesToAdd.add(cycleId));

  setFromMap && setFromMap.forEach((cycleId) => cyclesToAdd.add(cycleId));

  return data.filter((lessonCycle) => cyclesToAdd.has(lessonCycle.id));
}

export function FilteredLessonCycles({ data }: { data: LessonCycle[] }) {
  const {
    pinnedLessonCycles,
    focusPeriodId,
    periodIdToLessonCycleMap,
    cycleDayFocusId
  } = useContext(TimetablesContext);

  const filteredLessonCycles = filterLessonCycles(
    data,
    pinnedLessonCycles,
    focusPeriodId,
    periodIdToLessonCycleMap,
    cycleDayFocusId
  );

  return (
    <RightHandToolCard>
      <RightHandToolCard.UpperSixth>Lesson Cycles</RightHandToolCard.UpperSixth>
      <RightHandToolCard.LowerFiveSixths>
        <DisclosureListPanel
          data={filteredLessonCycles}
          disclosureLabelTransformer={DisclosureButtonLessonCycle}
          buttonCluster={ButtonClusterLessonCycle}
          panelTransformer={PanelTransformerConcrete}
        />
      </RightHandToolCard.LowerFiveSixths>
    </RightHandToolCard>
  );
}
