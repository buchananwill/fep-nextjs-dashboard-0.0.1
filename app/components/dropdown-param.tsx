'use client';
import { Menu, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState, useTransition } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { usePathname, useRouter } from 'next/navigation';

export default function DropdownParam({
  paramOptions
}: {
  paramOptions: string[];
}) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const { push } = useRouter();

  const setScheduleParam = (param: string) => {
    if (!pathname) return;
    const rootPath = pathname.lastIndexOf('/') + 1;
    const updatedPath = pathname.slice(0, rootPath) + param;
    startTransition(() => {
      push(updatedPath);
    });
  };

  return (
    <div className="w-32 relative mx-2">
      <Menu as="div" className="text-right">
        <div>
          <Menu.Button className="w-full flex justify-center rounded-lg bg-gray-300 px-4 py-2 text-sm font-medium text-white hover:bg-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
            Schedules
            <ChevronDownIcon
              className="-mr-1 ml-2 h-5 w-5 text-gray-500 "
              aria-hidden="true"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-32 max-h-40 overflow-y-auto overflow-x-hidden z-50 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="px-1 py-1 w-full">
              {paramOptions.map((option, index) => (
                <Menu.Item key={index}>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-emerald-500 text-white' : 'text-gray-900'
                      } group flex justify-end w-full rounded-md px-2 py-2 text-sm`}
                      onClick={() => setScheduleParam(option)}
                    >
                      {option}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
