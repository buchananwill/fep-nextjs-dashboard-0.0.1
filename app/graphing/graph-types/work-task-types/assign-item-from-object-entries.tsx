import { StringMap } from '../../../contexts/string-map-context/string-map-reducer';
import { ColumnOne, ColumnsTwoToFour } from './rename-work-task-type';
import { Listbox } from '@headlessui/react';
import {
  NodeDetailsListBoxButton,
  NodeDetailsListBoxOption,
  NodeDetailsListBoxOptions
} from '../organization/curriculum-delivery-details';
import React, { Fragment } from 'react';
import { isNotUndefined } from '../../../api/main';

export function AssignItemFromObjectEntries<T>({
  itemDescriptor,
  currentAssignment,
  onChange,
  optionsMap,
  labelAccessor,
  idAccessor
}: {
  itemDescriptor: string;
  currentAssignment: string;
  onChange: (value: string) => void;
  optionsMap: StringMap<T>;
  labelAccessor: (item: T) => string;
  idAccessor: (item: T) => string;
}) {
  console.log(optionsMap);
  return (
    <>
      <ColumnOne>{itemDescriptor}</ColumnOne>
      <ColumnsTwoToFour>
        <Listbox value={currentAssignment} onChange={onChange}>
          <Listbox.Button as={NodeDetailsListBoxButton}>
            {isNotUndefined(optionsMap[currentAssignment])
              ? labelAccessor(optionsMap[currentAssignment])
              : 'Unassigned'}
          </Listbox.Button>
          <Listbox.Options as={NodeDetailsListBoxOptions} optionsWidth={'w-60'}>
            {Object.values(optionsMap)
              .filter(isNotUndefined)
              .map((option) => (
                <Listbox.Option
                  value={idAccessor(option)}
                  key={`${itemDescriptor}-${idAccessor(option)}`}
                  as={Fragment}
                >
                  {({ selected, active }) => (
                    <NodeDetailsListBoxOption
                      selected={selected}
                      active={active}
                    >
                      {labelAccessor(option)}
                    </NodeDetailsListBoxOption>
                  )}
                </Listbox.Option>
              ))}
          </Listbox.Options>
        </Listbox>
      </ColumnsTwoToFour>
    </>
  );
}
