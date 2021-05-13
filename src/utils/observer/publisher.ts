import { ScrollwisePagination } from "../scrollwisePagination";
import { Observer } from "./observers";

export interface IPublisher {
  subscribe(observer: Observer): void;
  unsubscribe(observer: Observer): void;
  notify(): void;
  /* business logic */
  handleScrollEnd(): void;
}

export class ScrollPublisher implements IPublisher {
  private subscribers: Observer[];
  public scrollwisePagination: ScrollwisePagination;
  public selectionBounds: { start: number; end: number };

  constructor() {
    this.subscribers = [];
    this.scrollwisePagination = new ScrollwisePagination();
    this.selectionBounds = { start: 1, end: 8 };
  }

  public subscribe(observer: Observer): void | undefined {
    if (this.subscribers.includes(observer)) {
      return;
    }
    this.subscribers.push(observer);
  }

  public unsubscribe(subscriber: Observer): void | undefined {
    const subscriberIndex = this.subscribers.indexOf(subscriber);
    if (subscriberIndex === -1) {
      return;
    }
    this.subscribers.splice(subscriberIndex, 1);
  }

  public notify(): void {
    this.subscribers.forEach((subscriber) => {
      subscriber.update(this);
    });
  }

  public handleScrollEnd(): void {
    const htmlElem = document.querySelector("html");
    const isScrollEnd = this.scrollwisePagination.isScrollEnd(htmlElem);

    if (isScrollEnd) {
      this.scrollwisePagination.incrementCurrentPage();
      this.selectionBounds = this.scrollwisePagination.getSelectionBounds();

      this.notify();
    }
  }
}
