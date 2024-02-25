'use client';
import React, {
  CSSProperties,
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

export function TransitionWrapper({
  trigger,
  children,
  enterDelay = 0,
  enterDuration = 0.3,
  leaveDelay = 1,
  leaveDuration = 0.5
}: {
  trigger: boolean;
  children?: (style: CSSProperties) => ReactElement<SVGElement>;
  enterDuration?: number;
  enterDelay?: number;
  leaveDuration?: number;
  leaveDelay?: number;
}) {
  const [isShowing, setIsShowing] = useState(false);
  const [isAboutToShow, setIsAboutToShow] = useState(false);
  const wasShowing = useRef(false);
  const timerRef = useRef<NodeJS.Timeout>();
  const [style, setStyle] = useState<CSSProperties>({
    opacity: 0
  });

  const transitionEnterProperties = useMemo(
    () => ({
      duration: `${enterDuration && enterDuration >= 0 ? enterDuration : 0.3}s`,
      transitionTimingFunction: `ease-in`,
      transitionDelay: `${enterDelay && enterDelay > 0 ? enterDelay : 0}s`
    }),
    [enterDelay, enterDuration]
  );

  const timeoutDuration = useMemo(
    () => (leaveDelay + leaveDuration) * 1000,
    [leaveDelay, leaveDuration]
  );
  useEffect(() => {
    clearTimeout(timerRef.current);
    wasShowing.current = !trigger;
    setIsAboutToShow(trigger);

    function endTimeout() {
      return () => {
        wasShowing.current = trigger;
      };
    }

    timerRef.current = setTimeout(endTimeout, timeoutDuration);

    return () => clearTimeout(timerRef.current);
  }, [timeoutDuration, trigger]);

  useEffect(() => {
    if (isAboutToShow) {
      setStyle({
        ...transitionEnterProperties,
        opacity: 1
      });
      setIsShowing(true);
    } else if (!isAboutToShow && wasShowing.current) {
      setStyle({
        transitionDuration: '0.5s',
        transitionTimingFunction: 'ease-in-out',
        transitionDelay: '0.5s',
        opacity: 0
      });
    }
    if (!isAboutToShow) {
      timerRef.current = setTimeout(() => {
        setIsShowing(trigger);
      }, timeoutDuration);
    }
    return () => clearTimeout(timerRef.current);
  }, [
    timeoutDuration,
    transitionEnterProperties,
    isAboutToShow,
    setStyle,
    trigger
  ]);

  if (!(isShowing || isAboutToShow)) return <></>;

  return <>{children && children(style)}</>;
}
