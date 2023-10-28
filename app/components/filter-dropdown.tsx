'use client';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Fragment,
  useContext,
  useEffect,
  useState,
  useTransition
} from 'react';
import React from 'react';
import { gray } from 'd3-color';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import {
  ElectivesContext,
  ElectivesDispatchContext
} from '../electives/electives-context';
import {
  ElectiveState,
  ElectiveStateActions
} from '../electives/elective-reducers';
import { ElectivePreference } from '../electives/elective-subscriber-accordion';

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

function summariseFilterSelections(
  selectedFilters:
    | string
    | number
    | FilterOption[]
    | { courseUUID: string; carouselId: string }[]
    | number[]
    | Record<number, ElectivePreference[]>
) {
  if (Array.isArray(selectedFilters) && selectedFilters.length > 0) {
    console.log('Selected filters: ', selectedFilters);
    const joinedSelections = selectedFilters
      .map((selection) =>
        typeof selection !== 'number' && 'label' in selection
          ? selection.label
          : ''
      )
      .join(', ');
    return joinedSelections.length < 10
      ? joinedSelections
      : joinedSelections.substring(0, 9) + '...';
  } else return 'None';
}

export interface FilterOption {
  URI: string;
  label: string;
}

interface Props {
  filterOptions: FilterOption[];
  filterReducerType: string;
  contextProperty: keyof ElectiveState;
}

export const FilterDropdown = ({
  filterOptions,
  filterReducerType,
  contextProperty
}: Props) => {
  const [selectedFilters, setSelectedFilters] = useState<FilterOption[]>([]);
  const electiveState = useContext(ElectivesContext);
  const accessedProperty = electiveState[contextProperty];
  const dispatch = useContext(ElectivesDispatchContext);

  console.log('Accessed Property: ', accessedProperty);

  // useEffect(() => {
  //   dispatch({
  //     type: filterReducerType,
  //     entryList: selectedFilters
  //   });
  // }, [selectedFilters, dispatch, filterReducerType]);

  function handleOnChange(
    selectionList:
      | string
      | number
      | FilterOption[]
      | { courseUUID: string; carouselId: string }[]
      | number[]
      | Record<number, ElectivePreference[]>
  ) {
    dispatch({
      type: filterReducerType,
      entryList: selectionList
    });
  }

  return (
    <div className="w-36">
      <Listbox
        value={accessedProperty}
        by="URI"
        onChange={handleOnChange}
        multiple
        // className={`btn bg-${color}-400 hover:bg-${color}-500 normal-case text-xs w-fit h-min min-h-0 p-2 my-0 mx-2`}
      >
        <div className=" relative mt-1">
          <Listbox.Button
            className={`bg-${gray}-300 w-full relative cursor-default rounded-lg py-4 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-300 sm:text-sm`}
          >
            <span className="block">
              {summariseFilterSelections(accessedProperty)}
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
            <Listbox.Options className="p-1 z-10 w-full absolute mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
                    {entry.label}
                  </Listbox.Option>
                );
              })}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};
