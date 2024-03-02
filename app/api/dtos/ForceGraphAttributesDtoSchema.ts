import { useSelectiveContextListenerNumber } from '../../components/selective-context/selective-context-manager-number';
import { useNormalizeForceRange } from '../../graphing/components/force-attributes-meta-data';
import { z } from 'zod';
export const ForceGraphAttributesDtoSchema = z.object({
  id: z.number(),
  centerStrength: z.number(),
  collideStrength: z.number(),
  linkDistance: z.number(),
  linkStrength: z.number(),
  manyBodyStrength: z.number(),
  manyBodyTheta: z.number(),
  manyBodyMinDistance: z.number(),
  manyBodyMaxDistance: z.number(),
  forceXStrength: z.number(),
  forceYStrength: z.number(),
  forceRadialStrength: z.number(),
  forceRadialXRelative: z.number(),
  forceRadialYRelative: z.number(),
});
export type ForceGraphAttributesDto = z.infer<typeof ForceGraphAttributesDtoSchema>;
export function useForceAttributeListeners(uniqueGraphName: string){
const { currentState: manyBodyTheta } = useSelectiveContextListenerNumber(
              `${uniqueGraphName}-manyBodyTheta`,
  `${uniqueGraphName}-manyBodyTheta-listener`,
  100
);
const { currentState: centerStrength } = useSelectiveContextListenerNumber(
              `${uniqueGraphName}-centerStrength`,
  `${uniqueGraphName}-centerStrength-listener`,
  100
);
const { currentState: collideStrength } = useSelectiveContextListenerNumber(
              `${uniqueGraphName}-collideStrength`,
  `${uniqueGraphName}-collideStrength-listener`,
  100
);
const { currentState: linkDistance } = useSelectiveContextListenerNumber(
              `${uniqueGraphName}-linkDistance`,
  `${uniqueGraphName}-linkDistance-listener`,
  100
);
const { currentState: manyBodyMaxDistance } = useSelectiveContextListenerNumber(
              `${uniqueGraphName}-manyBodyMaxDistance`,
  `${uniqueGraphName}-manyBodyMaxDistance-listener`,
  100
);
const { currentState: manyBodyMinDistance } = useSelectiveContextListenerNumber(
              `${uniqueGraphName}-manyBodyMinDistance`,
  `${uniqueGraphName}-manyBodyMinDistance-listener`,
  100
);
const { currentState: forceRadialXRelative } = useSelectiveContextListenerNumber(
              `${uniqueGraphName}-forceRadialXRelative`,
  `${uniqueGraphName}-forceRadialXRelative-listener`,
  100
);
const { currentState: linkStrength } = useSelectiveContextListenerNumber(
              `${uniqueGraphName}-linkStrength`,
  `${uniqueGraphName}-linkStrength-listener`,
  100
);
const { currentState: forceRadialStrength } = useSelectiveContextListenerNumber(
              `${uniqueGraphName}-forceRadialStrength`,
  `${uniqueGraphName}-forceRadialStrength-listener`,
  100
);
const { currentState: forceRadialYRelative } = useSelectiveContextListenerNumber(
              `${uniqueGraphName}-forceRadialYRelative`,
  `${uniqueGraphName}-forceRadialYRelative-listener`,
  100
);
const { currentState: forceYStrength } = useSelectiveContextListenerNumber(
              `${uniqueGraphName}-forceYStrength`,
  `${uniqueGraphName}-forceYStrength-listener`,
  100
);
const { currentState: forceXStrength } = useSelectiveContextListenerNumber(
              `${uniqueGraphName}-forceXStrength`,
  `${uniqueGraphName}-forceXStrength-listener`,
  100
);
const { currentState: manyBodyStrength } = useSelectiveContextListenerNumber(
              `${uniqueGraphName}-manyBodyStrength`,
  `${uniqueGraphName}-manyBodyStrength-listener`,
  100
);

const manyBodyThetaNormalized = useNormalizeForceRange(manyBodyTheta); 
const centerStrengthNormalized = useNormalizeForceRange(centerStrength); 
const collideStrengthNormalized = useNormalizeForceRange(collideStrength); 
const linkDistanceNormalized = useNormalizeForceRange(linkDistance, 'linkDistance'); 
const manyBodyMaxDistanceNormalized = useNormalizeForceRange(manyBodyMaxDistance, 'manyBodyMaxDistance'); 
const manyBodyMinDistanceNormalized = useNormalizeForceRange(manyBodyMinDistance, 'manyBodyMinDistance'); 
const forceRadialXRelativeNormalized = useNormalizeForceRange(forceRadialXRelative); 
const linkStrengthNormalized = useNormalizeForceRange(linkStrength); 
const forceRadialStrengthNormalized = useNormalizeForceRange(forceRadialStrength); 
const forceRadialYRelativeNormalized = useNormalizeForceRange(forceRadialYRelative); 
const forceYStrengthNormalized = useNormalizeForceRange(forceYStrength); 
const forceXStrengthNormalized = useNormalizeForceRange(forceXStrength); 
const manyBodyStrengthNormalized = useNormalizeForceRange(manyBodyStrength, 'manyBodyStrength'); 
    return { manyBodyThetaNormalized, centerStrengthNormalized, collideStrengthNormalized, linkDistanceNormalized, manyBodyMaxDistanceNormalized, manyBodyMinDistanceNormalized, forceRadialXRelativeNormalized, linkStrengthNormalized, forceRadialStrengthNormalized, forceRadialYRelativeNormalized, forceYStrengthNormalized, forceXStrengthNormalized, manyBodyStrengthNormalized,  }
}
