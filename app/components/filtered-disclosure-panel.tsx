'use client';
import React from 'react';

import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';

export type ButtonSurroundTransformer<R> = React.FC<TransformerProps<R>>;

export type ButtonTransformer<R> = React.FC<TransformerProps<R>>;

export type PanelTransformer<R> = React.FC<TransformerProps<R>>;

interface TransformerProps<R> {
  data: R;
  children?: React.ReactNode;
  className?: string;
}

interface FilterDisclosurePanelProps<R> {
  data: R[];
  buttonSurround: ButtonSurroundTransformer<R>;
  buttonTransformer: ButtonTransformer<R>;
  panelTransformer: PanelTransformer<R>;
}

export default function FilterDisclosurePanel<R>({
  data,
  panelTransformer: PanelTransformerComponent,
  buttonSurround: ButtonSurroundComponent,
  buttonTransformer: ButtonTransformerComponent
}: FilterDisclosurePanelProps<R>) {
  try {
    return (
      <>
        <div className="pb-4 justify-left px-2">
          {data &&
            data.map((element, index) => (
              <div key={`${index}`}>
                <div className="w-full px-0 py-0 m-0">
                  <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-0">
                    <Disclosure>
                      {({ open }) => (
                        <>
                          {' '}
                          <div className="flex w-full items-center grow-0 justify-between rounded-lg bg-gray-100">
                            <ButtonSurroundComponent
                              data={element}
                              className="w-full"
                            >
                              <Disclosure.Button className="border-x-2 border-dotted grow py-2 w-full text-left text-sm font-medium hover:bg-emerald-100 focus:outline-none focus-visible:ring focus-visible:ring-emerald-500/75">
                                <span className="grow ml-2">
                                  <ButtonTransformerComponent data={element} />
                                </span>
                              </Disclosure.Button>
                            </ButtonSurroundComponent>
                            <ChevronUpIcon
                              className={`${
                                open ? 'rotate-180 transform' : ''
                              } h-5 w-5 mr-1`}
                            />
                          </div>
                          <Disclosure.Panel className="border-dotted rounded border-2 px-4 pt-4 pb-2 text-sm text-gray-500">
                            <div className="flex flex-col mx-0 my-2 w-full ">
                              <PanelTransformerComponent data={element} />
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </>
    );
  } catch (error) {
    console.log('Error: ', error);
  }
}
