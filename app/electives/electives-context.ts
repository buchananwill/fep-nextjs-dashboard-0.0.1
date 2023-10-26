import { createContext } from "react";
import { ElectivePreference } from "./elective-subscriber-accordion";
import { ElectivesState } from "./elective-reducers";

export const ElectivesContext = createContext<ElectivesState>({});

export const ElectivesDispatchContext = createContext<Function>(() => {});