'use client';
import { PropsWithChildren } from 'react';
import {
  BundleAssignmentsContext,
  BundleAssignmentsContextDispatch
} from './use-bundle-assignments-context';
import { useStringMapReducer } from './curriculum-models-context-creator';

export function BundleAssignmentsProvider({
  bundleAssignments,
  children
}: {
  bundleAssignments: { [key: string]: string };
} & PropsWithChildren) {
  const [bundleAssignmentState, dispatch] =
    useStringMapReducer(bundleAssignments);
  return (
    <BundleAssignmentsContext.Provider value={bundleAssignmentState}>
      <BundleAssignmentsContextDispatch.Provider value={dispatch}>
        {children}
      </BundleAssignmentsContextDispatch.Provider>
    </BundleAssignmentsContext.Provider>
  );
}
