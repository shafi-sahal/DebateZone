import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { Subscription } from 'rxjs';
import { Searcher } from './searcher.service';

@Component({
  selector: 'app-mat-select-search',
  templateUrl: './mat-select-search.component.html',
  styleUrls: ['./mat-select-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [Searcher]
})
export class MatSelectSearchComponent implements OnInit, OnDestroy {
  @Input() list: Record<string, string>[] = [];
  @Input() searchProperties: string[] = [];
  @Input() clearSearchInput = false;
  @Output() filtered = new EventEmitter<Record<string, string>[]>();
  @ViewChild('input', { read: ElementRef, static: true }) element!: ElementRef;
  isLoading = false;
  private filteredList: Record<string, string>[] | undefined = [];
  private fullList: Record<string, string>[] = [];
  private hasFilteredBefore = false;
  private subscriptions = new Subscription();

  constructor(
    @Inject(MatSelect) private matSelect: MatSelect,
    @Inject(MatOption) private matOption: MatOption,
    private searcher: Searcher
    ) { }

  ngOnInit(): void {
    if (this.matOption) { this.matOption.disabled = true; }
    this.fullList = this.list;
    this.searcher.initSearch(this.list, this.searchProperties);
    this.subscriptions
      .add(this.matSelect.openedChange
      .subscribe(() => {
        const input = this.element.nativeElement;
        input.focus();
        if ((this.filteredList && this.filteredList.length === 0 && this.hasFilteredBefore) || this.clearSearchInput) {
          input.value = '';
          this.filtered.emit(this.fullList);
        }
      })
      .add(this.filtered.subscribe(() => this.isLoading = false))
    );
  }

  filterList(event: Event): void {
    this.hasFilteredBefore = true;
    this.isLoading = true;
    const inputEvent = event as InputEvent;
    this.filteredList = this.searcher.filterList(inputEvent);

    if (!this.filteredList) {
      this.isLoading = false;
      return;
    }

    const listWithoutConcatedValues = this.filteredList.map(item => {
      const itemCopy = {...item};
      delete itemCopy['concatedValues'];
      return itemCopy;
    });
    this.filtered.emit(listWithoutConcatedValues);
  }

  stopPropagationForSpaceBar(event: KeyboardEvent): void {
    if (event.key === ' ' ) { event.stopPropagation(); }
    console.log(event.key.charCodeAt(0));
  }

  ngOnDestroy(): void { this.subscriptions.unsubscribe(); }
}
