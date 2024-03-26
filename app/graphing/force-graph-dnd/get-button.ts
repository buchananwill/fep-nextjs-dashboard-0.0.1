import React from 'react';

export function getButton(e: React.MouseEvent) {
  return e.button === 0
    ? 'leftMouseDown'
    : e.button === 2
    ? 'rightMouseDown'
    : 'n/a';
}
