import * as D3 from 'd3';

export function getForceCenter(
  width: number,
  height: number,
  strength: number
) {
  return D3.forceCenter(width / 2, height / 2).strength(1);
}
