'use client';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Fragment, useState, useTransition } from 'react';
import React from 'react';
// const colorSettings = {
//   default: 'green',
//   reload: 'orange',
//   noCache: 'red'
// };

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

export default function SearchParamsDropdown() {
  const [cacheSetting, setCacheSetting] = useState<CacheSetting>(
    CacheSetting.Default
  );
  const { replace } = useRouter();
  const pathname = usePathname();
  const currentSetting = useSearchParams()?.get('cacheSetting');
  const handleCacheSelect = (cacheSetting: CacheSetting) => {
    setCacheSetting(cacheSetting);

    const params = new URLSearchParams(window.location.search);

    if (cacheSetting == CacheSetting.Default) {
      params.delete('cacheSetting');
    } else {
      params.set('cacheSetting', cacheSetting);
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  const color = colorSettings[cacheSetting];

  const [isPending, startTransition] = useTransition();
  return (
    <div className="w-32 ml-2">
      <Listbox
        value={cacheSetting}
        onChange={handleCacheSelect}

        // className={`btn bg-${color}-400 hover:bg-${color}-500 normal-case text-xs w-fit h-min min-h-0 p-2 my-0 mx-2`}
      >
        <div className=" relative mt-1">
          <Listbox.Button
            className={`bg-${color}-300 w-full relative cursor-default rounded-lg py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-300 sm:text-sm`}
          >
            <span className="block truncate">{cacheSetting}</span>
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
            <Listbox.Options className="p-1 z-10 w-full absolute mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {Object.entries(colorSettings).map((entry, index) => {
                return (
                  <Listbox.Option
                    key={entry[0]}
                    value={entry[0]}
                    className={({ active }) =>
                      `relative cursor-default select-none px-2 py-1 ${
                        active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                      }`
                    }
                  >
                    {entry[0]}
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
