'use client';
import { WorkSeriesSchemaBundleLeanDto } from '../../../api/dtos/WorkSeriesSchemaBundleLeanDtoSchema';
import { Card } from '@tremor/react';
import { useSelectiveContextDispatchString } from '../../../components/selective-context/selective-context-manager-string';
import { useSelectiveContextDispatchStringList } from '../../../components/selective-context/selective-context-manager-string-list';
import { Tab } from '@headlessui/react';
import { TabStyled } from '../../../components/tab-layouts/tab-styled';
import React, { Fragment, useMemo, useState } from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { TabPanelStyled } from '../../../components/tab-layouts/tab-panel-styled';

const bundleEditorKey = 'bundles-editor';

interface BundlePanelProps {
  bundleId: string;
  schemaBundleIds: string[];
}

function BundlePanel({ bundleId, schemaBundleIds }: BundlePanelProps) {
  const schemaBundleKey = `schema-bundle-${bundleId}`;
  const panelKey = `${schemaBundleKey}-panel`;

  const { currentState, dispatchUpdate } =
    useSelectiveContextDispatchStringList(
      schemaBundleKey,
      panelKey,
      schemaBundleIds
    );

  if (currentState === undefined) {
    return <div>No state to render!</div>;
  }

  return (
    <TabPanelStyled>
      {
        <ul>
          {currentState.map((schema) => (
            <li key={`${bundleId}-${schema}`}>
              <label className={'cursor-pointer select-none'}>
                Schema ID: {schema}
                <input
                  type={'checkbox'}
                  id={schema}
                  className={'hidden'}
                  onClick={() => {
                    dispatchUpdate({
                      contextKey: schemaBundleKey,
                      value: currentState.filter((id) => id !== schema)
                    });
                  }}
                ></input>
              </label>
            </li>
          ))}
        </ul>
      }
    </TabPanelStyled>
  );
}

export function BundleEditor({
  bundleLeanDtos
}: {
  bundleLeanDtos: WorkSeriesSchemaBundleLeanDto[];
}) {
  const bundleIds = useMemo(
    () => bundleLeanDtos.map(({ id }) => id.toString()),
    [bundleLeanDtos]
  );
  const schemaBundles = useMemo(() => {
    return bundleLeanDtos.map((dto) => dto.workProjectSeriesSchemaIds);
  }, [bundleLeanDtos]);
  // const [currentBundles, setCurrentBundles] = useState(bundleIds);
  const { currentState: currentBundles, dispatchUpdate } =
    useSelectiveContextDispatchStringList(
      bundleEditorKey,
      bundleEditorKey,
      bundleIds
    );

  if (
    currentBundles === undefined ||
    (currentBundles && currentBundles.length == 0)
  ) {
    return <Card>No bundles!</Card>;
  }

  const gridColumns = currentBundles.length;

  return (
    <Card>
      <Tab.Group>
        <div className={'w-full flex items-center mb-2'}>
          <Tab.List as={Fragment}>
            <div
              style={{
                gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
                display: 'grid',
                width: 'calc(100% - 50px)',
                flexGrow: 1
              }}
            >
              {currentBundles.map((id) => (
                <TabStyled key={id}>{id}</TabStyled>
              ))}
            </div>
          </Tab.List>

          <button className={` btn btn-sm btn-outline px-0 w-[50px] `}>
            <PlusCircleIcon className={'h-5 w-5'}></PlusCircleIcon>
          </button>
        </div>
        <Tab.Panels>
          {currentBundles.map((bundleId, index) => (
            <BundlePanel
              key={bundleId}
              bundleId={bundleId}
              schemaBundleIds={schemaBundles[index]}
            ></BundlePanel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </Card>
  );
}
