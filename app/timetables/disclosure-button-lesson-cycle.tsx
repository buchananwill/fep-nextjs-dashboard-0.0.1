'use client';

import { LessonCycle } from '../api/state-types';
import React from 'react';
import { ButtonClusterTransformer } from '../generic/components/disclosure-list/disclosure-list-panel';

export const DisclosureButtonLessonCycle: ButtonClusterTransformer<
  LessonCycle
> = ({ data: { name } }) => {
  return (
    <div className="leading-none text-sm grow w-full min-h-max py-3 pl-2">
      {name}
    </div>
  );
};
