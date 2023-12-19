import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';
import React, { Fragment } from 'react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { NameIdStringTuple } from '../api/dto-interfaces';

export type OptionTransformer = React.FC<OptionTransformerProps>;

interface OptionTransformerProps {
  selected: boolean;
  tuple: NameIdStringTuple;
}

function DefaultTransformer(props: {
  selected: boolean;
  tuple: NameIdStringTuple;
}) {
  return (
    <span
      className={`block truncate ${
        props.selected ? 'font-medium' : 'font-normal'
      }`}
    >
      {props.tuple.name}
    </span>
  );
}

export default function StateSelector({
  selectedState,
  selectionList,
  updateSelectedState,
  selectionDescriptor,
  optionTransformer: OptionTransformerComponent
}: {
  selectedState: NameIdStringTuple;
  selectionList: NameIdStringTuple[];
  updateSelectedState: (value: NameIdStringTuple) => void;
  selectionDescriptor: string;
  optionTransformer?: OptionTransformer;
}) {
  return (
    <Listbox
      value={selectedState}
      by={'id'}
      onChange={(value) => updateSelectedState(value)}
    >
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span className="block truncate">
            <strong>
              {selectionDescriptor}
              {': '}
            </strong>
            {selectedState.name != '' ? selectedState.name : 'No Selection'}
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
                    {OptionTransformerComponent ? (
                      <OptionTransformerComponent
                        selected={selected}
                        tuple={tuple}
                      />
                    ) : (
                      <DefaultTransformer selected={selected} tuple={tuple} />
                    )}
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
