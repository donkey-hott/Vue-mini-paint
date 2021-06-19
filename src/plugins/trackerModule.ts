import firebase from "firebase";

export interface ITracker {
  strategy: IStrategy | null;
  setStrategy(strategy: IStrategy): void;
  events: {
    [key: string]: IStrategy;
  };
  track(eventName: string, data: EventConfig): void;
}

export interface ITrackConfig {
  user: firebase.User | null;
}

export interface EventConfig {
  eventName: string;
  [key: string]: any;
}

interface IStrategy {
  execute(data: EventConfig): void;
}

enum Strategies {
  ROUTE_CHANGE = "ROUTE_CHANGE",
  CUSTOM_EVENT = "CUSTOM_EVENT",
}

export function createTrackerModule(config: ITrackConfig): ITracker {
  return {
    strategy: null,
    events: {
      [Strategies.ROUTE_CHANGE]: {
        execute(data) {
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
          // firebase
          //   .database()
          //   .ref("analytics")
          //   .child("routeChanges")
          //   .push(eventInfo);
        },
      },

      [Strategies.CUSTOM_EVENT]: {
        execute(data) {
          const { eventName, ...info } = data;
          console.log("info:", info);
          const uid = config.user?.uid;
          const infoWithUid = { ...info, uid };
          console.log("info with Uid:", infoWithUid);
          if (!data.eventName) return;

          // firebase.database().ref("analytics").child(eventName).push(info);
        },
      },
    },

    setStrategy(strategy) {
      this.strategy = strategy;
    },

    track(eventType, data) {
      /* TODO: FIX CUSTOM STRATEGY */
      if (!eventType) {
        throw new Error("Wrong or missing event name");
      }

      this.setStrategy(this.events[eventType]);
      this.strategy?.execute(data);
    },
  };
}
