import { App, inject } from "vue";

export interface ITracker {
  log(): void;
}

const TRACKER_SYMBOL = Symbol("tracker");

export default {
  install: (app: App, options?: unknown) => {
    const trackerModule: ITracker = {
      log() {
        console.log("Hi from plugin!");
      },
    };
    app.provide(TRACKER_SYMBOL, trackerModule);
    app.config.globalProperties.$tracker = trackerModule;
  },
};

export function useTracker() {
  const tracker: ITracker | undefined = inject(TRACKER_SYMBOL);
  if (!tracker) {
    throw new Error("'Tracker' plugin not provided");
  }
  return tracker;
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $tracker: ITracker;
  }
}
