import { PropsWithChildren } from 'react';
import WorkTaskFilteringContext from '../work-types/work-task-filtering-context';

export default function Layout({ children }: PropsWithChildren) {
  return <WorkTaskFilteringContext>{children}</WorkTaskFilteringContext>;
}
