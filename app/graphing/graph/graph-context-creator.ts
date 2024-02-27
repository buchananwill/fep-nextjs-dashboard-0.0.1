import { createContext } from 'react';

export interface GraphContextInterface {
  uniqueGraphName: string;
}

export const GraphContext = createContext<GraphContextInterface>({
  uniqueGraphName: 'default'
});
