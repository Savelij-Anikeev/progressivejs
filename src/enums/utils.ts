export type Enum<T> = {
  all: T[keyof T];
  'values': T;
};
