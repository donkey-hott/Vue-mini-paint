export class ScrollwisePagination {
  public currentPage: number;
  private itemsPerPage: number;

  constructor(itemsPerPage = 8) {
    this.currentPage = 1;
    this.itemsPerPage = itemsPerPage;
  }

  public incrementCurrentPage(): void {
    this.currentPage += 1;
  }

  public getSelectionBounds(): {
    start: number;
    end: number;
  } {
    const start = this.itemsPerPage * this.currentPage;
    const end = this.itemsPerPage * this.currentPage;
    return { start, end };
  }

  public isViewportEnd(elem: HTMLElement | null): boolean | undefined {
    if (!elem) return;
    if (elem.scrollTop + elem.offsetHeight === elem.scrollHeight) {
      console.log("viewportEnd");
      return true;
    }
  }
}
