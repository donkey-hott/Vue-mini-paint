export class ScrollwisePagination {
  public currentPage: number;
  public selectionBounds: { start: number; end: number };
  private itemsPerPage: number;

  constructor(itemsPerPage = 8) {
    this.currentPage = 1;
    this.selectionBounds = { start: 1, end: itemsPerPage };
    this.itemsPerPage = itemsPerPage;
  }

  public incrementCurrentPage(): void {
    this.currentPage += 1;
  }

  public getSelectionBounds(): void {
    this.selectionBounds.start = this.itemsPerPage * (this.currentPage - 1);
    this.selectionBounds.end = this.itemsPerPage * this.currentPage;
  }

  public isScrollEnd(elem: HTMLElement | null): boolean | undefined {
    if (!elem) return;
    if (elem.scrollTop + elem.offsetHeight === elem.scrollHeight) {
      return true;
    }
  }
}
