'use client';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';
import React, { Fragment, startTransition, useState } from 'react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { NameIdStringTuple } from '../api/dto-interfaces';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function NameIdTupleSelector({
  selectionList,
  selectedProp,
  selectionDescriptor
}: {
  selectionDescriptor: string;
  selectionList: NameIdStringTuple[];
  selectedProp: NameIdStringTuple;
}) {
  const { push } = useRouter();
  const pathname = usePathname();

  const updateSearchParams = (updatedSelection: NameIdStringTuple) => {
    const params = new URLSearchParams(window.location.search);

    params.set('id', updatedSelection.id);

    startTransition(() => {
      push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <Listbox value={selectedProp} by={'id'} onChange={updateSearchParams}>
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span className="block truncate">
            <strong>
              {selectionDescriptor}
              {': '}
            </strong>
            {selectedProp.name != '' ? selectedProp.name : 'No Selection'}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-40">
            {selectionList.map((tuple, index) => (
              <Listbox.Option
                key={index}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                  }`
                }
                value={tuple}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? 'font-medium' : 'font-normal'
                      }`}
                    >
                      {tuple.name}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}