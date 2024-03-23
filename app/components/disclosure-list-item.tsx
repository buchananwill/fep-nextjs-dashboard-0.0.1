'use client';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import React from 'react';
import {
  ButtonClusterTransformer,
  DisclosureLabelTransformer,
  PanelTransformer
} from './disclosure-list-panel';

export function DisclosureListItem<D>({
  dataElement,
  buttonCluster: ButtonCluster,
  disclosureLabelTransformer: ButtonTransformerComponent,
  panelTransformer: PanelTransformerComponent
}: {
  dataElement: D;
  buttonCluster: ButtonClusterTransformer<D>;
  disclosureLabelTransformer: DisclosureLabelTransformer<D>;
  panelTransformer: PanelTransformer<D>;
}) {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <div className="flex w-full h-full items-center grow-0 justify-between rounded-lg bg-gray-100">
            <ButtonCluster data={dataElement}></ButtonCluster>
            <Disclosure.Button className="box-content border-x-2 border-y-0 border-dotted h-full grow p-0 m-0 w-full text-left text-sm font-medium hover:bg-emerald-100 focus:outline-none focus-visible:ring focus-visible:ring-emerald-500/75">
              <ButtonTransformerComponent data={dataElement} />
            </Disclosure.Button>
            <ChevronUpIcon
              className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 mr-1`}
            />
          </div>
          <Disclosure.Panel className="border-dotted rounded border-2 px-4 pt-4 pb-2 text-sm text-gray-500">
            <div className="flex flex-col mx-0 mt-0 mb-2 w-full ">
              <PanelTransformerComponent data={dataElement} />
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
