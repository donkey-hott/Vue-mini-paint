import { Pictures } from "@/store/types";

export type State = {
  userPictures: Pictures;
  arePicturesLoading: boolean;
};

export const state: State = {
  userPictures: {},
  arePicturesLoading: false,
};
