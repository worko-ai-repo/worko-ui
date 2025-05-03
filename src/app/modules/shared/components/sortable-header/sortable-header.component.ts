import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SortOrder, SortOrderEnum, SortOrderFormat } from '../../types/sort-order.type';
import { toggleSortOrder, getFormattedSortOrder } from '../../utils/sort-order.util';

@Component({
  selector: 'app-sortable-header',
  templateUrl: './sortable-header.component.html',
  styleUrls: ['./sortable-header.component.scss']
})
export class SortableHeaderComponent {

  sortOrder: SortOrderEnum = SortOrderEnum.Descending;
  SortOrderEnum = SortOrderEnum;

  @Input() outputFormat: SortOrderFormat = 'full'; // 'full' = 'ascending'/'descending', 'compact' = 'asc'/'desc'

  @Output() sortOrderChange = new EventEmitter<SortOrder>();

  toggleSort(): void {
    this.sortOrder = toggleSortOrder(this.sortOrder);
    const formatted = getFormattedSortOrder(this.sortOrder, this.outputFormat);
    this.sortOrderChange.emit(formatted);
  }

}
