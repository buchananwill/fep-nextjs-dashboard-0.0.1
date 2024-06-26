'use client';

import ProviderRoleDisclosureList from './teachers/provider-role-disclosure-list-panel/provider-role-disclosure-list';
import React from 'react';
import ToolCard from '../generic/components/tool-card/tool-card';

export function TeachersToolCard() {
  return (
    <ToolCard height={600}>
      <ToolCard.UpperSixth>
        <div
          className={
            'w-full  h-full px-2 cursor-default select-none flex items-center justify-center overflow-hidden'
          }
        >
          Teachers
        </div>
      </ToolCard.UpperSixth>

      <ToolCard.LowerFiveSixths>
        <ProviderRoleDisclosureList />
      </ToolCard.LowerFiveSixths>
    </ToolCard>
  );
}
