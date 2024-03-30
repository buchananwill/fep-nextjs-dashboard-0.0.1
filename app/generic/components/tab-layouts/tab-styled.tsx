import React, { Fragment } from 'react';
import { Tab } from '@headlessui/react';
import { Button } from '@nextui-org/button';
import { isFragment } from 'preact/compat';

export function TabStyled({ children }: { children: string }) {
  return (
    <Tab as={Fragment}>
      {({ selected, ...props }) => (
        <Button
          className={`w-full py-0 text-xs p-0.5 rounded-lg overflow-hidden  ${
            selected ? '' : 'opacity-25'
          }`}
          variant={'ghost'}
          size={'sm'}
        >
          <span className={'truncate ...'}>{children}</span>
        </Button>
      )}
    </Tab>
  );
}
