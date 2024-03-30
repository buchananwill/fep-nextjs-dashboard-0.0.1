import { PencilSquareIcon } from '@heroicons/react/20/solid';
import React from 'react';
import { Button, ButtonProps } from '@nextui-org/button';

export type GenericButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export function RenameButton({
  currentName,
  className,
  ...buttonProps
}: {
  currentName?: string;
} & ButtonProps) {
  return (
    <Button
      className={` ${className}`}
      size={'sm'}
      variant={'ghost'}
      {...buttonProps}
    >
      {currentName && currentName}
      <PencilSquareIcon className={'w-4 h-4'}></PencilSquareIcon>
    </Button>
  );
}
