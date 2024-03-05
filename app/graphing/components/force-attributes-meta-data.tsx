import { ForceGraphAttributesDto } from '../../api/dtos/ForceGraphAttributesDtoSchema';
import { useMemo } from 'react';

export const forceAttributesInitial: ForceGraphAttributesDto = {
  id: 1,
  forceXStrength: 0,
  forceYStrength: 0,
  linkStrength: 80, // 80
  linkDistance: 100, // 100
  centerStrength: 50, // 50
  collideStrength: 3, // 3
  manyBodyStrength: 50, // 0
  manyBodyMinDistance: 10, // 5
  manyBodyMaxDistance: 400, // 400
  manyBodyTheta: 50, // 9
  forceRadialStrength: 1, // Must not be 0
  forceRadialXRelative: 100, // 100
  forceRadialYRelative: 100 // 100
};
export const forceAttributesMin: ForceGraphAttributesDto = {
  id: 1,
  forceXStrength: 0,
  forceYStrength: 0,
  linkStrength: 0,
  linkDistance: 1,
  centerStrength: 0,
  collideStrength: 0,
  manyBodyStrength: 0,
  manyBodyMinDistance: 1,
  manyBodyMaxDistance: 1,
  manyBodyTheta: 0.1,
  forceRadialStrength: 0,
  forceRadialXRelative: 1,
  forceRadialYRelative: 1
};
export const forceAttributesMax: ForceGraphAttributesDto = {
  id: 1,
  forceXStrength: 100,
  forceYStrength: 100,
  linkStrength: 200, //
  linkDistance: 1000, //
  centerStrength: 100,
  collideStrength: 100,
  manyBodyStrength: 200, //
  manyBodyMinDistance: 1000, //
  manyBodyMaxDistance: 1000, //
  manyBodyTheta: 100,
  forceRadialStrength: 100,
  forceRadialXRelative: 100,
  forceRadialYRelative: 100
};

// These values are not range[0,1]: linkStrength, manyBodyStrength, distances

export type ForceNormalizationCategory =
  | 'manyBodyStrength'
  | 'manyBodyMinDistance'
  | 'manyBodyMaxDistance'
  | 'linkDistance';

export function useNormalizeForceRange(
  value: number,
  category?: ForceNormalizationCategory
): number {
  return useMemo(() => {
    switch (category) {
      case 'manyBodyStrength':
        return value - 100;
      case 'manyBodyMaxDistance':
      case 'manyBodyMinDistance':
      case 'linkDistance': {
        return value;
      }
      default:
        return value / 100;
    }
  }, [category, value]);
}
