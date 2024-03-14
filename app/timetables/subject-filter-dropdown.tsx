'use client';
import { Listbox, Transition } from '@headlessui/react';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

import {
  TimetablesContext,
  TimetablesDispatchContext
} from './timetables-context';

// For example, using TypeScript enum
export enum CacheSetting {
  Default = 'default',
  Reload = 'reload',
  NoCache = 'noCache'
}

// Or, using object as a map
export const colorSettings: Record<CacheSetting, string> = {
  [CacheSetting.Default]: 'emerald',
  [CacheSetting.Reload]: 'orange',
  [CacheSetting.NoCache]: 'red'
};

function summariseFilterSelections(selectedFilters: string[]) {
  if (Array.isArray(selectedFilters) && selectedFilters.length > 0) {
    const joinedSelections = selectedFilters.join(', ');
    return joinedSelections.length < 10
      ? joinedSelections
      : joinedSelections.substring(0, 9) + '...';
  } else return 'None';
}

interface Props {
  filterOptions: string[];
  filterReducerType: string;
}

export function SubjectFilterDropdown({
  filterOptions,
  filterReducerType
}: Props) {
  const dispatch = useContext(TimetablesDispatchContext);
  const { highlightedSubjectsList } = useContext(TimetablesContext);

  // useEffect(() => {
  //
  // }, [subjectFilters, dispatch, filterReducerType]);

  function handleOnChange(selection: string[]) {
    dispatch({
      type: 'setFilterPending',
      pending: true
    });

    dispatch({
      type: filterReducerType,
      subjects: selection
    });

    // setSubjectFilters(selection);
  }

  return (
    <div className="w-48">
      <Listbox
        value={highlightedSubjectsList}
        onChange={handleOnChange}
        multiple
        // className={`btn bg-${color}-400 hover:bg-${color}-500 normal-case text-xs w-fit h-min min-h-0 p-2 my-0 mx-2`}
      >
        <div className=" relative mt-1">
          <Listbox.Button
            className={`w-full relative cursor-default rounded-lg py-4 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-300 sm:text-sm`}
          >
            <span className="block">
              {summariseFilterSelections(highlightedSubjectsList)}
            </span>

            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon
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
            <Listbox.Options className="p-1 z-40 w-full absolute mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filterOptions.map((entry, index) => {
                return (
                  <Listbox.Option
                    key={`filterOptions-${index}`}
                    value={entry}
                    className={({ active, selected }) =>
                      `relative cursor-default select-none px-2 py-1 
                      ${active && !selected && 'bg-emerald-100'}
                      ${selected && 'bg-emerald-200'} 
                      ${active ? 'text-gray-950' : 'text-gray-500'}
                      `
                    }
                  >
                    <div className={'flex grow-1'}>{entry}</div>
                  </Listbox.Option>
                );
              })}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
