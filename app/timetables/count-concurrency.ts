import { LessonCycle } from '../api/state-types';

export function countConcurrency(
  highlightedSubjects: Set<string>,
  periodId: number | null,
  map: Map<number, Set<string>>,
  lessonCycleMap: Map<string, LessonCycle>
) {
  let concurrency = 0;
  if (!periodId) return concurrency;
  const setOrUndefined = map.get(periodId);
  if (!setOrUndefined) return concurrency;
  setOrUndefined.forEach((lessonCycleId) => {
    const lessonCycle = lessonCycleMap.get(lessonCycleId);
    if (
      lessonCycle &&
      (highlightedSubjects.has(lessonCycle.subject) ||
        highlightedSubjects.size == 0)
    )
      concurrency++;
  });
  return concurrency;
}

export function getBadgeColor(concurrency: number) {
  switch (concurrency) {
    case 0:
      return 'gray';
    case 1:
      return 'emerald';
    case 2:
      return 'yellow';
    case 3:
      return 'orange';
    case 4:
      return 'red';
    case 5:
      return 'pink';
    default:
      return 'purple';
  }
}
