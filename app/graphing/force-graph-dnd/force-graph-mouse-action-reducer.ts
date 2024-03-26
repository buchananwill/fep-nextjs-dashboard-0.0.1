import React from 'react';

export interface ForceGraphMouseButtonEvents {
  leftMouseDown: boolean;
  rightMouseDown: boolean;
  lastEvent?: MouseEvent;
}

export interface LeftMouseAction {
  type: 'leftMouseDown';
  payload: { state: boolean; trigger: React.MouseEvent };
}

export interface RightMouseAction {
  type: 'rightMouseDown';
  payload: { state: boolean; trigger: React.MouseEvent };
}

export type ForceGraphMouseAction = LeftMouseAction | RightMouseAction;

export function ForceGraphMouseActionReducer(
  state: ForceGraphMouseButtonEvents,
  action: ForceGraphMouseAction
) {
  switch (action.type) {
    case 'leftMouseDown': {
      return {
        ...state,
        leftMouseDown: action.payload.state
      };
    }
    case 'rightMouseDown': {
      return {
        ...state,
        rightMouseDown: action.payload.state
      };
    }
    default:
      throw Error('Action not supported');
  }
}