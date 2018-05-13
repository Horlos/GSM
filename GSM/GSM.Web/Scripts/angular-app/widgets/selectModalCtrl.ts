namespace App.Widgets {
    export interface ISearchResource {
        getData(query: any): ng.IPromise<App.Common.ISearchResult<any>>;
    }

    export interface ISelectModalConfig {
        paginationOptions?: App.Common.IPaginationOptions;
        sortOptions?: App.Common.ISortOptions;
        searchOptions?: App.Common.ISearchOptions;
        gridOptions: uiGrid.IGridOptions;
        collectionName?: string;
        prompt: string;
        okEnabledCondition?: (params: any) => boolean;
        cancelEnabledCondition?: (params: any) => boolean;
    }

    class DefaultSelectModalConfig implements ISelectModalConfig {
        paginationOptions: App.Common.IPaginationOptions;
        sortOptions: App.Common.ISortOptions;
        searchOptions: App.Common.ISearchOptions;
        gridOptions: uiGrid.IGridOptions;
        collectionName: string;
        prompt: string;

        constructor() {
            this.collectionName = 'ItemList';
            this.paginationOptions = {
                pageNumber: 1,
                pageSize: 10,
                sort: null
            };
            this.sortOptions = {
                sortBy: "",
                sortOrder: "none"
            }
            this.searchOptions = {
                searchDelay: 500,
                filterText: '',
                advancedFiltering: false
            }
            this.gridOptions = {
                paginationPageSizes: [10, 25, 50],
                enableColumnMenus: false,
                useExternalSorting: true,
                useExternalPagination: true,
                useExternalFiltering: true,
                enableRowSelection: true,
                enableRowHeaderSelection: true,
                enableFullRowSelection: false,
                enableSelectAll: true,
                multiSelect: false,
                modifierKeysToMultiSelect: false,
                columnDefs: [],
                data: []
            };
        }
    }

    export class SelectModalCtrl {
        private orSeparator: string = ' or ';
        private andSeparator: string = ' and ';
        private valueSeparator: string = '=';

        public paginationOptions: App.Common.IPaginationOptions;
        public sortOptions: App.Common.ISortOptions;
        public searchOptions: App.Common.ISearchOptions;
        public gridOptions: uiGrid.IGridOptions;
        public gridApi: uiGrid.IGridApi;
        public collectionName: string;

        public prompt: string;
        public filterValue: string;

        static $inject = ['$scope', '$timeout', '$uibModalInstance', 'searchResource', 'selectModalConfig'];
        constructor(
            private $scope,
            private $timeout,
            private $uibModalInstance,
            private searchResource: ISearchResource,
            private modalConfig?: ISelectModalConfig) {
            let defaultSettings = new DefaultSelectModalConfig();
            if (!this.modalConfig)
                this.modalConfig = defaultSettings;

            this.initialize(defaultSettings);
            this.initializeGrid(defaultSettings);
            this.getData();
        }

        initialize(defaultSettings) {
            this.paginationOptions = this.modalConfig.paginationOptions || defaultSettings.paginationOptions;
            this.sortOptions = this.modalConfig.sortOptions || defaultSettings.sortOptions;
            this.searchOptions = this.modalConfig.searchOptions || defaultSettings.searchOptions;
            this.prompt = this.modalConfig.prompt || defaultSettings.prompt;
            this.collectionName = this.modalConfig.collectionName || defaultSettings.collectionName;
        }

        initializeGrid(defaultSettings): void {
            this.gridOptions = defaultSettings.gridOptions;
            this.gridOptions.columnDefs = this.modalConfig.gridOptions.columnDefs || defaultSettings.gridOptions.columnDefs;
            this.gridOptions.multiSelect = this.modalConfig.gridOptions.multiSelect || defaultSettings.gridOptions.multiSelect;
            this.gridOptions.appScopeProvider = this;
            this.gridOptions.data = [];
            this.gridOptions.onRegisterApi = (gridApi: uiGrid.IGridApi) => {
                this.onRegisterApi(gridApi);
            };
        }

        onRegisterApi(gridApi: uiGrid.IGridApi) {
            this.gridApi = gridApi;
            gridApi.core.on.sortChanged(this.$scope, (gridnay, sortColumn) => {
                this.sortChanged(gridnay, sortColumn);
            });
            gridApi.pagination.on.paginationChanged(this.$scope, (newPage, pageSize) => {
                this.paginationChanged(newPage, pageSize);
            });
            gridApi.core.on.filterChanged(this.$scope, () => {
                this.filterChanged(gridApi);
            });
        }

        getData() {
            let query = {
                filterText: this.searchOptions.filterText,
                pageNo: this.paginationOptions.pageNumber,
                pageSize: this.paginationOptions.pageSize,
                sortBy: this.sortOptions.sortBy,
                sortOrder: this.sortOptions.sortOrder
            };
            this.searchResource.getData(query)
                .then((data: App.Common.ISearchResult<any>): void => {
                    this.gridOptions.data = data[this.collectionName];
                    this.gridOptions.totalItems = data.TotalItems;
                });
        }

        sortChanged(grid, sortColumn): void {
            if (sortColumn.length > 0) {
                this.sortOptions.sortBy = sortColumn[0].field;
                this.sortOptions.sortOrder = sortColumn[0].sort.direction;
            } else {
                this.sortOptions.sortBy = '';
                this.sortOptions.sortOrder = 'none';
            }
            this.getData();
        }

        paginationChanged(newPage, pageSize) {
            this.paginationOptions.pageNumber = newPage;
            this.paginationOptions.pageSize = pageSize;
            this.getData();
        }

        filterChanged(gridApi: uiGrid.IGridApi) {
            if (angular.isDefined(this.$scope.filterTimeout)) {
                this.$timeout.cancel(this.$scope.filterTimeout);
            }
            this.$scope.filterTimeout = this.$timeout(() => {
                this.searchOptions.filterText = this.buildAndFilterQuery();
                this.getData();
            }, this.searchOptions.searchDelay);
        }

        toggleFiltering() {
            this.gridOptions.enableFiltering = !this.gridOptions.enableFiltering;
            this.gridApi.core.notifyDataChange('column');
            this.searchOptions.advancedFiltering = !this.searchOptions.advancedFiltering;
            this.clearFilter();
        }

        clearFilter() {
            this.filterValue = "";
            this.searchOptions.filterText = "";
            angular.forEach(this.gridApi.grid.columns,
                (column: uiGrid.IGridColumn) => {
                    if (column.filters.length > 0) {
                        angular.forEach(column.filters,
                            (filter: uiGrid.IFilterOptions) => {
                                filter.term = '';
                            });
                    }
                });
            this.getData();
        }

        singleFilter(): void {
            if (angular.isDefined(this.$scope.filterTimeout)) {
                this.$timeout.cancel(this.$scope.filterTimeout);
            }
            this.$scope.filterTimeout = this.$timeout(() => {
                this.searchOptions.filterText = this.buildOrFilterQuery();
                this.getData();
            },
                this.searchOptions.searchDelay);
        }

        ok() {
            if (this.gridOptions.multiSelect) {
                this.$uibModalInstance.close(this.gridApi.selection.getSelectedRows());
            } else {
                this.$uibModalInstance.close(this.gridApi.selection.getSelectedRows()[0]);
            }
        }

        isOkEnabled() {
            if (this.modalConfig.okEnabledCondition)
                return this.modalConfig.okEnabledCondition(this.gridApi.selection.getSelectedRows());

            return true;
        }

        cancel() {
            this.$uibModalInstance.close('cancel');
        }

        isCancelEnabled() {

        }

        private buildOrFilterQuery(): string {
            let serchTerm: string[] = [];
            let columns = this.gridApi.grid.columns;
            angular.forEach(columns,
                (column: uiGrid.IColumnDef) => {
                    if (this.gridOptions.columnDefs.map((c) => { return c.field }).indexOf(column.field) !== -1) {
                        let field = column.field;
                        serchTerm.push(field,
                            this.valueSeparator,
                            this.filterValue,
                            this.orSeparator);
                    }
                });


            return serchTerm.join("");
        }

        private buildAndFilterQuery(): string {
            let searchTerm: string[] = [];
            angular.forEach(this.gridApi.grid.columns,
                (column: uiGrid.IColumnDef) => {
                    let field = column.field;
                    let filters = column.filters;
                    let filterTerm = filters[0].term;
                    if (filterTerm != null) {
                        searchTerm.push(field, this.valueSeparator);
                        searchTerm.push(filterTerm);
                        searchTerm.push(this.andSeparator);
                    }
                });
            return searchTerm.join("");
        }
    }
}