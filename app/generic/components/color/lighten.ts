import { HSLA } from './color-context';

export const lighten = (hslObject: HSLA): HSLA => {
  const { h, s, l, a } = hslObject;
  const lighterL = 100 - (100 - l) * 0.5;
  const lighterHSL = `hsl(${h}, ${s}%, ${lighterL}%, ${a})`;
  return { ...hslObject, l: lighterL, cssHSLA: lighterHSL };
};
