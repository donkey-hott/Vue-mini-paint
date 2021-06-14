import { Pictures } from "@/store/types";
import { State } from "../state";

export enum MutationTypes {
  SET_PICTURES = "SET_PICTURES",
  SET_PUBLIC_PICTURES = "SET_PUBLIC_PICTURES",
  UPDATE_PUBLIC_PICTURE_URL = "UPDATE_PUBLIC_PICTURE_URL",
  REMOVE_PUBLIC_PICTURE = "REMOVE_PUBLIC_PICTURE",
}

export type Mutations<S = State> = {
  [MutationTypes.SET_PICTURES](state: S, payload: Pictures): void;
  [MutationTypes.SET_PUBLIC_PICTURES](
    state: S,
    payload: { [key: string]: string }
  ): void;
  [MutationTypes.UPDATE_PUBLIC_PICTURE_URL](
    state: S,
    payload: { id: string; url: string }
  ): void;
  [MutationTypes.REMOVE_PUBLIC_PICTURE](state: S, payload: string): void;
};
