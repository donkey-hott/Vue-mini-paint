import { PictureRecord } from "@/store/types";

export function enumerateTitle(titles: PictureRecord[], title: string): string {
  /*   checking how many times "title"
  repeats in "titles" array */
  const repetitions = titles.reduce((acc, value) => {
    const REGEXP = new RegExp(`^${title}`);
    if (REGEXP.test(value.title)) acc += 1;
    return acc;
  }, 0);
  /* if value doesn't exist in array yet, just return it  */
  return repetitions ? `${title}(${repetitions})` : title;
}
