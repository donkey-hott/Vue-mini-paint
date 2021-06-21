export interface ITracker {
  currentEvent: IEvent | null;
  addUserInfo(dataObj: IEventData): void;
  setEvent(strategy: IEvent): void;
  events: {
    [key in EventTypes]: IEvent;
  };
  track(eventType: string, data: IEventData): void;
}

export interface ITrackConfig {
  userInfo: {
    name?: string;
    email: string;
    uid: string;
  };
}

export type ButtonClickData = {
  [key in string | number]: any;
} & {
  eventName: string;
};

export type RouteChangeData = {
  route: string;
  enteredFrom: string;
  exceptions?: Array<string>;
};

export type IEventData = ButtonClickData | RouteChangeData;

export interface IEvent {
  handle(data: IEventData): void;
}

export enum EventTypes {
  ROUTE_CHANGE = "ROUTE_CHANGE",
  BUTTON_CLICK = "BUTTON_CLICK",
}
