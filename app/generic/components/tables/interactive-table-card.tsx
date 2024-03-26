import { classNames } from '../../utils/class-names';
import {
  Card,
  CardProps,
  Color,
  HorizontalPosition,
  VerticalPosition
} from '@tremor/react';
import React from 'react';

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
        'flex py-2 px-1 m-0 items-center z-10 hover:zoom-110 hover:z-20 hover:transition-transform hover:duration-300 duration-500 ',
        ...(additionalClassNames || [])
      )}
      decoration={decoration || 'left'}
      decorationColor={decorationColor || 'emerald'}
    >
      {children}
    </Card>
  );
}
