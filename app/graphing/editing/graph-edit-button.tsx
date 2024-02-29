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
      {noNodeSelected && (
        <span
          className={
            'badge badge-error absolute -bottom-10 text-xs h-10 w-24 animate-pulse'
          }
        >
          Select more nodes!
        </span>
      )}
      {children}
    </button>
  );
}
