'use client';
import { Listbox, Transition } from '@headlessui/react';
import React, { Fragment, useContext } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { FilterOption } from '../../../api/state-types';
import { ElectivePreferenceDTO } from '../../../api/dtos/ElectivePreferenceDTOSchema';
import { ElectiveFilterState } from '../../../electives/elective-filter-reducers';
import {
  ElectiveContext,
  ElectiveDispatchContext
} from '../../../electives/elective-context';
import {
  ElectiveFilterContext,
  ElectiveFilterDispatchContext
} from '../../../electives/elective-filter-context';

function summariseFilterSelections(
  selectedFilters:
    | string
    | number
    | FilterOption<any>[]
    | { uuid: string; carouselId: string }[]
    | number[]
    | Record<number, ElectivePreferenceDTO[]>
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

interface Props {
  filterOptions: FilterOption<string>[];
  filterReducerType: string;
  filterContextProperty: keyof ElectiveFilterState;
}

export function FilterDropdown({
  filterOptions,
  filterReducerType,
  filterContextProperty
}: Props) {
  const dispatch = useContext(ElectiveDispatchContext);

  const electiveFilterState = useContext(ElectiveFilterContext);
  const filterDispatch = useContext(ElectiveFilterDispatchContext);
  const { filterPending } = useContext(ElectiveContext);

  const accessedFilterProperty = electiveFilterState[filterContextProperty];

  function handleOnChange(selectionList: FilterOption<string>[]) {
    dispatch({
      type: 'setFilterPending',
      pending: true
    });

    filterDispatch({
      type: filterReducerType,
      entryList: selectionList
    });
  }

  return (
    <div className="w-48">
      <Listbox
        value={accessedFilterProperty}
        by="URI"
        onChange={handleOnChange}
        multiple
        // className={`btn bg-${color}-400 hover:bg-${color}-500 normal-case text-xs w-fit h-min min-h-0 p-2 my-0 mx-2`}
      >
        <div className=" relative mt-1">
          <Listbox.Button
            className={`w-full relative cursor-default rounded-lg py-4 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-300 sm:text-sm`}
          >
            <span className="block">
              {summariseFilterSelections(accessedFilterProperty)}
            </span>
            {filterPending && (
              <span className="absolute right-8 top-4 loading loading-spinner loading-sm"></span>
            )}
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
                    <div className={'flex grow-1'}>{entry.label}</div>
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
