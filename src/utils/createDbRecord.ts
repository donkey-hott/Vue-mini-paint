export type DbRecord = {
  title: string;
  imgURL: string | undefined;
  date: string;
};

export function createDbRecord(
  imgURL: string | undefined,
  title: string
): DbRecord {
  return {
    title,
    imgURL,
    date: new Date().toISOString(),
  };
}
