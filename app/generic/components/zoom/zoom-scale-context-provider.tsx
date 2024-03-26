'use client';

import { ReactNode, useEffect, useState } from 'react';
import {
  defaultZoomScale,
  ZoomScaleContext,
  ZoomScaleContextInterface,
  ZoomScaleDispatch,
  ZoomScaleDispatchInterface
} from './zoom-scale-context';

export default function ZoomScaleContextProvider({
  children,
  xScale: xScaleProp,

  yScale: yScaleProp
}: {
  children: ReactNode;
  xScale?: number;
  yScale?: number;
}) {
  const { y: defaultHourHeight, x: defaultDayWidth } = defaultZoomScale;
  const [yScale, setYScale] = useState(defaultHourHeight);
  const [xScale, setXScale] = useState(defaultDayWidth);

  useEffect(() => {
    xScaleProp && setXScale(xScaleProp);
    yScaleProp && setYScale(yScaleProp);
  }, [yScaleProp, xScaleProp, xScale, setXScale, yScale, setYScale]);

  const scaleContext: ZoomScaleContextInterface = {
    y: yScale,
    x: xScale
  };

  const dispatchContext: ZoomScaleDispatchInterface = {
    setYScale,
    setXScale
  };

  return (
    <ZoomScaleContext.Provider value={scaleContext}>
      <ZoomScaleDispatch.Provider value={dispatchContext}>
        {children}
      </ZoomScaleDispatch.Provider>
    </ZoomScaleContext.Provider>
  );
}

