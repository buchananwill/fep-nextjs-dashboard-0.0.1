'use client';
import { ServiceCategoryDto } from '../../api/dtos/ServiceCategoryDtoSchema';
import { Tab } from '@headlessui/react';
import { ReactNode } from 'react';
import { TabStyled } from '../../generic/components/tab-layouts/tab-styled';
import { TabPanelStyled } from '../../generic/components/tab-layouts/tab-panel-styled';

export function ServiceCategoryEditor({
  metaData: { knowledgeDomainDescriptor, knowledgeLevelDescriptor },
  knowledgeDomainPanel,
  knowledgeLevelPanel
}: {
  metaData: ServiceCategoryDto;
  knowledgeDomainPanel: ReactNode;
  knowledgeLevelPanel: ReactNode;
}) {
  return (
    <Tab.Group>
      <Tab.List as={'div'} className={'grid grid-cols-2 gap-2 mb-2'}>
        <TabStyled>{knowledgeDomainDescriptor}</TabStyled>
        <TabStyled>{knowledgeLevelDescriptor}</TabStyled>
      </Tab.List>
      <Tab.Panels as={'div'} className={''}>
        <TabPanelStyled>{knowledgeDomainPanel}</TabPanelStyled>
        <TabPanelStyled>{knowledgeLevelPanel}</TabPanelStyled>
      </Tab.Panels>
    </Tab.Group>
  );
}
