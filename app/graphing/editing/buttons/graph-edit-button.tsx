import React from 'react';
import { Button, ButtonProps } from '@nextui-org/button';
import { Chip } from '@nextui-org/chip';

export function GraphEditButton({
  noNodeSelected,
  children,
  ...buttonProps
}: {
  noNodeSelected: boolean;
  children: string;
} & ButtonProps) {
  return (
    <Button variant={'ghost'} color={'primary'} {...buttonProps}>
      {children}
      {noNodeSelected && (
        <Chip
          color={'warning'}
          className={'absolute top-1 text-xs h-8 w-24 z-20'}
        >
          Select more nodes!
        </Chip>
      )}
    </Button>
  );
}
