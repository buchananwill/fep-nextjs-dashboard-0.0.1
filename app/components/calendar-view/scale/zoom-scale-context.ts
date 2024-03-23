import { createContext } from 'react';

export interface ZoomScaleContextInterface {
  y: number;
  x: number;
}

export interface ZoomScaleDispatchInterface {
  setYScale: (value: number) => void;
  setXScale: (value: number) => void;
}

export const defaultZoomScale = {
  y: 1, // Was 60
  x: 1 // Was 100
};

export const ZoomScaleContext =
  createContext<ZoomScaleContextInterface>(defaultZoomScale);
export const ZoomScaleDispatch = createContext<ZoomScaleDispatchInterface>({
  setXScale: () => {},
  setYScale: () => {}
});
