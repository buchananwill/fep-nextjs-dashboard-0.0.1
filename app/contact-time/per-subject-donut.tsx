'use client';
import { Card, DonutChart, Grid, Title } from '@tremor/react';
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
  data
}: {
  data: {
    name: string;
    objectArray: { keyName: string; valueName: number }[];
  }[];
}) => {
  const [value, setValue] = React.useState(null);

  return (
    <>
      <Grid numItems={1} numItemsLg={3} className="gap-2">
        {data &&
          data.map(({ name, objectArray }, index) => (
            <Card key={`donut-card-${index}`} className="mx-auto max-w-xl">
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
          ))}
      </Grid>
      <pre>{JSON.stringify(value)}</pre>
    </>
  );
};
