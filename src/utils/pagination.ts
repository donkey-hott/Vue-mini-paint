export class ScrollwisePagination {
  private currentPage: number;
  private itemsPerPage: number;
  public selectionBounds: { start: number; end: number };
  public isLastPage: boolean;

  constructor(itemsPerPage = 8) {
    this.currentPage = 0;
    this.itemsPerPage = itemsPerPage;
    this.selectionBounds = { start: 1, end: itemsPerPage };
    this.isLastPage = false;
  }

  public incrementCurrentPage(): void {
    this.currentPage += 1;
  }

  public calcSelectionBounds(): {
    start: number;
    end: number;
  } {
    const start = this.itemsPerPage * (this.currentPage - 1);
    const end = this.itemsPerPage * this.currentPage;
    this.selectionBounds = { start, end };
    return this.selectionBounds;
  }

  public resetState(): void {
    this.currentPage = 0;
    this.isLastPage = false;
  }
}
