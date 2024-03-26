'use client';
import { Card, DonutChart, Grid, Title } from '@tremor/react';
import React from 'react';

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
