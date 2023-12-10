'use client';
import { ButtonSurroundTransformer } from '../components/list-disclosure-panel';
import { LessonCycle } from '../api/state-types';
import { Disclosure } from '@headlessui/react';
import React from 'react';
import { Text } from '@tremor/react';

export const ButtonTransformerLessonCycle: ButtonSurroundTransformer<
  LessonCycle
> = ({ data: { name } }) => {
  return (
    <>
      <span className="text-xs ">{name}</span>
    </>
  );
};
