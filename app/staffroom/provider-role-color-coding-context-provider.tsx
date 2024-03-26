'use client';
import React, { useContext, useEffect, useState } from 'react';
import {
  HUE_OPTIONS,
  LIGHTNESS_OPTIONS
} from '../contexts/color/color-context';
import { produce } from 'immer';
import { LongIdStringNameTuple } from '../api/dtos/LongIdStringNameTupleSchema';
import {
  ColorCoding,
  ColorCodingDispatch
} from '../contexts/color-coding/context';
import { useProviderRoleStringMapContext } from './contexts/providerRoles/provider-role-string-map-context-creator';

export function ProviderRoleColorCodingContextProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const { providerRoleDtoStringMap } = useProviderRoleStringMapContext();

  const colorCodingState = useContext(ColorCoding);
  const { setColorCoding } = useContext(ColorCodingDispatch);

  useEffect(() => {
    const unColorCodedMechanics: string[] = [];

    Object.values(providerRoleDtoStringMap).forEach(({ partyName }) => {
      if (!colorCodingState[partyName]) {
        unColorCodedMechanics.push(partyName);
      }
    });
    let currentState = colorCodingState;
    if (unColorCodedMechanics.length > 0) {
      for (let unColorCodedMechanic of unColorCodedMechanics) {
        const nextHueIndex =
          (Object.keys(currentState).length + 1) % HUE_OPTIONS.length;

        currentState = produce(currentState, (draft) => {
          draft[unColorCodedMechanic] = {
            hue: HUE_OPTIONS[nextHueIndex],
            lightness: LIGHTNESS_OPTIONS[1]
          };
        });
      }
      setColorCoding(currentState);
    }
  }, [colorCodingState, providerRoleDtoStringMap, setColorCoding]);

  return <>{children}</>;
}
