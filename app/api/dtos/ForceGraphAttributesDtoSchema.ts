import { useSelectiveContextListenerNumber } from '../../components/selective-context/selective-context-manager-number';import { z } from 'zod';
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
  `${uniqueGraphName}-manyBodyTheta-listener`
);
const { currentState: centerStrength } = useSelectiveContextListenerNumber(
              `${uniqueGraphName}-centerStrength`,
  `${uniqueGraphName}-centerStrength-listener`
);
const { currentState: collideStrength } = useSelectiveContextListenerNumber(
              `${uniqueGraphName}-collideStrength`,
  `${uniqueGraphName}-collideStrength-listener`
);
const { currentState: linkDistance } = useSelectiveContextListenerNumber(
              `${uniqueGraphName}-linkDistance`,
  `${uniqueGraphName}-linkDistance-listener`
);
const { currentState: manyBodyMaxDistance } = useSelectiveContextListenerNumber(
              `${uniqueGraphName}-manyBodyMaxDistance`,
  `${uniqueGraphName}-manyBodyMaxDistance-listener`
);
const { currentState: manyBodyMinDistance } = useSelectiveContextListenerNumber(
              `${uniqueGraphName}-manyBodyMinDistance`,
  `${uniqueGraphName}-manyBodyMinDistance-listener`
);
const { currentState: forceRadialXRelative } = useSelectiveContextListenerNumber(
              `${uniqueGraphName}-forceRadialXRelative`,
  `${uniqueGraphName}-forceRadialXRelative-listener`
);
const { currentState: linkStrength } = useSelectiveContextListenerNumber(
              `${uniqueGraphName}-linkStrength`,
  `${uniqueGraphName}-linkStrength-listener`
);
const { currentState: forceRadialStrength } = useSelectiveContextListenerNumber(
              `${uniqueGraphName}-forceRadialStrength`,
  `${uniqueGraphName}-forceRadialStrength-listener`
);
const { currentState: forceRadialYRelative } = useSelectiveContextListenerNumber(
              `${uniqueGraphName}-forceRadialYRelative`,
  `${uniqueGraphName}-forceRadialYRelative-listener`
);
const { currentState: forceYStrength } = useSelectiveContextListenerNumber(
              `${uniqueGraphName}-forceYStrength`,
  `${uniqueGraphName}-forceYStrength-listener`
);
const { currentState: forceXStrength } = useSelectiveContextListenerNumber(
              `${uniqueGraphName}-forceXStrength`,
  `${uniqueGraphName}-forceXStrength-listener`
);
const { currentState: manyBodyStrength } = useSelectiveContextListenerNumber(
              `${uniqueGraphName}-manyBodyStrength`,
  `${uniqueGraphName}-manyBodyStrength-listener`
);
    return { manyBodyTheta, centerStrength, collideStrength, linkDistance, manyBodyMaxDistance, manyBodyMinDistance, forceRadialXRelative, linkStrength, forceRadialStrength, forceRadialYRelative, forceYStrength, forceXStrength, manyBodyStrength,  }
}
