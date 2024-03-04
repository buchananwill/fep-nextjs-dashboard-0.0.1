import React, { ReactNode, useMemo } from 'react';
import {
  useSelectiveContextControllerStringList,
  useSelectiveContextDispatchStringList,
  useSelectiveContextListenerStringList
} from '../../../components/selective-context/selective-context-manager-string-list';
import { TabPanelStyled } from '../../../components/tab-layouts/tab-panel-styled';
import {
  SchemaBundleKeyPrefix,
  StaticSchemaIdList,
  UnsavedBundleEdits
} from './bundle-editor';
import { useSelectiveContextDispatchBoolean } from '../../../components/selective-context/selective-context-manager-boolean';
import { useBundleItemsContext } from '../../contexts/use-bundle-Items-context';

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
    StaticSchemaIdList
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
        className={'pointer-events-none absolute opacity-100  '}
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

export function BundlePanel({ bundleId, schemaOptions }: BundlePanelProps) {
  const { schemaBundleKey, panelKey } = useMemo(() => {
    const schemaBundleKey = `${SchemaBundleKeyPrefix}:${bundleId}`;
    const panelKey = `${schemaBundleKey}-panel`;
    return { schemaBundleKey, panelKey };
  }, [bundleId]);

  const { currentState: updatedIds, dispatchWithoutControl: dispatchUpdate } =
    useSelectiveContextDispatchStringList({
      contextKey: schemaBundleKey,
      listenerKey: panelKey,
      initialValue: StaticSchemaIdList
    });

  const { currentState: unsaved, dispatchWithoutControl } =
    useSelectiveContextDispatchBoolean(UnsavedBundleEdits, panelKey, false);

  if (updatedIds === undefined) {
    return <div>No state to render!</div>;
  }

  return (
    <TabPanelStyled>
      <div className={'grid-cols-2 w-full flex p-1 gap-1'}>
        <div className={'w-full'}>
          {updatedIds.map((schema) => {
            const name = schemaOptions[schema];
            return (
              <OptionChooserItem
                key={`${bundleId}-${schema}`}
                bundleKey={schemaBundleKey}
                optionKey={schema}
                listenerKey={`${schemaBundleKey}-summary`}
                onChange={() => {
                  dispatchUpdate(updatedIds.filter((id) => id !== schema));
                  dispatchWithoutControl(true);
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
                      dispatchUpdate([...updatedIds, option]);
                    } else {
                      dispatchUpdate(updatedIds.filter((id) => id !== option));
                    }
                    dispatchWithoutControl(true);
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
