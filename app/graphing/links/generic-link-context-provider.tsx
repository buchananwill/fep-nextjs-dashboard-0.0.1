'use client';

import React from 'react';
import {
  GenericLinkContext,
  GenericLinkDispatchContext
} from './generic-link-context-creator';
import { DataLink } from '../../api/zod-mods';
import { useFilteredLinkMemo } from '../aggregate-functions/use-filtered-link-memo';

// Example of a generic Provider component that can be used to wrap parts of your app
export const GenericLinkContextProvider = <T,>({
  children,
  links,
  uniqueGraphName
}: {
  children: React.ReactNode;
  links: DataLink<T>[];
  uniqueGraphName: string;
}) => {
  const { filteredLinks } = useFilteredLinkMemo(
    links,
    (closure) => closure.value == 1
  );

  const [linkState, setLinkState] =
    React.useState<DataLink<T>[]>(filteredLinks);

  return (
    <GenericLinkContext.Provider value={{ links: linkState, uniqueGraphName }}>
      <GenericLinkDispatchContext.Provider value={setLinkState}>
        {children}
      </GenericLinkDispatchContext.Provider>
    </GenericLinkContext.Provider>
  );
};
