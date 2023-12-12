import {
  NameIdStringTuple,
  Period,
  TabularDTO
} from '../../../api/dto-interfaces';
import { Button, Card } from '@tremor/react';
import LessonCycleSelector from './lesson-cycle-selector';
import DynamicDimensionTimetable, {
  HeaderTransformer
} from '../../../components/dynamic-dimension-timetable';
import { BuildMetricPeriodCardTransformer } from './period-card';
import React from 'react';
import Link from 'next/link';

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
      Instances of (Finite cost - Infinite cost) in Lesson Cycles for{' '}
      <Link href={'/build-metrics/2'}>
        <Button
          color="gray"
          className="ml-2 hover:bg-gray-400 outline-0 border-0"
        >
          Schedule {schedule}
        </Button>
      </Link>
      {nameIdStringTuples.length > 0 && (
        <LessonCycleSelector
          selectedProp={selectedLessonCycle}
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
