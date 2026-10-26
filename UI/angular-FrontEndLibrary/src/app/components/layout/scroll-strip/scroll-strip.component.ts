import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';

// Horizontal row that scrolls sideways, with round gold arrows and faded edges
// where more content is hidden. Used for the genre cards and the book shelves.
@Component({
  selector: 'app-scroll-strip',
  standalone: true,
  templateUrl: './scroll-strip.component.html',
  styleUrls: ['./scroll-strip.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ScrollStripComponent implements AfterViewInit, OnDestroy {
  @Input() label = ''; // accessible name of the scroll area
  @ViewChild('viewport', { static: true }) viewport!: ElementRef<HTMLElement>;
  canScrollLeft = false;
  canScrollRight = false;

  private resizeObserver?: ResizeObserver;
  private mutationObserver?: MutationObserver;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    // The content arrives later (books load async) and the strip resizes with
    // the window, so watch both instead of measuring once
    const el = this.viewport.nativeElement;
    this.resizeObserver = new ResizeObserver(() => this.updateArrows());
    this.resizeObserver.observe(el);
    this.mutationObserver = new MutationObserver(() => this.updateArrows());
    this.mutationObserver.observe(el, { childList: true, subtree: true });
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
    this.mutationObserver?.disconnect();
  }

  updateArrows() {
    const el = this.viewport.nativeElement;
    const left = el.scrollLeft > 1;
    const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
    if (left !== this.canScrollLeft || right !== this.canScrollRight) {
      this.canScrollLeft = left;
      this.canScrollRight = right;
      this.cdr.detectChanges();
    }
  }

  scroll(direction: 1 | -1) {
    const el = this.viewport.nativeElement;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' });
  }

  // Centre an item in the strip. Sets scrollLeft directly rather than
  // scrollIntoView, which would also scroll the page.
  centerOn(selector: string) {
    const el = this.viewport.nativeElement;
    const item = el.querySelector<HTMLElement>(selector);
    if (item) {
      el.scrollLeft = item.offsetLeft - (el.clientWidth - item.offsetWidth) / 2;
    }
  }
}
