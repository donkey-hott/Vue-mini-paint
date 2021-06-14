import { Pictures } from "@/store/types";

export type State = {
  userPictures: Pictures;
  publicPictures: { [key: string]: string };
  isLoading: boolean;
};

export const state: State = {
  userPictures: {},
  publicPictures: {},
  isLoading: false,
};
