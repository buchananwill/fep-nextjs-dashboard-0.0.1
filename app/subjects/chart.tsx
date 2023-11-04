'use client';

import { Card, AreaChart, Title, Text, ScatterChart } from '@tremor/react';

import { fetchAllSubjectsContactTime } from '../api/request-subject-contact-time-metrics';
import { ScatterChartValueFormatter } from '@tremor/react/dist/components/chart-elements/ScatterChart/ScatterChart';
import { DefaultColors } from 'tailwindcss/types/generated/colors';
import { colorPalette } from '@tremor/react/dist/lib';

interface SubjectContactTimeDTO {
  subject: string;
  periods: number;
  teachers: number;
  perTeacher: number;
}

export interface AllSubjectsContactTimeDTO {
  allSubjects: SubjectContactTimeDTO[];
}

const formatter: ScatterChartValueFormatter = {
  x: (amount) => `${amount}`,
  y: (ratio) => `${ratio.toFixed(1)}`,
  size: (TeachersAmount) => `${TeachersAmount}`
};

export default function SubjectContactTime({
  data: { allSubjects }
}: {
  data: AllSubjectsContactTimeDTO;
}) {
  const maxSize = allSubjects.reduce(
    (max, subjectDTO) =>
      subjectDTO.perTeacher > max ? subjectDTO.perTeacher : max,
    allSubjects[0].perTeacher
  );
  const minSize = allSubjects.reduce(
    (min, subjectDTO) =>
      subjectDTO.perTeacher < min ? subjectDTO.perTeacher : min,
    allSubjects[0].perTeacher
  );
  const sizeRange = [minSize, maxSize];

  const filteredSubjects = allSubjects.filter((subject) =>
    isFinite(subject.perTeacher)
  );

  return (
    <Card className="mt-8">
      <Title>Subject Contact Time</Title>
      <Text>
        Summarising the total contact time required per subject for this
        academic year.
      </Text>
      <ScatterChart
        className="mt-4 h-80"
        data={filteredSubjects}
        maxYValue={
          filteredSubjects.reduce(
            (max, dataPoint) =>
              dataPoint.perTeacher > max ? dataPoint.perTeacher : max,
            filteredSubjects[0].perTeacher
          ) * 1.1
        }
        category="subject"
        x="periods"
        y="perTeacher"
        size="teachers"
        // sizeRange={sizeRange}
        showOpacity={true}
        minYValue={0}
        colors={[
          'red',
          'orange',
          'amber',
          'yellow',
          'lime',
          'green',
          'emerald',
          'teal',
          'cyan',
          'sky',
          'blue',
          'indigo',
          'violet',
          'purple',
          'fuchsia',
          'pink',
          'rose'
        ]}
        valueFormatter={formatter}
        showLegend={false}
      />
    </Card>
  );
}
