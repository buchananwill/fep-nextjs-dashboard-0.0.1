'use client';

import React from 'react';
import {
  GenericLinkContext,
  GenericLinkDispatchContext
} from './generic-link-context-creator';

// Example of a generic Provider component that can be used to wrap parts of your app
export const GenericLinkContextProvider = <T,>({
  children,
  links,
  uniqueGraphName
}: {
  children: React.ReactNode;
  links: T[];
  uniqueGraphName: string;
}) => {
  const [linkState, setLinkState] = React.useState<T[]>(links);

  return (
    <GenericLinkContext.Provider value={{ links: linkState, uniqueGraphName }}>
      <GenericLinkDispatchContext.Provider value={setLinkState}>
        {children}
      </GenericLinkDispatchContext.Provider>
    </GenericLinkContext.Provider>
  );
};
