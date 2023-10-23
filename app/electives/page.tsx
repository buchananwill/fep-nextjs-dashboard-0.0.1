import React from 'react';

import { Card } from '@tremor/react';

// Slug[0] = Year Group

interface Props {}

export default async function ElectivesRootPage({}: Props) {
  return (
    <>
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
    </>
  );
}
