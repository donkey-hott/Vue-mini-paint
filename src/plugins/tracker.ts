import { App, inject } from "vue";
import firebase from "firebase";

export interface ITrackConfig {
  user: firebase.User | null;
}

export interface ITracker {
  events: {
    [key: string]: (route: any, options?: unknown) => void;
  };
  track(eventName: string, options?: any): void;
}

const TRACKER_SYMBOL = Symbol("tracker");

/* functions that provides access to the plugin functionality
  outside the "*.vue" files */

export default {
  install: (app: App, config: ITrackConfig) => {
    const trackerModule: ITracker = {
      events: {
        /* TODO: limit 'any' type of 'options' */
        routeChange: (options: any) => {
          const { route } = options;
          if (!route) return;
          const data = {
            route,
            enteredBy: config.user?.uid,
            timestamp: new Date().toISOString(),
          };
          firebase.database().ref("analytics").child("pages").push(data);
        },
      },

      track(eventName, options) {
        if (Object.prototype.hasOwnProperty.call(this.events, eventName)) {
          return this.events[eventName](options);
        }
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
