import { classNames } from '../utils/class-names';
import { Card } from '@tremor/react';
import React from 'react';

export default function InteractiveTableCard({
  children,
  additionalClassNames
}: {
  children: React.ReactNode;
  additionalClassNames: string[];
}) {
  return (
    <Card
      className={classNames(
        'flex py-2 px-1 m-0 items-center z-10 hover:scale-110 hover:z-20 hover:transition-transform hover:duration-300 duration-500 ',
        ...additionalClassNames
      )}
      decoration="left"
      decorationColor="emerald"
    >
      {children}
    </Card>
  );
}
