import firebase from "firebase";
import {
  ITrackConfig,
  EventTypes,
  RouteChangeData,
  ButtonClickData,
  IEventData,
  IEvent,
} from "./trackerTypes";

export class TrackerModule {
  public config: ITrackConfig;
  public events: {
    [key in EventTypes]: IEvent;
  };
  private currentEvent: IEvent | null;
  private static instance: TrackerModule | null;

  private constructor(config: ITrackConfig) {
    this.config = config;
    this.currentEvent = null;
    this.events = {
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
    };
  }

  public static getInstance(config?: ITrackConfig): TrackerModule {
    if (!TrackerModule.instance) {
      if (!config)
        throw new Error(
          "To instantiate new tracker module a config object must be provided"
        );

      TrackerModule.instance = new TrackerModule(config);
    }

    return TrackerModule.instance;
  }

  setEvent(event: IEvent): void {
    this.currentEvent = event;
  }

  addUserInfo(dataObj: IEventData) {
    Object.assign(dataObj, this.config.userInfo);
  }

  track(eventType: string, data: IEventData): void {
    if (
      !eventType ||
      !Object.prototype.hasOwnProperty.call(EventTypes, eventType)
    ) {
      throw new Error("Wrong or missing event name");
    }

    this.setEvent(this.events[eventType as keyof typeof EventTypes]);
    this.addUserInfo(data);
    this.currentEvent?.handle(data);
  }
}
