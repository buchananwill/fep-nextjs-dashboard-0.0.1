'use client';

import { Fragment, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { signIn, signOut } from 'next-auth/react';

import Image from 'next/image';
import ProtectedNavigation from './protected-navigation';
import { Text } from '@tremor/react';
import { SvgLogo } from './svg-logo';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const electivesDropdown = [
  { name: 'Year 9', href: '/9' },
  { name: 'Year 10', href: '/10' },
  { name: 'Year 11', href: '/11' },
  { name: 'Year 12', href: '/12' },
  { name: 'Year 13', href: '/13' }
];

const contactTimeDropdown = [
  { name: 'Scatter summary', href: '' },
  { name: 'Per Subject', href: '/per-subject' },
  { name: 'Per Year Group', href: '/per-year-group' }
];

const studentsDropdown = [{ name: 'Students', href: '' }];

const timetablesDropdown = [
  { name: 'Timetables', href: '/1452' },
  { name: 'Build Metrics', href: '/1452/build-metrics' }
];

const premisesDropdown = [{ name: 'Premises', href: '' }];

const navigation = [
  { name: 'Students', href: '/', dropdownItems: studentsDropdown },
  {
    name: 'Timetables',
    href: '/timetables',
    dropdownItems: timetablesDropdown
  },
  { name: 'Electives', href: '/electives', dropdownItems: electivesDropdown },
  {
    name: 'Contact Time',
    href: '/contact-time',
    dropdownItems: contactTimeDropdown
  },
  { name: 'Premises', href: '/premises', dropdownItems: premisesDropdown }
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar({ user }: { user: any }) {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const unsaved = useSearchParams()?.get('unsaved') == 'true';
  const useCache = useSearchParams()?.get('cacheSetting');
  let cacheSetting: string | null;
  if (useCache) cacheSetting = '?cacheSetting=' + useCache;
  const router = useRouter();

  const handleNavigation = (href: string) => {
    const fullNavigation = useCache ? href + cacheSetting : href;
    startTransition(() => {
      router.push(fullNavigation);
    });
  };

  return (
    <Disclosure as="nav" className="bg-white shadow-sm">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <SvgLogo isPending={isPending} />
                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-2">
                  {navigation.map((dropdownLabel, index) => (
                    <div
                      key={`label-${dropdownLabel.name}`}
                      className="w-32 normal-case my-2 mx-0"
                    >
                      <Menu as="div" className="relative text-left">
                        <div>
                          <Menu.Button className="inline-flex w-full justify-center rounded-md bg-gray-100 py-2 text-sm font-medium hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                            <Text>{dropdownLabel.name}</Text>
                            <ChevronDownIcon
                              className="h-5 w-5 text-gray-600"
                              aria-hidden="true"
                            />
                          </Menu.Button>
                        </div>
                        {dropdownLabel.dropdownItems.length == 0 ? (
                          <div></div>
                        ) : (
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="z-40 absolute left-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                              <div className="px-1 py-1">
                                {dropdownLabel.dropdownItems.map(
                                  (dropdown, index) => (
                                    <Menu.Item
                                      key={`${dropdownLabel.name}-${index}`}
                                    >
                                      {({ close }) => (
                                        <ProtectedNavigation
                                          onConfirm={() => {
                                            close();
                                            handleNavigation(
                                              `${dropdownLabel.href}${dropdown.href}`
                                            );
                                          }}
                                          isActive={
                                            pathname ===
                                            `${dropdownLabel.href}${dropdown.href}`
                                          }
                                          requestConfirmation={unsaved}
                                          classNames="group flex w-full items-center rounded-md px-2 py-2 text-sm"
                                        >
                                          {dropdown.name}
                                        </ProtectedNavigation>
                                      )}
                                    </Menu.Item>
                                  )
                                )}
                              </div>
                            </Menu.Items>
                          </Transition>
                        )}
                      </Menu>
                    </div>
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      <Image
                        className="h-8 w-8 rounded-full"
                        src={user?.image || 'https://avatar.vercel.sh/leerob'}
                        height={32}
                        width={32}
                        alt={`${user?.name || 'placeholder'} avatar`}
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {user ? (
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'flex w-full px-4 py-2 text-sm text-gray-700'
                              )}
                              onClick={() => signOut()}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      ) : (
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'flex w-full px-4 py-2 text-sm text-gray-700'
                              )}
                              onClick={() => signIn('github')}
                            >
                              Sign in
                            </button>
                          )}
                        </Menu.Item>
                      )}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pt-2 pb-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    pathname === item.href
                      ? 'bg-slate-50 border-slate-500 text-slate-700'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
                    'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
                  )}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4 pb-3">
              {user ? (
                <>
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <Image
                        className="h-8 w-8 rounded-full"
                        src={user.image}
                        height={32}
                        width={32}
                        alt={`${user.name} avatar`}
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {user.name}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <button
                      onClick={() => signOut()}
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                <div className="mt-3 space-y-1">
                  <button
                    onClick={() => signIn('FEP Spring Server')}
                    className="flex w-full px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  >
                    Sign in
                  </button>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
