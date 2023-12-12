import {
  NameIdStringTuple,
  Period,
  TabularDTO
} from '../../../api/dto-interfaces';
import { Card } from '@tremor/react';
import LessonCycleSelector from './lesson-cycle-selector';
import DynamicDimensionTimetable, {
  HeaderTransformer
} from '../../../components/dynamic-dimension-timetable';
import { BuildMetricPeriodCardTransformer } from './period-card';
import React from 'react';

export function LessonCycleBuildMetricsCard({
  nameIdStringTuples,
  schedule,
  selectedLessonCycle,
  tableSchema
}: {
  schedule: string;
  selectedLessonCycle: NameIdStringTuple;
  nameIdStringTuples: NameIdStringTuple[];
  tableSchema: TabularDTO<string, Period>;
}) {
  return (
    <Card>
      Build metrics for the lesson cycles in schedule {schedule}
      {nameIdStringTuples.length > 0 && (
        <LessonCycleSelector
          selected={selectedLessonCycle}
          availableLessonCycleMetrics={nameIdStringTuples}
        />
      )}
      <DynamicDimensionTimetable
        tableContents={tableSchema}
        headerTransformer={HeaderTransformerConcrete}
        cellDataTransformer={BuildMetricPeriodCardTransformer}
      />
    </Card>
  );
}

const HeaderTransformerConcrete: HeaderTransformer<string> = ({ data }) => {
  return <p className="w-18 text-center">{data}</p>;
};
