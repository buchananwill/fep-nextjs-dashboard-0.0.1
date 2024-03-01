'use client';
import { WorkSeriesSchemaBundleLeanDto } from '../../../api/dtos/WorkSeriesSchemaBundleLeanDtoSchema';
import { Card } from '@tremor/react';
import {
  useSelectiveContextDispatchStringList,
  useSelectiveContextListenerStringList
} from '../../../components/selective-context/selective-context-manager-string-list';
import { Tab } from '@headlessui/react';
import { TabStyled } from '../../../components/tab-layouts/tab-styled';
import React, { Fragment, ReactNode, useEffect, useMemo } from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { TabPanelStyled } from '../../../components/tab-layouts/tab-panel-styled';

export const BundleEditorKey = 'bundles-editor';
function OptionChooserItem({
  children,
  checkedStyling,
  bundleKey,
  optionKey,
  listenerKey,
  ...props
}: {
  children: ReactNode;
  checkedStyling: string;
  bundleKey: string;
  optionKey: string;
  listenerKey: string;
} & React.HTMLAttributes<HTMLInputElement>) {
  const { currentState } = useSelectiveContextListenerStringList(
    bundleKey,
    listenerKey,
    []
  );

  const checked = currentState.includes(optionKey);

  return (
    <label
      className={`inline-block relative w-full select-none cursor-pointer text-sm hover:bg-blue-200 p-1 ${
        checked ? checkedStyling : ''
      } focus-within:ring-2 focus-within:ring-offset-1 focus-within:ring-blue-500 focus-within:z-20 `}
    >
      <input
        type={'checkbox'}
        checked={checked}
        {...props}
        className={'pointer-events-none absolute opacity-0  '}
        aria-labelledby={`label-${optionKey}`}
      />
      {children}
    </label>
  );
}

interface BundlePanelProps {
  bundleId: string;
  schemaBundleIds: string[];
  schemaOptions: { [key: string]: string };
}

export const schemaBundleKeyPrefix = 'schema-bundle:';

function BundlePanel({
  bundleId,
  schemaBundleIds,
  schemaOptions
}: BundlePanelProps) {
  const { schemaBundleKey, panelKey } = useMemo(() => {
    const schemaBundleKey = `${schemaBundleKeyPrefix}${bundleId}`;
    const panelKey = `${schemaBundleKey}-panel`;
    return { schemaBundleKey, panelKey };
  }, [bundleId]);

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
      <div className={'grid-cols-2 w-full flex p-1 gap-1'}>
        <div className={'w-full'}>
          {currentState.map((schema) => {
            const name = schemaOptions[schema];
            return (
              <OptionChooserItem
                key={`${bundleId}-${schema}`}
                bundleKey={schemaBundleKey}
                optionKey={schema}
                listenerKey={`${schemaBundleKey}-summary`}
                onChange={() => {
                  dispatchUpdate({
                    contextKey: schemaBundleKey,
                    value: currentState.filter((id) => id !== schema)
                  });
                }}
                checkedStyling={'bg-emerald-100'}
              >
                {schemaOptions[schema]}
              </OptionChooserItem>
            );
          })}
        </div>
        <div className={'w-full'}>
          {Object.keys(schemaOptions)
            // .filter((schemaOption) => !currentState.includes(schemaOption))
            .map((option) => {
              const schemaName = schemaOptions[option];
              return (
                <OptionChooserItem
                  key={`${bundleId}-${option}-optional`}
                  bundleKey={schemaBundleKey}
                  optionKey={option}
                  listenerKey={`${schemaBundleKey}-${option}-optional`}
                  onChange={(event) => {
                    const include = event.currentTarget.checked;
                    if (include) {
                      dispatchUpdate({
                        contextKey: schemaBundleKey,
                        value: [...currentState, option]
                      });
                    } else {
                      dispatchUpdate({
                        contextKey: schemaBundleKey,
                        value: currentState.filter((id) => id !== option)
                      });
                    }
                  }}
                  checkedStyling={'opacity-25'}
                >
                  {schemaName}
                </OptionChooserItem>
              );
            })}
        </div>
      </div>
    </TabPanelStyled>
  );
}

export function BundleEditor({
  bundleLeanDtos,
  schemaOptions
}: {
  bundleLeanDtos: WorkSeriesSchemaBundleLeanDto[];
  schemaOptions: { [key: string]: string };
}) {
  const bundleIds = useMemo(
    () => bundleLeanDtos.map(({ id }) => id.toString()),
    [bundleLeanDtos]
  );
  const schemaBundles = useMemo(() => {
    return bundleLeanDtos.map((dto) => dto.workProjectSeriesSchemaIds);
  }, [bundleLeanDtos]);
  const { currentState: currentBundles, dispatchUpdate } =
    useSelectiveContextDispatchStringList(
      BundleEditorKey,
      BundleEditorKey,
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
              schemaOptions={schemaOptions}
            ></BundlePanel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </Card>
  );
}
