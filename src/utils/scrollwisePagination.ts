export class ScrollwisePagination {
  public currentPage: number;
  private itemsPerPage: number;
  private timerId: undefined | number;

  constructor(itemsPerPage = 8) {
    this.currentPage = 1;
    this.itemsPerPage = itemsPerPage;
    this.timerId;
  }

  public incrementCurrentPage(): void {
    this.currentPage += 1;
  }

  public getSelectionBounds(): {
    start: number;
    end: number;
  } {
    const start = this.itemsPerPage * (this.currentPage - 1);
    const end = this.itemsPerPage * this.currentPage;
    return { start, end };
  }

  public isScrollEnd(elem: HTMLElement | null): boolean | undefined {
    if (!elem) return;
    if (elem.scrollTop + elem.offsetHeight === elem.scrollHeight) {
      return true;
    }
  }

  public debounce(callback: () => void, delay: number): void {
    clearTimeout(this.timerId);

    this.timerId = setTimeout(callback, delay);
  }
}
