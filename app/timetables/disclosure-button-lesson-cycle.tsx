'use client';
import { ButtonClusterTransformer } from '../components/disclosure-list/disclosure-list-panel';
import { LessonCycle } from '../api/state-types';
import { Disclosure } from '@headlessui/react';
import React from 'react';
import { Text } from '@tremor/react';

export const DisclosureButtonLessonCycle: ButtonClusterTransformer<
  LessonCycle
> = ({ data: { name } }) => {
  return (
    <div className="leading-none text-sm grow w-full min-h-max py-3 pl-2">
      {name}
    </div>
  );
};
