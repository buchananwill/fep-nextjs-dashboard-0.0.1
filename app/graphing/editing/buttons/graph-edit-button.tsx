import React from 'react';

export function GraphEditButton({
  noNodeSelected,
  children,
  ...buttonProps
}: {
  noNodeSelected: boolean;
  children: string;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  return (
    <button className={'btn btn-primary btn-outline'} {...buttonProps}>
      {children}
      {noNodeSelected && (
        <span
          className={'badge badge-error absolute top-1 text-xs h-10 w-24 z-20'}
        >
          Select more nodes!
        </span>
      )}
    </button>
  );
}
