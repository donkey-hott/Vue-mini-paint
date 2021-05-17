// import store from "@/store";
import { IObserver } from "./observers";

export interface IPublisher {
  subscribe(observer: IObserver): void;
  unsubscribe(observer: IObserver): void;
  notify(): void;
}

export class Publisher implements IPublisher {
  private subscribers: IObserver[];

  constructor() {
    this.subscribers = [];
  }

  public subscribe(observer: IObserver): void | undefined {
    if (this.subscribers.includes(observer)) {
      return;
    }

    this.subscribers.push(observer);
  }

  public unsubscribe(subscriber: IObserver): void | undefined {
    const subscriberIndex = this.subscribers.indexOf(subscriber);
    if (subscriberIndex === -1) {
      return;
    }
    this.subscribers.splice(subscriberIndex, 1);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public notify(payload?: any): void {
    this.subscribers.forEach((subscriber) => {
      subscriber.update(payload);
    });
  }

  // public handleScrollEnd(): void {
  //   const htmlElem = document.querySelector("html");
  //   const isScrollEnd = this.scrollwisePagination.isScrollEnd(htmlElem);
  //   const { end } = this.scrollwisePagination.getSelectionBounds();

  //   if (isScrollEnd && end === store.getters.picturesNumber - 1) {
  //     this.debouncer(() => {
  //       this.scrollwisePagination.incrementCurrentPage();
  //       this.selectionBounds = this.scrollwisePagination.getSelectionBounds();

  //       this.notify();
  //     }, 200);
  //   }
  // }
}
