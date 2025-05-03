export enum SortOrderEnum {
    Asc = 'asc',
    Desc = 'desc',
    Ascending = 'ascending',
    Descending = 'descending'
}

export type SortOrder = SortOrderEnum.Asc | SortOrderEnum.Desc | SortOrderEnum.Ascending | SortOrderEnum.Descending;
export type SortOrderFormat = 'compact' | 'full'; // compact = 'asc'/'desc', full = 'ascending'/'descending'
