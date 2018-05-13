namespace App.Common {
    export interface IPaginationOptions {
        pageNumber: number;
        pageSize: number;
        sort: string;
    }

    export interface ISortOptions {
        sortBy: string;
        sortOrder: string;
    }

    export interface ISearchOptions {
        searchDelay: number;
        filterText: string;
        advancedFiltering: boolean;
    }

    export interface ISearchResult<T> {
        totalItems: number;
        items: Array<T>;
    }

    export interface ISearchResult<T> {
        ItemList: Array<T>;
        TotalItems: number;
    }
}