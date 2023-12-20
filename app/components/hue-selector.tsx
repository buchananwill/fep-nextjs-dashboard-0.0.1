import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';
import React, { Fragment, useContext } from 'react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { DEFAULT_COLOR } from '@tremor/react/dist/lib';
import { ColorContext } from './color-context';

export interface HueOption {
  name: string;
  id: typeof DEFAULT_COLOR;
}

export type HueTransformer = React.FC<HueTransformerProps>;

interface HueTransformerProps {
  selected: boolean;
  tuple: HueOption;
}

function DefaultTransformer(props: { selected: boolean; tuple: HueOption }) {
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

export default function HueSelector({
  selectionList,
  updateSelectedState,
  selectionDescriptor,
  optionTransformer: OptionTransformerComponent
}: {
  selectionList: HueOption[];
  updateSelectedState: (value: HueOption) => void;
  selectionDescriptor: string;
  optionTransformer?: HueTransformer;
}) {
  const { hue, lightness } = useContext(ColorContext);

  return (
    <Listbox
      value={hue}
      by={'id'}
      onChange={(value) => updateSelectedState(value)}
    >
      <div className="relative mt-1">
        <Listbox.Button
          className={`
          relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm
          `}
        >
          <span className="block truncate ">
            <strong>
              {selectionDescriptor}
              {': '}
            </strong>
            {hue.name != '' ? hue.name : 'No Selection'}
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
            {selectionList.map((option, index) => (
              <Listbox.Option
                key={index}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active
                      ? `bg-${option.id}-100 text-${option.id}-950`
                      : 'text-gray-900'
                  }`
                }
                value={option}
              >
                {({ selected }) => (
                  <>
                    {OptionTransformerComponent ? (
                      <OptionTransformerComponent
                        selected={selected}
                        tuple={option}
                      />
                    ) : (
                      <DefaultTransformer selected={selected} tuple={option} />
                    )}
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <div
                          className={`rounded-full h-5 w-5 bg-${option.id}-${lightness.id}`}
                          aria-hidden="true"
                        />
                      </span>
                    ) : (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                        <div
                          className={`rounded-full h-3 w-3 bg-${option.id}-${lightness.id}`}
                          aria-hidden="true"
                        />
                      </span>
                    )}
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
