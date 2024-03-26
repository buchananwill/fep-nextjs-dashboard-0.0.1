import React from 'react';
import { Tab } from '@headlessui/react';

export function TabPanelStyled({ children }: { children: React.ReactNode }) {
  return (
    <Tab.Panel
      className={
        'outline-2 outline-slate-200 overflow-auto outline  rounded-md'
      }
    >
      {children}
    </Tab.Panel>
  );
}
