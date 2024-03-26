'use client';

import { Fragment, useEffect, useMemo, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { signIn, signOut } from 'next-auth/react';

import Image from 'next/image';
import ProtectedNavigation from './protected-navigation';
import { Text } from '@tremor/react';
import { SvgLogo } from './svg-logo';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

import { getOptionBlocks } from '../api/actions/option-blocks';
import { KnowledgeLevelDto } from '../api/dtos/KnowledgeLevelDtoSchema';
import { ServiceCategoryDto } from '../api/dtos/ServiceCategoryDtoSchema';
import { getOrganizationTypes } from '../api/actions/curriculum-delivery-model';
import ToolTipsToggle from '../generic/components/tooltips/tool-tips-toggle';

interface DropdownItem {
  name: string;
  href: string;
}

const electivesLoading = [{ name: 'Loading...', href: '' }];

const contactTimeDropdown = [
  { name: 'Scatter summary', href: '' },
  { name: 'Per Subject', href: '/per-subject' },
  { name: 'Per Year Group', href: '/per-year-group' }
];

const studentsDropdown = [{ name: 'Students', href: '' }];

const premisesDropdown = [{ name: 'Graph Overview', href: '' }];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar({
  user,
  scheduleId,
  knowledgeLevels,
  serviceCategory
}: {
  scheduleId: number;
  user: any;
  knowledgeLevels: KnowledgeLevelDto[];
  serviceCategory?: ServiceCategoryDto;
}) {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const unsaved = useSearchParams()?.get('unsaved') == 'true';
  const useCache = useSearchParams()?.get('cacheSetting');
  let cacheSetting: string | null;
  if (useCache) cacheSetting = '?cacheSetting=' + useCache;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const [electivesDropdown, setElectivesDropdown] = useState(electivesLoading);

  const [organizationTypes, setOrganizationTypes] = useState<
    DropdownItem[] | undefined
  >();

  useEffect(() => {
    if (isLoading) {
      getOptionBlocks().then((r) => {
        if (r.data) {
          if (organizationTypes !== undefined) setIsLoading(false);
          const receivedDropdownData = r.data.map((carouselGroupDto) => ({
            name: carouselGroupDto.name,
            href: `/${carouselGroupDto.id}`
          }));
          setElectivesDropdown(receivedDropdownData);
        }
      });
    }
  }, [isLoading, organizationTypes]);
  useEffect(() => {
    if (isLoading) {
      getOrganizationTypes().then((r) => {
        if (r.data) {
          if (electivesDropdown !== undefined) setIsLoading(false);
          const receivedOrganizationTypes = r.data.map((orgType) => ({
            name: orgType.name,
            href: `/${orgType.name}`
          }));
          setOrganizationTypes(receivedOrganizationTypes);
        }
      });
    }
  }, [isLoading, electivesDropdown]);

  const { navigation } = useMemo(() => {
    const timetablesDropdown = [
      { name: 'Overview', href: `/${scheduleId}` },
      { name: 'Students', href: `/students/${scheduleId}` }
    ];

    const buildMetricsDropdown = [
      { name: 'Overview', href: `/${scheduleId}` },
      { name: 'Lesson Cycles', href: `/lesson-cycles/${scheduleId}` }
    ];

    const curriculumModelsDropdownItems: DropdownItem[] = knowledgeLevels.map(
      (knowledgeLevel) => ({
        name: knowledgeLevel.name,
        href: `/${knowledgeLevel.levelOrdinal}`
      })
    );

    const bundlesDropdownItems: DropdownItem[] = knowledgeLevels.map(
      (knowledgeLevel) => ({
        name: knowledgeLevel.name,
        href: `/${knowledgeLevel.levelOrdinal}/bundles`
      })
    );

    const navigation = [
      { name: 'Students', href: '/', dropdownItems: studentsDropdown },
      {
        name: 'Timetables',
        href: '/timetables',
        dropdownItems: timetablesDropdown
      },
      {
        name: 'Build Metrics',
        href: `/build-metrics`,
        dropdownItems: buildMetricsDropdown
      },
      {
        name: 'Teaching Categories',
        href: '/teaching-categories',
        dropdownItems: [{ name: 'Secondary', href: '/secondary' }]
      },
      {
        name: 'Work Types',
        href: '/work-types',
        dropdownItems: [{ name: 'All', href: '/lessons/All' }]
      },
      {
        name: 'Models',
        href: '/curriculum/delivery-models',
        dropdownItems: curriculumModelsDropdownItems
      },
      {
        name: 'Bundles',
        href: '/curriculum/delivery-models',
        dropdownItems: bundlesDropdownItems
      },
      {
        name: 'Classes',
        href: '/curriculum/class-hierarchy',
        dropdownItems: organizationTypes || []
      },
      {
        name: 'Electives',
        href: '/electives',
        dropdownItems: electivesDropdown
      },
      // {
      //   name: 'Contact Time',
      //   href: '/contact-time',
      //   dropdownItems: contactTimeDropdown
      // },
      {
        name: 'Premises',
        href: '/premises',
        dropdownItems: premisesDropdown
      }
    ];

    return { timetablesDropdown, buildMetricsDropdown, navigation };
  }, [electivesDropdown, scheduleId, knowledgeLevels, organizationTypes]);

  const handleNavigation = (href: string) => {
    const fullNavigation = useCache ? href + cacheSetting : href;
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <Disclosure as="menu" className="bg-white shadow-sm">
      {({ open }) => (
        <>
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-24 justify-between py-1">
              <div className="flex grow gap-2">
                <ToolTipsToggle />
                <SvgLogo isPending={isPending} />
                <div className="-my-px grid grid-cols-6 gap-x-2 w-full">
                  {navigation.map((dropdownLabel, index) => (
                    <div
                      key={`label-${dropdownLabel.name}`}
                      className="w-full normal-case flex items-center"
                    >
                      <Menu as="div" className="relative text-left w-full">
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
                                        >
                                          <Text>{dropdown.name}</Text>
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
              <div className=" flex items-center ">
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
