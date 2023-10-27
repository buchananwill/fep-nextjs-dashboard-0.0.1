import { createContext } from "react";
import { ElectivesState } from "./elective-reducers";

export const ElectivesContext = createContext<ElectivesState>({});

export const ElectivesDispatchContext = createContext<Function>(() => {});

