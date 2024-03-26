import React, { Fragment, JSX } from 'react';
import { Tab } from '@headlessui/react';

export function TabStyled({ children }: { children: string }) {
  return (
    <Tab as={'div'} className={'w-full p-0.5 rounded-lg overflow-hidden'}>
      {({ selected }) => (
        <button
          className={`w-full btn btn-sm btn-outline py-0 text-xs   ${
            selected ? '' : 'opacity-25'
          }`}
        >
          <span className={'truncate ...'}>{children}</span>
        </button>
      )}
    </Tab>
  );
}
