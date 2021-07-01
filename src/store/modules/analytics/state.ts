export type State = {
  visitsByTime: { [key: string]: number } | null;
  visitsByPages: { [key: string]: number } | null;
};

export const state: State = {
  visitsByTime: null,
  visitsByPages: null,
};
