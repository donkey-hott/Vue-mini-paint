import firebase from "firebase";
import {
  ITrackConfig,
  ITracker,
  EventTypes,
  RouteChangeData,
  ButtonClickData,
  IEventData,
} from "./trackerTypes";

export function createTrackerModule(config: ITrackConfig): ITracker {
  return {
    currentEvent: null,
    events: {
      [EventTypes.ROUTE_CHANGE]: {
        handle(data: RouteChangeData) {
          const { route, enteredFrom, exceptions, ...userData } = data;

          if (!route) return;
          if (
            exceptions &&
            (exceptions.includes(route) || exceptions.includes(enteredFrom))
          ) {
            return;
          }

          const eventInfo = {
            ...userData,
            route,
            enteredFrom,
            enteredBy: config.userInfo.uid,
            timestamp: new Date().toISOString(),
          };

          firebase
            .database()
            .ref("analytics")
            .child("ROUTE_CHANGE")
            .push(eventInfo);
        },
      },

      [EventTypes.BUTTON_CLICK]: {
        handle(data: ButtonClickData) {
          const { eventName, ...info } = data;
          if (!eventName) {
            throw new Error("'eventName' property is required");
          }

          firebase.database().ref("analytics").child("BUTTON_CLICK").push(info);
        },
      },
    },

    setEvent(event) {
      this.currentEvent = event;
    },

    addUserInfo(dataObj: IEventData) {
      Object.assign(dataObj, config.userInfo);
    },

    track(eventType, data) {
      if (
        !eventType ||
        !Object.prototype.hasOwnProperty.call(EventTypes, eventType)
      ) {
        throw new Error("Wrong or missing event name");
      }

      this.setEvent(this.events[eventType as keyof typeof EventTypes]);
      this.addUserInfo(data);
      this.currentEvent?.handle(data);
    },
  };
}
