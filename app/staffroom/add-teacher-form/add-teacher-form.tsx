'use client';
import React, { Fragment, PropsWithChildren, useMemo } from 'react';

import { Controller, useForm } from 'react-hook-form';
import { Title } from '@tremor/react';
import { Listbox } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  NewProviderRoleDto,
  NewProviderRoleDtoSchema
} from '../../api/dtos/NewProviderRoleDtoSchema-Validation';
import { createTeacher } from '../../api/actions/custom/provider-roles';
import { useProviderRoleStringMapContext } from '../contexts/providerRoles/provider-role-string-map-context-creator';
import { Card, CardBody, CardFooter } from '@nextui-org/card';
import { Button } from '@nextui-org/button';
import { TransientIdOffset } from '../../graphing/editing/functions/graph-edits';
import { useSelectiveContextGlobalListener } from '../../selective-context/components/global/selective-context-manager-global';
import { getNameSpacedKey } from '../../selective-context/components/controllers/dto-id-list-controller';
import { EntityNamesMap } from '../../api/entity-names-map';
import { ObjectPlaceholder } from '../../api/main';
import { StringMap } from '../../contexts/string-map-context/string-map-reducer';
import { KnowledgeDomainDto } from '../../api/dtos/KnowledgeDomainDtoSchema';

function ErrorMessage({ children }: PropsWithChildren) {
  if (!children) return null;
  return <div className={'text-red-400 text-xs'}>{children}</div>;
}

export default function AddTeacherForm() {
  const { currentState: domainMap } = useSelectiveContextGlobalListener<
    StringMap<KnowledgeDomainDto>
  >({
    contextKey: getNameSpacedKey(EntityNamesMap.knowledgeDomain, 'stringMap'),
    listenerKey: 'addTeacherPage',
    initialValue: ObjectPlaceholder
  });
  const { domainArray } = useMemo(() => {
    const domainArray = Object.values(domainMap);

    return { domainArray };
  }, [domainMap]);
  const { register, control, formState, setValue, handleSubmit, trigger } =
    useForm<NewProviderRoleDto>({
      defaultValues: {
        knowledgeDomain: domainArray[0],
        partyId: TransientIdOffset
      },
      resolver: zodResolver(NewProviderRoleDtoSchema)
    });

  const { providerRoleDtoStringMapDispatch } =
    useProviderRoleStringMapContext();

  async function onSubmit(data: NewProviderRoleDto) {
    console.log('submitting');
    createTeacher(data).then(({ data: dataResponse }) => {
      if (dataResponse)
        providerRoleDtoStringMapDispatch({
          type: 'update',
          payload: { key: dataResponse.id.toString(), data: dataResponse }
        });
    });
  }
  return (
    <Card className={'overflow-visible'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardBody className={'flex flex-col gap-y-4 overflow-visible'}>
          <Title className={'py-2'}>Form to add a teacher.</Title>

          <div>
            <div>Create new person:</div>
            <div className={'flex gap-x-4'}>
              <div>
                <input
                  {...register('firstName', { required: true })}
                  id={'firstName'}
                  type={'text'}
                  placeholder={'First Name:'}
                  className={'mb-2'}
                />
                <ErrorMessage>
                  {formState.errors.firstName?.message}
                </ErrorMessage>
              </div>
              <div>
                <input
                  {...register('lastName', { required: true })}
                  id={'lastName'}
                  type={'text'}
                  placeholder={'Last Name:'}
                  className={'mb-2'}
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
                    console.log(formState);
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
        <CardFooter className={'flex justify-center flex-col'}>
          <Button color={'primary'} type={'submit'}>
            Submit
          </Button>
          <ErrorMessage>
            {Object.keys(formState.errors).length > 0 &&
              Object.entries(formState.errors).map(([field, error]) => (
                <li key={field}>
                  {error.message || `Error in field ${field}`}
                </li>
              ))}
          </ErrorMessage>
        </CardFooter>
      </form>
    </Card>
  );
}
