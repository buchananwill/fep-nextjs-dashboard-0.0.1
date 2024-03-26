import { useEffect } from 'react';

// Adjusted hook to accept a callback function
export function useKeyPressListener(
  key?: string,
  code?: string,
  onKeyPress?: () => void
) {
  useEffect(() => {
    // Function to call when the key is pressed
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === code || event.key === key) {
        onKeyPress?.(); // Call the callback function if the correct key is pressed
      }
    };

    // Attach the event listener to the window object
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [code, key, onKeyPress]); // Dependency array includes the callback to handle its updates
}

// Usage examples with callbacks
export function useSpacePressListener(onSpacePress: () => void) {
  useKeyPressListener(' ', 'Space', onSpacePress);
}

export function useShiftPressListener(onShiftPress: () => void) {
  useKeyPressListener('Shift', 'ShiftLeft', onShiftPress);
}

export function useLeftCtrlPressListener(onCtrlPress: () => void) {
  useKeyPressListener('Control', 'ControlLeft', onCtrlPress);
}

export function useEnterPressListener(onEnterPress: () => void) {
  useKeyPressListener('Enter', 'Enter', onEnterPress);
}
