import { useEffect, useRef, useState } from 'react';

export function useKeyHeldListener(key?: string, code?: string) {
  const [keyHeld, setKeyHeld] = useState(false);
  const mutableRefObject = useRef(false);

  useEffect(() => {
    // Function to call when the key is pressed down
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;

      if (event.code === code || event.key === key) {
        if (!mutableRefObject.current) {
          setKeyHeld(true); // Set the state to true when the code bar is held down
          mutableRefObject.current = true;
        }
      }
    };

    // Function to call when the key is released
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === code || event.key === key) {
        setKeyHeld(false); // Reset the state when the code bar is released
        mutableRefObject.current = false;
        // Add logic here for when the code bar is released
      }
    };

    // Attach the event listeners to the window object
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Cleanup function to remove the event listeners
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [code, key]); // The empty dependency array means this effect runs only once after the initial render
  return keyHeld;
}

export function useSpaceHeldListener() {
  return useKeyHeldListener(' ', 'Space');
}

export function useShiftHeldListener() {
  return useKeyHeldListener('Shift', 'ShiftLeft');
}

export function useLeftCtrlHeldListener() {
  return useKeyHeldListener('Control', 'ControlLeft');
}
