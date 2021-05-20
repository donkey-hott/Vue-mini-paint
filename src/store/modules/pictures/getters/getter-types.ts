import { PictureRecord, Pictures } from "@/store/types";
import { State } from "../state";

export type Getters = {
  getRandomPictures(state: State): (picsNum: number) => Pictures;
};
