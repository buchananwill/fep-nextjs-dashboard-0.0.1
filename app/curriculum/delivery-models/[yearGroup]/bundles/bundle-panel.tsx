import React, { useMemo } from 'react';

import { useSelectiveContextDispatchBoolean } from '../../../../selective-context/components/typed/selective-context-manager-boolean';
import { useBundleItemsContext } from '../../contexts/use-bundle-Items-context';
import { TabPanelStyled } from '../../../../generic/components/tab-layouts/tab-panel-styled';
import { OptionChooserItem } from './option-chooser-item';
import {
  SchemaBundleKeyPrefix,
  UnsavedBundleEdits
} from '../../../../selective-context/keys/work-series-schema-bundle-keys';

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

  const { dispatchWithoutControl } = useSelectiveContextDispatchBoolean(
    UnsavedBundleEdits,
    panelKey,
    false
  );

  if (bundleItemsMapElement === undefined) {
    return <div>No state to render!</div>;
  }

  return (
    <TabPanelStyled>
      <div className={'grid-cols-2 w-full flex p-1 gap-1'}>
        <div className={'w-full'}>
          {bundleItemsMapElement.workProjectSeriesSchemaIds.map((schemaId) => {
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
