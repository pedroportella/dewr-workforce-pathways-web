type ClassDictionary = Record<string, boolean | null | undefined>;
type ClassValue = string | null | undefined | false | ClassDictionary;

export default function classNames(...values: ClassValue[]) {
  return values
    .flatMap((value) => {
      if (!value) return [];
      if (typeof value === 'string') return [value];
      return Object.entries(value)
        .filter(([, enabled]) => Boolean(enabled))
        .map(([className]) => className);
    })
    .join(' ');
}
