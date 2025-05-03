import { SortOrder, SortOrderEnum, SortOrderFormat } from '../types/sort-order.type';

export function toggleSortOrder(current: SortOrderEnum): SortOrderEnum {
    return current === SortOrderEnum.Asc || current === SortOrderEnum.Ascending
        ? SortOrderEnum.Descending
        : SortOrderEnum.Ascending;
}

export function getFormattedSortOrder(order: SortOrderEnum, format: SortOrderFormat): SortOrder {
    const isAsc = order === SortOrderEnum.Asc || order === SortOrderEnum.Ascending;

    if (format === 'compact') {
        return isAsc ? SortOrderEnum.Asc : SortOrderEnum.Desc;
    } else {
        return isAsc ? SortOrderEnum.Ascending : SortOrderEnum.Descending;
    }
}

