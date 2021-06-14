import { Pictures } from "@/store/types";

export type State = {
  userPictures: Pictures;
  publicPictures: { [key: string]: string };
};

export const state: State = {
  userPictures: {},
  publicPictures: {},
};
