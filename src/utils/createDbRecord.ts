export type DbRecord = {
  title: string;
  imgURL: string | undefined;
  date: string;
  orderingNumber: number;
};

export function createDbRecord(
  imgURL: string | undefined,
  title: string,
  orderingNumber: number
): DbRecord {
  return {
    title,
    imgURL,
    date: new Date().toISOString(),
    orderingNumber,
  };
}
