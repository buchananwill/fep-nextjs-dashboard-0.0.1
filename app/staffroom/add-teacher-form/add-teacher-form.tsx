'use client';
import React, {
  Fragment,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState
} from 'react';

import { Controller, useForm } from 'react-hook-form';
import { Title } from '@tremor/react';
import { Combobox, Listbox, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  NewProviderRoleDto,
  NewProviderRoleDtoSchema
} from '../../api/dtos/NewProviderRoleDtoSchema';
import { PersonDto } from '../../api/dtos/PersonDtoSchema';
import { TransientIdOffset } from '../../graphing/editing/functions/graph-edits';
import { performApiAction } from '../../api/actions/performApiAction';
import { createTeacher } from '../../api/actions/provider-roles';
import { useServiceCategoryContext } from '../../work-types/lessons/use-service-category-context';
import { useProviderRoleStringMapContext } from '../contexts/providerRoles/provider-role-string-map-context-creator';
import { Overlay } from '../../generic/components/overlays/overlay';
import { Card, CardBody, CardFooter } from '@nextui-org/card';
import { Button } from '@nextui-org/button';

const partyData: PersonDto[] = [
  {
    id: 1,
    personalName: 'Dave',
    familyName: 'Bikeson',
    dateOfBirth: '1985-10-26'
  },
  {
    id: 2,
    personalName: 'Bob',
    familyName: 'MacCycle',
    dateOfBirth: '1955-11-05'
  }
];

function ErrorMessage({ children }: PropsWithChildren) {
  if (!children) return null;
  return <div className={'text-red-400 text-xs'}>{children}</div>;
}

