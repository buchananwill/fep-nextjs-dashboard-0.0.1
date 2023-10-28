import React, { Suspense } from 'react';

import { Card, Text, Title } from '@tremor/react';
import CommitChanges from './commit-changes';
import ToolTipsToggle from './tool-tips-toggle';
import { RefreshDropdown } from '../components/refresh-dropdown';

// Slug[0] = Year Group

interface Props {}

export default async function ElectivesRootPage({}: Props) {
  return (
    <>
      {' '}
      <div className="flex w-full items-baseline grow-0">
        <Title>Option Blocks</Title>
        <Text className="mx-2">Subscription Analysis</Text>
        <span className="grow"></span>
        <CommitChanges>Commit Changes</CommitChanges>
        <ToolTipsToggle></ToolTipsToggle>
        <RefreshDropdown />
      </div>
      <div className="flex w-full items-top justify-between pt-4">
        <Suspense>
          <div className="flex w-full items-top justify-between pt-4">
            <Card className="flex-shrink-0 flex-grow max-w-4xl min-h-72">
              <div className="w-full flex justify-center">
                <p>Please select a year group to view their electives.</p>
              </div>
            </Card>

            <Card className="max-w-sm ml-2 p-4 max-h-96 overflow-y-scroll sticky top-4">
              No year group selected.
            </Card>
          </div>
        </Suspense>
      </div>
    </>
  );
}
