import { Pictures } from "@/store/types";

export type State = {
  userPictures: Pictures;
};

export const state: State = {
  userPictures: {},
};
