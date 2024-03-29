import React, { ReactNode } from 'react';
import { useBundleItemsContext } from '../../contexts/use-bundle-Items-context';

export function OptionChooserItem({
  children,
  checkedStyling,
  bundleKey,
  optionKey,
  listenerKey,
  ...props
}: {
  children: ReactNode;
  checkedStyling: string;
  bundleKey: string;
  optionKey: string;
  listenerKey: string;
} & React.HTMLAttributes<HTMLInputElement>) {
  const { bundleItemsMap } = useBundleItemsContext();

  const checked =
    bundleItemsMap[bundleKey].workProjectSeriesSchemaIds.includes(optionKey);

  return (
    <label
      className={`inline-block relative w-full select-none cursor-pointer text-sm hover:bg-blue-200 p-1 ${
        checked ? checkedStyling : ''
      } focus-within:ring-2 focus-within:ring-offset-1 focus-within:ring-blue-500 focus-within:z-20 `}
    >
      <input
        type={'checkbox'}
        checked={checked}
        {...props}
        className={'pointer-events-none absolute opacity-0  '}
        aria-labelledby={`label-${optionKey}`}
      />
      {children}
    </label>
  );
}
