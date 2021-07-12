import { State } from "@/store/modules/payments/state";

export enum MutationTypes {
  SET_PLAN = "SET_PLAN",
}

export type Mutations<S = State> = {
  [MutationTypes.SET_PLAN](state: S, payload: string | null): void;
};
