import { store } from "@/store";
import { ActionTypes } from "@/store/modules/pictures/actions/action-types";
import { IPublisher, ScrollPublisher } from "./publisher";

export interface Observer {
  update(publisher?: IPublisher): void;
}

export class PictureLoaderObserver implements Observer {
  public update(publisherInstance: ScrollPublisher): void {
    store.dispatch(
      ActionTypes.LOAD_PICTURES,
      publisherInstance.selectionBounds
    );
  }
}
