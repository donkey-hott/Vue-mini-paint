const comparator = (array: { [key: string]: any }[], property: string) => {
  return (firstArrayItem: { [key: string]: any }) => {
    return (
      array.filter((secondArrayItem) => {
        return secondArrayItem[property] === firstArrayItem[property];
      }).length === 0
    );
  };
};

export function getDiffOfObjArrays(
  array1: Array<{ [key: string]: any }>,
  array2: Array<{ [key: string]: any }>,
  comparisonBase: string
): {
  [key: string]: any;
}[] {
  const uniqueInFirstArray = array1.filter(comparator(array2, comparisonBase));
  const uniqueInSecondArray = array2.filter(comparator(array1, comparisonBase));

  return uniqueInFirstArray.concat(uniqueInSecondArray);
}
