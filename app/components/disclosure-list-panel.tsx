'use client';
import React from 'react';
import HslColorContextProvider from '../contexts/color/hsl-color-context-provider';
import { BASE_HSL, HslaColorState } from '../contexts/color/color-context';
import { DisclosureListItem } from './disclosure-list-item';

export type ButtonClusterTransformer<D> = React.FC<TransformerProps<D>>;

export type DisclosureLabelTransformer<D> = React.FC<TransformerProps<D>>;

export type PanelTransformer<D> = React.FC<TransformerProps<D>>;

export interface TransformerProps<D> {
  data: D;
  children?: React.ReactNode;
  className?: string;
}

export interface FilterDisclosurePanelProps<D> {
  data: D[];
  buttonCluster: ButtonClusterTransformer<D>;
  disclosureLabelTransformer: DisclosureLabelTransformer<D>;
  panelTransformer: PanelTransformer<D>;
}

const base = BASE_HSL['gray'];
const initialHsla: HslaColorState = {
  darker: base,
  base: base,
  lighter: base,
  current: base
};

export default function DisclosureListPanel<D>({
  data,
  panelTransformer: PanelTransformerComponent,
  buttonCluster: ButtonCluster,
  disclosureLabelTransformer: ButtonTransformerComponent
}: FilterDisclosurePanelProps<D>) {
  try {
    return (
      <>
        <div className="pb-4 justify-left">
          {data &&
            data.map((element, index) => (
              <div key={`${index}`}>
                <div className="w-full px-0 py-0 m-0">
                  <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-0">
                    <HslColorContextProvider initialState={initialHsla}>
                      <DisclosureListItem
                        dataElement={element}
                        buttonCluster={ButtonCluster}
                        disclosureLabelTransformer={ButtonTransformerComponent}
                        panelTransformer={PanelTransformerComponent}
                      />
                    </HslColorContextProvider>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </>
    );
  } catch (error) {
    console.error('Error: ', error);
  }
}
