'use client';
import { WorkSeriesSchemaBundleLeanDto } from '../../../api/dtos/WorkSeriesSchemaBundleLeanDtoSchema';
import { Card } from '@tremor/react';
import { useSelectiveContextDispatchStringList } from '../../../components/selective-context/selective-context-manager-string-list';
import { Tab } from '@headlessui/react';
import { TabStyled } from '../../../components/tab-layouts/tab-styled';
import React, {
  Fragment,
  PropsWithChildren,
  ReactNode,
  useMemo,
  useState
} from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { TabPanelStyled } from '../../../components/tab-layouts/tab-panel-styled';

const bundleEditorKey = 'bundles-editor';

function OptionChooserItem({
  children,
  ...props
}: { children: ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={
        'w-full select-none cursor-pointer text-sm hover:bg-blue-100 p-1'
      }
      {...props}
    >
      {children}
    </div>
  );
}

interface BundlePanelProps {
  bundleId: string;
  schemaBundleIds: string[];
  schemaOptions: { [key: string]: string };
}

function BundlePanel({
  bundleId,
  schemaBundleIds,
  schemaOptions
}: BundlePanelProps) {
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
      <div className={'grid-cols-2 w-full flex'}>
        <div className={'w-full'}>
          {currentState.map((schema) => {
            const name = schemaOptions[schema];
            return (
              <OptionChooserItem
                key={`${bundleId}-${schema}`}
                onClick={() => {
                  dispatchUpdate({
                    contextKey: schemaBundleKey,
                    value: currentState.filter((id) => id !== schema)
                  });
                }}
              >
                {schemaOptions[schema]}
              </OptionChooserItem>
            );
          })}
        </div>
        <div className={'w-full'}>
          {Object.keys(schemaOptions)
            .filter((schemaOption) => !currentState.includes(schemaOption))
            .map((option) => {
              const schemaName = schemaOptions[option];
              return (
                <OptionChooserItem
                  key={`${bundleId}-${option}`}
                  onClick={() => {
                    dispatchUpdate({
                      contextKey: schemaBundleKey,
                      value: [...currentState, option]
                    });
                  }}
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
              schemaOptions={schemaOptions}
            ></BundlePanel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </Card>
  );
}
