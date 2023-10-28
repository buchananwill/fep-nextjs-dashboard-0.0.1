'use client';
import { Listbox, Popover, Switch, Transition } from '@headlessui/react';
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
import {
  ElectivesFilterContext,
  ElectivesFilterDispatchContext
} from '../electives/electives-filter-context';
import { ElectiveFilterState } from '../electives/elective-filter-reducers';
import Union from './union';
import Intersection from './intersection';
import { Button } from '@tremor/react';

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
  operator: FilterType;
}

export interface Filter<T> {
  apply(setOfElements: T): T;
}

export enum FilterType {
  all = 'all',
  any = 'any'
}

interface Props {
  filterOptions: FilterOption[];
  filterReducerType: string;
  filterContextProperty: keyof ElectiveFilterState;
}

export const FilterPopover = ({
  filterOptions,
  filterReducerType,
  filterContextProperty
}: Props) => {
  const [selectedFilters, setSelectedFilters] = useState<FilterOption[]>([]);
  // const electiveState = useContext(ElectivesContext);
  // const accessedProperty = electiveState[contextProperty];
  const dispatch = useContext(ElectivesDispatchContext);
  const [enabled, setEnabled] = useState(false);

  const electiveFilterState = useContext(ElectivesFilterContext);
  const filterDispatch = useContext(ElectivesFilterDispatchContext);

  const accessedFilterProperty = electiveFilterState[filterContextProperty];

  function handleOnChange(selectionList: FilterOption[]) {
    // filterDispatch({
    //   type: filterReducerType,
    //   entryList: selectionList
    // });
  }

  return (
    <div className=" w-full max-w-sm px-4">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={`
                ${open ? 'text-white' : 'text-white/90'}
                group inline-flex items-center rounded-md bg-orange-700 px-3 py-2 text-base font-medium hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
            >
              <span>{summariseFilterSelections(accessedFilterProperty)}</span>
              <ChevronDownIcon
                className={`${open ? 'text-orange-300' : 'text-orange-300/70'}
                  ml-2 h-5 w-5 transition duration-150 ease-in-out group-hover:text-orange-300/80`}
                aria-hidden="true"
              />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-2 sm:px-0 lg:max-w-3xl">
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                  <div className="relative grid gap-2 bg-white p-2 lg:grid-cols-2">
                    {filterOptions.map((entry, index) => (
                      <div
                        key={`filterOptions-${index}`}
                        className="flex relative cursor-default select-none p-0 text-gray-500 items-center"
                      >
                        <Button
                          onClick={() => handleOnChange([])}
                          className="w-48"
                        >
                          {entry.label}
                        </Button>
                        <input
                          type={'checkbox'}
                          className="toggle toggle-accent ml-2"
                        />
                        <span className="grow"></span>
                      </div>
                    ))}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};
