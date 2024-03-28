import { TabularDTO } from '../../../api/dto-interfaces';
import { Button, Card } from '@tremor/react';

import { BuildMetricPeriodCardTransformer } from './period-card';
import React from 'react';
import Link from 'next/link';
import { PeriodDTO } from '../../../api/dtos/PeriodDTOSchema';
import { NameIdStringTuple } from '../../../api/dtos/NameIdStringTupleSchema';
import DynamicDimensionTimetable, {
  HeaderTransformer
} from '../../../generic/components/tables/dynamic-dimension-timetable';
import StringNameStringIdSearchParamsSelector from '../../../generic/components/dropdown/string-name-string-id-search-params-selector';

export function LessonCycleBuildMetricsCard({
  nameIdStringTuples,
  schedule,
  selectedLessonCycle,
  tableSchema
}: {
  schedule: string;
  selectedLessonCycle: NameIdStringTuple;
  nameIdStringTuples: NameIdStringTuple[];
  tableSchema: TabularDTO<string, PeriodDTO>;
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
        <StringNameStringIdSearchParamsSelector
          selectionDescriptor={'Selected Lesson Cycle: '}
          selectedProp={selectedLessonCycle}
          selectionList={nameIdStringTuples}
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
