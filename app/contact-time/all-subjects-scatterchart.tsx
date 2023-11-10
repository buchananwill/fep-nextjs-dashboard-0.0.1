'use client';

import { Card, ScatterChart, Text, Title } from '@tremor/react';
import { ScatterChartValueFormatter } from '@tremor/react/dist/components/chart-elements/ScatterChart/ScatterChart';
import { AllSubjectsContactTimeDTO } from '../api/dto-interfaces';

const formatter: ScatterChartValueFormatter = {
  x: (amount) => `${amount}`,
  y: (ratio) => `${ratio.toFixed(1)}`,
  size: (TeachersAmount) => `${TeachersAmount}`
};

export default function SubjectContactTime({
  data: { allItems }
}: {
  data: AllSubjectsContactTimeDTO;
}) {
  if (allItems) {
    const filteredSubjects = allItems.filter(
      (subject) => subject && subject.perTeacher && isFinite(subject.perTeacher)
    );
    const maxSize = filteredSubjects.reduce(
      (max, subjectDTO) =>
        subjectDTO.perTeacher && subjectDTO.perTeacher > max
          ? subjectDTO.perTeacher
          : max,
      0
    );
    const minSize = filteredSubjects.reduce(
      (min, subjectDTO) =>
        subjectDTO.perTeacher && subjectDTO.perTeacher < min
          ? subjectDTO.perTeacher
          : min,
      1000
    );
    const sizeRange = [minSize, maxSize];

    if (filteredSubjects.length > 0) {
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
    } else return <>error...</>;
  } else return <>error...</>;
}
