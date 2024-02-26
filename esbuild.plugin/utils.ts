import type { Metadata } from "./metadata";

export function unique<T>(iterable: Maybe<Iterable<T>>, comparator: Comparator<T> = defaultComparator): T[] {
  if (comparator === defaultComparator) {
    return [...new Set(iterable)];
  }

  const result: T[] = [];

  for (const value of iterable ?? []) {
    if (!result.some((other) => comparator(value, other))) {
      result.push(value);
    }
  }

  return result;
}

export type DefaultImport = Promise<{ default: Metadata }>;

type Maybe<T> = T | null | undefined;
type Comparator<T> = (a: T, b: T) => boolean;
const defaultComparator: Comparator<unknown> = Object.is;
