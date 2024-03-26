import { createContext } from 'react';

export interface ZoomContext {
  xZoom: number;
  yZoom: number;
}

export interface ZoomDispatchContext {
  increment: () => void;
  decrement: () => void;
}

export type ZoomType = 'increment' | 'decrement';

export const ZoomContext = createContext<ZoomContext>({ xZoom: 0, yZoom: 0 });

export const ZoomDispatchContext = createContext<ZoomDispatchContext>({
  increment: () => {},
  decrement: () => {}
});