export default function AddTeacherForm() {
  const { domainMap } = useServiceCategoryContext();
  const { domainArray } = useMemo(() => {
    const domainArray = Object.values(domainMap);

    return { domainArray };
  }, [domainMap]);
  const { register, control, formState, setValue, handleSubmit, trigger } =
    useForm<NewProviderRoleDto>({
      defaultValues: {
        knowledgeDomain: domainArray[0]
      },
      resolver: zodResolver(NewProviderRoleDtoSchema)
    });
  const [selectedParty, setSelectedParty] = useState<PersonDto | null>(null);
  const [query, setQuery] = useState<string>('');
  const [parties, setParties] = useState<PersonDto[]>([]);
  const [partyEditingDisabled, setPartyEditingDisabled] = useState(false);
  const { providerRoleDtoStringMapDispatch } =
    useProviderRoleStringMapContext();

  const [serverAvailable] = useState(true);

  const fetchParties = async (query: string) => {
    const matchIgnoreCase = (name: string) =>
      name.toLowerCase().includes(query.toLowerCase());
    const filteredParties = partyData.filter(
      ({ personalName, familyName }: PersonDto) =>
        matchIgnoreCase(personalName) || matchIgnoreCase(familyName)
    );
    setParties(filteredParties);
  };

  useEffect(() => {
    fetchParties(query).then(() => console.log('parties fetched'));
  }, [query]);

  const handlePartySelect = async (party: PersonDto | null) => {
    setSelectedParty(party);
    if (party != null) {
      setValue('firstName', party.personalName);
      setValue('lastName', party.familyName);
      setValue('partyId', party.id);
      await trigger();
      setPartyEditingDisabled(true);
    } else {
      setValue('firstName', '');
      setValue('lastName', '');
      setValue('partyId', TransientIdOffset);
      setPartyEditingDisabled(false);
    }
  };

  async function onSubmit(data: NewProviderRoleDto) {
    performApiAction(() => createTeacher(data)).then(
      ({ data: dataResponse }) => {
        if (dataResponse)
          providerRoleDtoStringMapDispatch({
            type: 'update',
            payload: { key: dataResponse.id.toString(), data: dataResponse }
          });
      }
    );
  }
  return (
    <Card className={'overflow-visible'}>
      {!serverAvailable && <Overlay>Server not available.</Overlay>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardBody className={'flex flex-col gap-y-4 overflow-visible'}>
          <Title className={'py-2'}>Form to add a teacher.</Title>
          <div>
            <div>Use existing person:</div>
            <Controller
              control={control}
              name={'partyId'}
              render={() => (
                <Combobox
                  value={selectedParty}
                  onChange={(party) => handlePartySelect(party)}
                  nullable
                >
                  <div className="relative mt-1">
                    <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                      <Combobox.Input
                        className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 rounded-lg"
                        displayValue={(party: PersonDto) => {
                          return party != null
                            ? `${party.personalName} ${party.familyName}`
                            : '';
                        }}
                        onChange={(event) => setQuery(event.target.value)}
                      />
                      <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </Combobox.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                      afterLeave={() => setQuery('')}
                    >
                      <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
                        {parties.length === 0 && query !== '' ? (
                          <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                            Nothing found.
                          </div>
                        ) : (
                          parties.map((person) => (
                            <Combobox.Option
                              key={person.id}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                  active
                                    ? 'bg-teal-600 text-white'
                                    : 'text-gray-900'
                                }`
                              }
                              value={person}
                            >
                              {({ selected, active }) => (
                                <>
                                  <span
                                    className={`block truncate ${
                                      selected ? 'font-medium' : 'font-normal'
                                    }`}
                                  >
                                    {person.personalName} {person.familyName}
                                  </span>
                                  {selected ? (
                                    <span
                                      className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                        active ? 'text-white' : 'text-teal-600'
                                      }`}
                                    >
                                      <CheckIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Combobox.Option>
                          ))
                        )}
                      </Combobox.Options>
                    </Transition>
                  </div>
                </Combobox>
              )}
            />
          </div>

          <div>
            {' '}
            <div className={`${partyEditingDisabled ? 'opacity-25' : ''}`}>
              Create new person:
            </div>
            <div className={'flex gap-x-4'}>
              <div>
                <input
                  {...register('firstName', { required: true })}
                  id={'firstName'}
                  disabled={partyEditingDisabled}
                  type={'text'}
                  placeholder={'First Name:'}
                  className={'input input-bordered mb-2'}
                />
                <ErrorMessage>
                  {formState.errors.firstName?.message}
                </ErrorMessage>
              </div>
              <div>
                <input
                  {...register('lastName', { required: true })}
                  id={'lastName'}
                  disabled={partyEditingDisabled}
                  type={'text'}
                  placeholder={'Last Name:'}
                  className={'input input-bordered mb-2'}
                />
                <ErrorMessage>
                  {formState.errors.lastName?.message}
                </ErrorMessage>
              </div>
            </div>
          </div>

          <div>
            <div>Select Main Expertise:</div>
            <Controller
              control={control}
              name={'knowledgeDomain'}
              render={({ field }) => (
                <Listbox
                  value={field.value}
                  name={'knowledgeDomain'}
                  as={'div'}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                >
                  <Listbox.Button
                    className={
                      'hover:bg-gray-100 relative w-full cursor-pointer mb-2 rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 '
                    }
                  >
                    {field.value?.name || 'Select...'}
                  </Listbox.Button>
                  <Listbox.Options
                    className={
                      'absolute mt-1 max-h-60 w-full z-20 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm '
                    }
                  >
                    {domainArray.map((knowledgeDomain) => (
                      <Listbox.Option
                        key={knowledgeDomain.id}
                        value={knowledgeDomain}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? 'bg-blue-50 text-blue-900'
                              : 'text-gray-900'
                          }`
                        }
                      >
                        <>
                          {knowledgeDomain.name}
                          {field.value?.id == knowledgeDomain.id ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Listbox>
              )}
            />
          </div>
        </CardBody>
        <CardFooter className={'flex justify-center'}>
          <Button color={'primary'}>Submit</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
