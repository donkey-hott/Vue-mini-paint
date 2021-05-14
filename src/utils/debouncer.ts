export function createDebouncer(): (
  callback: () => void,
  delay: number
) => void {
  let timerId: number | undefined;

  return function (callback: () => void, delay: number) {
    clearTimeout(timerId);

    timerId = setTimeout(callback, delay);
  };
}
