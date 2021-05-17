export function createThrottler(): (cb: () => void, delay: number) => void {
  let timerId: number | undefined;

  return function (cb: () => void, delay: number) {
    if (timerId) return;

    timerId = setTimeout(() => {
      cb();
      timerId = undefined;
    }, delay);
  };
}
