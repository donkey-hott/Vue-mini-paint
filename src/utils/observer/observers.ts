import { store } from "@/store";
import { ActionTypes } from "@/store/modules/pictures/actions/action-types";
import { ScrollwisePagination } from "../scrollwisePagination";

export interface Observer {
  update(payload?: any): void;
}

export class PictureLoaderObserver implements Observer {
  public update(selectionBounds: { start: number; end: number }): void {
    store.dispatch(ActionTypes.LOAD_PICTURES, selectionBounds);
  }
}

export class PaginationObserver implements Observer {
  public paginator: ScrollwisePagination;

  constructor() {
    this.paginator = new ScrollwisePagination();
  }

  public update(): void {
    this.paginator.incrementCurrentPage();
    this.paginator.getSelectionBounds();
  }
}
