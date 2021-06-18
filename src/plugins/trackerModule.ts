import firebase from "firebase";

export interface ITracker {
  strategy: IStrategy | null;
  setStrategy(strategy: IStrategy): void;
  events: {
    [key: string]: IStrategy;
  };
  track(eventName?: string, data?: any): void;
}

export interface ITrackConfig {
  user: firebase.User | null;
}

interface IStrategy {
  execute(eventName?: string, data?: any): void;
}

enum Strategies {
  ROUTE_CHANGE = "ROUTE_CHANGE",
  CUSTOM_EVENT = "CUSTOM_EVENT",
}

export function createTrackerModule(config: any): ITracker {
  return {
    strategy: null,
    events: {
      [Strategies.ROUTE_CHANGE]: {
        execute(eventName, data) {
          const { route, enteredFrom, exceptions } = data;
          if (
            !route ||
            exceptions.includes(route) ||
            exceptions.includes(enteredFrom)
          )
            return;
          const eventInfo = {
            route,
            enteredFrom,
            enteredBy: config.user?.uid,
            timestamp: new Date().toISOString(),
          };
          firebase
            .database()
            .ref("analytics")
            .child("routeChanges")
            .push(eventInfo);
        },
      },

      [Strategies.CUSTOM_EVENT]: {
        execute(eventName, data) {
          if (!eventName) return;
          const uid = config.user?.uid;
          const info = { ...data, uid };

          firebase.database().ref("analytics").child(eventName).push(info);
        },
      },
    },

    setStrategy(strategy) {
      this.strategy = strategy;
    },

    track(eventName, data) {
      if (!eventName) {
        throw new Error("Wrong or missing event name");
      }

      this.setStrategy(this.events[eventName]);
      this.strategy?.execute(eventName, data);
    },
  };
}
