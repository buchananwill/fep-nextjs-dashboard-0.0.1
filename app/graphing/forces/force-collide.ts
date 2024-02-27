import * as D3 from 'd3';

export function getForceCollide(radius: number, strength: number) {
  return D3.forceCollide(radius).strength(strength);
}