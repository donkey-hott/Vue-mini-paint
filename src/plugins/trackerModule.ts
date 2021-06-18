import firebase from "firebase";

export interface ITracker {
  events: {
    [key: string]: (route: any, options?: unknown) => void;
  };
  track(eventName: string, data?: any): void;
}

export interface ITrackConfig {
  user: firebase.User | null;
}

// interface IStrategy {
//   execute(eventName: string, data: any): void;
// }

export function createTrackerModule(config: any): ITracker {
  return {
    events: {
      /* TODO: limit 'any' type of 'options' */
      routeChange: (data: any) => {
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

      customEvent: (eventName, data: any) => {
        const uid = config.user?.uid;
        const info = { ...data, uid };

        firebase.database().ref("analytics").child(eventName).push(info);
      },
    },

    track(eventName, data) {
      if (Object.prototype.hasOwnProperty.call(this.events, eventName)) {
        return this.events[eventName](data);
      }
      /* *
        if (!Object.prototype.hasOwnProperty.call(this.strategies, eventName)) {
          this.setStrategy(new CustomStrategy(eventName, data))
        } else {
          this.setStrategy(new this.strategies[eventName](data))
        }
      *  */
      this.events.customEvent(eventName, data);
    },
  };
}
