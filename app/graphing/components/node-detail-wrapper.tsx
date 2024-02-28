'use client';
import React, { PropsWithChildren, useContext } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useGenericNodeContext } from '../nodes/generic-node-context-creator';
import { NodeInteractionContext } from '../nodes/node-interaction-context-creator';
import { DataNode } from '../../api/zod-mods';
import SelectionOutline from './selection-outline';
import {
  useNodeInteractionContext,
  useNodeSelectedListener
} from '../nodes/node-interaction-context';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

export function NodeDetailWrapper<T>({
  label,
  children,
  node
}: { label: string; node: DataNode<T> } & PropsWithChildren) {
  const { dispatch, hover, selected } = useNodeInteractionContext();
  const isSelected = useNodeSelectedListener(node);

  const handleDispatch = () => {
    dispatch({ type: 'toggleSelect', payload: node.id });
  };
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <div className={'p-0.5'}>
            <SelectionOutline showOutline={isSelected}>
              <div className={'flex w-full'}>
                <button
                  onClick={() => handleDispatch()}
                  className={'btn border-0 m-0'}
                >
                  {isSelected ? (
                    <StarIcon className={'h-4 w-4 fill-amber-300'}></StarIcon>
                  ) : (
                    <StarIconOutline className={'h-4 w-4'}></StarIconOutline>
                  )}
                </button>
                <StandardDisclosureButton
                  open={open}
                  label={label}
                ></StandardDisclosureButton>
              </div>
            </SelectionOutline>
          </div>

          <Disclosure.Panel>{children}</Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

function StandardDisclosureButton({
  open,
  label
}: {
  open: boolean;
  label: string;
}) {
  return (
    <Disclosure.Button
      className={`btn ${
        open ? 'btn-primary' : ''
      } max-w-full grow flex justify-between`}
    >
      {label}
      <ChevronDownIcon
        className={`w-6 h-6 ${
          !open ? 'rotate-90 transform' : ''
        } transition-transform duration-500`}
      ></ChevronDownIcon>
    </Disclosure.Button>
  );
}
