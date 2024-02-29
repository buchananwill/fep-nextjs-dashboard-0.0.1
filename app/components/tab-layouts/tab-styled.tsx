import React, { Fragment, JSX } from 'react';
import { Tab } from '@headlessui/react';

export function TabStyled({ children }: { children: string }) {
  return (
    <Tab as={'div'} className={'w-full p-0.5 rounded-lg'}>
      {({ selected }) => (
        <button
          className={`w-full btn btn-sm btn-outline px-0 ${
            selected ? '' : 'opacity-25'
          }`}
        >
          <span className={'text-xs'}>{children}</span>
        </button>
      )}
    </Tab>
  );
}