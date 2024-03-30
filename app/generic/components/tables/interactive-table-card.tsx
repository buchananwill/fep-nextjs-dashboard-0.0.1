import {
  Card,
  Color,
  HorizontalPosition,
  VerticalPosition
} from '@tremor/react';
import React from 'react';
import { classNames } from '../../../utils/class-names';

export default function InteractiveTableCard({
  children,
  additionalClassNames,
  decorationColor,
  decoration
}: {
  children: React.ReactNode;
  additionalClassNames?: string[];
  decorationColor?: Color;
  decoration?: HorizontalPosition | VerticalPosition;
}) {
  return (
    <Card
      className={classNames(
        'flex p-0 m-0 items-center z-10 hover:scale-110 hover:z-20 hover:transition-transform hover:duration-300 duration-500 ',
        ...(additionalClassNames || [])
      )}
      decoration={decoration || 'left'}
      decorationColor={decorationColor || 'emerald'}
    >
      {children}
    </Card>
  );
}
