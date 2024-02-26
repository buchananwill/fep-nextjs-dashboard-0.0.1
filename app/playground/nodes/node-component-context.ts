import { createContext, ReactElement } from 'react';

export interface NodeComponentSource {
  getNodeElements?: () => ReactElement[];
}

export const NodeComponentContext = createContext<NodeComponentSource>(
  {} as NodeComponentSource
);
