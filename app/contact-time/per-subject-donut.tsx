'use client';
import { Card, DonutChart, Title } from '@tremor/react';
import React from 'react';

interface PerSubjectDonutData {
  subjectName: string;
}

const cities = [
  {
    name: 'Year 13',
    sales: 110
  },
  {
    name: 'Year 7',
    sales: 36
  }
];

const valueFormatter = (number: number) =>
  `$ ${new Intl.NumberFormat('us').format(number).toString()}`;

export const PerSubjectDonut = ({
  data: { name, objectArray }
}: {
  data: {
    name: string;
    objectArray: { keyName: string; valueName: number }[];
  };
}) => {
  const [value, setValue] = React.useState(null);
  console.log();
  return (
    <>
      <Card className="mx-auto">
        <Title>{name}</Title>
        <DonutChart
          className="mt-6"
          data={objectArray}
          category="valueName"
          index="keyName"
          colors={[
            'rose',
            'orange',
            'yellow',
            'emerald',
            'blue',
            'indigo',
            'violet'
          ]}
          onValueChange={(v) => setValue(v)}
        />
      </Card>
      <pre>{JSON.stringify(value)}</pre>
    </>
  );
};
