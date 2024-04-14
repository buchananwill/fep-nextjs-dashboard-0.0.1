import React, { useMemo } from 'react';

import { useSelectiveContextDispatchBoolean } from '../../../../selective-context/components/typed/selective-context-manager-boolean';
import { useBundleItemsContext } from '../../contexts/use-bundle-Items-context';
import { TabPanelStyled } from '../../../../generic/components/tab-layouts/tab-panel-styled';
import { OptionChooserItem } from './option-chooser-item';
import {
  SchemaBundleKeyPrefix,
  UnsavedBundleEdits
} from '../../../../selective-context/keys/work-series-schema-bundle-keys';
import { useSelectiveContextAnyDispatch } from '../../../../selective-context/components/global/selective-context-manager-global';
import { getEntityNamespaceContextKey } from '../../../../selective-context/hooks/dtoStores/use-dto-store';
import { ObjectPlaceholder } from '../../../../api/main';
import { WorkSeriesSchemaBundleLeanDto } from '../../../../api/dtos/WorkSeriesSchemaBundleLeanDtoSchema';
import { WorkSeriesSchemaBundleDto } from '../../../../api/dtos/WorkSeriesSchemaBundleDtoSchema';

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

  const { currentState: bundle, dispatchWithoutControl: updateBundle } =
    useSelectiveContextAnyDispatch<WorkSeriesSchemaBundleDto>({
      contextKey: getEntityNamespaceContextKey(
        'workSeriesSchemaBundle',
        bundleId
      ),
      listenerKey: panelKey,
      initialValue: ObjectPlaceholder as WorkSeriesSchemaBundleDto
    });

  console.log(bundle);

  const removeItem = (schemaId: string) => {
    const remainingItems = bundle.workProjectSeriesSchemaIds.filter(
      (id) => id !== schemaId
    );
    itemDispatch(remainingItems);
  };

  const addItem = (schemaId: string) => {
    itemDispatch([...bundle.workProjectSeriesSchemaIds, schemaId]);
  };

  const itemDispatch = (updatedItems: string[]) => {
    updateBundle((bundle) => ({
      ...bundle,
      workProjectSeriesSchemaIds: updatedItems
    }));
  };

  const { dispatchWithoutControl } = useSelectiveContextDispatchBoolean(
    UnsavedBundleEdits,
    panelKey,
    false
  );

  if (bundle === undefined) {
    return <div>No state to render!</div>;
  }

  return (
    <TabPanelStyled>
      <div className={'grid-cols-2 w-full flex p-1 gap-1'}>
        <div className={'w-full'}>
          {bundle.workProjectSeriesSchemaIds.map((schemaId) => {
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
