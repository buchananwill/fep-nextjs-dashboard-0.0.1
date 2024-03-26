'use client';

import { ReactNode } from 'react';

import { Disclosure } from '@headlessui/react';

import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

export default function ChevronDisclosure({
  children
}: {
  children: ReactNode;
}) {
  return (
    <Disclosure as="menu" className="p-0 m-0 bg-white shadow-sm items-center">
      {({ open }) => (
        <>
          <div className="px-6 sm:px-6 lg:px-8">
            <div className="flex items-center ">
              <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                {children}
                {open ? (
                  <ChevronLeftIcon
                    className="block h-6 w-6"
                    aria-hidden="true"
                  />
                ) : (
                  <ChevronDownIcon
                    className="block h-6 w-6"
                    aria-hidden="true"
                  />
                )}
              </Disclosure.Button>
            </div>
          </div>

          <Disclosure.Panel className="">
            <div className="space-y-1 sm:space-y-0 sm:space-x-2 sm:px-4 pt-2 pb-3 w-full sm:flex sm:items-center">
              {children}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
