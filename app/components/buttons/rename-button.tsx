import { PencilSquareIcon } from '@heroicons/react/20/solid';
import React from 'react';

export function RenameButton({
  currentName,
  className,
  ...props
}: {
  currentName?: string;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  return (
    <button
      className={`btn btn-primary btn-outline btn-sm ${className}`}
      {...props}
    >
      {currentName && currentName}
      <PencilSquareIcon className={'w-4 h-4'}></PencilSquareIcon>
    </button>
  );
}
