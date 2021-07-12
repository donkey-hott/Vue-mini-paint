export type State = {
  plan: { type: string; price: number } | null;
};

export const state: State = {
  plan: null,
};
