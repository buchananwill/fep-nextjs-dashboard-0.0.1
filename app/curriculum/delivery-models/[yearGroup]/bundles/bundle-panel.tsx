import React, { ReactNode, useMemo } from 'react';
import { TabPanelStyled } from '../../../../components/tab-layouts/tab-panel-styled';
import { SchemaBundleKeyPrefix, UnsavedBundleEdits } from './bundle-editor';
import { useSelectiveContextDispatchBoolean } from '../../../../components/selective-context/selective-context-manager-boolean';
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
  const { bundleItemsMap } = useBundleItemsContext();

  const checked =
    bundleItemsMap[bundleKey].workProjectSeriesSchemaIds.includes(optionKey);

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

export function BundlePanel({ bundleId, schemaOptions }: BundlePanelProps) {
  const { panelKey } = useMemo(() => {
    const schemaBundleKey = `${SchemaBundleKeyPrefix}:${bundleId}`;
    const panelKey = `${schemaBundleKey}-panel`;
    return { schemaBundleKey, panelKey };
  }, [bundleId]);

  const { bundleItemsMap, dispatch } = useBundleItemsContext();
  const bundleItemsMapElement = bundleItemsMap[bundleId];

  const removeItem = (schemaId: string) => {
    const remainingItems =
      bundleItemsMapElement.workProjectSeriesSchemaIds.filter(
        (id) => id !== schemaId
      );
    itemDispatch(remainingItems);
  };

  const addItem = (schemaId: string) => {
    itemDispatch([
      ...bundleItemsMapElement.workProjectSeriesSchemaIds,
      schemaId
    ]);
  };

  const itemDispatch = (updatedItems: string[]) => {
    dispatch({
      type: 'update',
      payload: {
        key: bundleId,
        data: {
          ...bundleItemsMapElement,
          workProjectSeriesSchemaIds: updatedItems
        }
      }
    });
  };

  const { currentState: unsaved, dispatchWithoutControl } =
    useSelectiveContextDispatchBoolean(UnsavedBundleEdits, panelKey, false);

  if (bundleItemsMapElement === undefined) {
    return <div>No state to render!</div>;
  }

  return (
    <TabPanelStyled>
      <div className={'grid-cols-2 w-full flex p-1 gap-1'}>
        <div className={'w-full'}>
          {bundleItemsMapElement.workProjectSeriesSchemaIds.map((schemaId) => {
            const name = schemaOptions[schemaId];
            return (
              <OptionChooserItem
                key={`${bundleId}:${schemaId}`}
                bundleKey={bundleId}
                optionKey={schemaId}
                listenerKey={`${schemaId}:summary`}
                onChange={() => {
                  removeItem(schemaId);
                  dispatchWithoutControl(true);
                }}
                checkedStyling={'bg-emerald-100'}
              >
                {schemaOptions[schemaId]}
              </OptionChooserItem>
            );
          })}
        </div>
        <div className={'w-full'}>
          {Object.keys(schemaOptions).map((schemaId) => {
            const schemaName = schemaOptions[schemaId];
            return (
              <OptionChooserItem
                key={`${bundleId}:${schemaId}:optional`}
                bundleKey={bundleId}
                optionKey={schemaId}
                listenerKey={`${schemaId}:optional`}
                onChange={(event) => {
                  const include = event.currentTarget.checked;
                  if (include) {
                    addItem(schemaId);
                  } else {
                    removeItem(schemaId);
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
