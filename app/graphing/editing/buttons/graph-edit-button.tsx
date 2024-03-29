import React from 'react';
import { Button, ButtonProps } from '@nextui-org/react';

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
        <span
          className={'badge badge-error absolute top-1 text-xs h-10 w-24 z-20'}
        >
          Select more nodes!
        </span>
      )}
    </Button>
  );
}
