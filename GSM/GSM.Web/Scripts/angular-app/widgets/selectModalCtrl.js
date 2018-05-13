var App;
(function (App) {
    var Widgets;
    (function (Widgets) {
        var DefaultSelectModalConfig = (function () {
            function DefaultSelectModalConfig() {
                this.collectionName = 'ItemList';
                this.paginationOptions = {
                    pageNumber: 1,
                    pageSize: 10,
                    sort: null
                };
                this.sortOptions = {
                    sortBy: "",
                    sortOrder: "none"
                };
                this.searchOptions = {
                    searchDelay: 500,
                    filterText: '',
                    advancedFiltering: false
                };
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
            return DefaultSelectModalConfig;
        }());
        var SelectModalCtrl = (function () {
            function SelectModalCtrl($scope, $timeout, $uibModalInstance, searchResource, modalConfig) {
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.$uibModalInstance = $uibModalInstance;
                this.searchResource = searchResource;
                this.modalConfig = modalConfig;
                this.orSeparator = ' or ';
                this.andSeparator = ' and ';
                this.valueSeparator = '=';
                var defaultSettings = new DefaultSelectModalConfig();
                if (!this.modalConfig)
                    this.modalConfig = defaultSettings;
                this.initialize(defaultSettings);
                this.initializeGrid(defaultSettings);
                this.getData();
            }
            SelectModalCtrl.prototype.initialize = function (defaultSettings) {
                this.paginationOptions = this.modalConfig.paginationOptions || defaultSettings.paginationOptions;
                this.sortOptions = this.modalConfig.sortOptions || defaultSettings.sortOptions;
                this.searchOptions = this.modalConfig.searchOptions || defaultSettings.searchOptions;
                this.prompt = this.modalConfig.prompt || defaultSettings.prompt;
                this.collectionName = this.modalConfig.collectionName || defaultSettings.collectionName;
            };
            SelectModalCtrl.prototype.initializeGrid = function (defaultSettings) {
                var _this = this;
                this.gridOptions = defaultSettings.gridOptions;
                this.gridOptions.columnDefs = this.modalConfig.gridOptions.columnDefs || defaultSettings.gridOptions.columnDefs;
                this.gridOptions.multiSelect = this.modalConfig.gridOptions.multiSelect || defaultSettings.gridOptions.multiSelect;
                this.gridOptions.appScopeProvider = this;
                this.gridOptions.data = [];
                this.gridOptions.onRegisterApi = function (gridApi) {
                    _this.onRegisterApi(gridApi);
                };
            };
            SelectModalCtrl.prototype.onRegisterApi = function (gridApi) {
                var _this = this;
                this.gridApi = gridApi;
                gridApi.core.on.sortChanged(this.$scope, function (gridnay, sortColumn) {
                    _this.sortChanged(gridnay, sortColumn);
                });
                gridApi.pagination.on.paginationChanged(this.$scope, function (newPage, pageSize) {
                    _this.paginationChanged(newPage, pageSize);
                });
                gridApi.core.on.filterChanged(this.$scope, function () {
                    _this.filterChanged(gridApi);
                });
            };
            SelectModalCtrl.prototype.getData = function () {
                var _this = this;
                var query = {
                    filterText: this.searchOptions.filterText,
                    pageNo: this.paginationOptions.pageNumber,
                    pageSize: this.paginationOptions.pageSize,
                    sortBy: this.sortOptions.sortBy,
                    sortOrder: this.sortOptions.sortOrder
                };
                this.searchResource.getData(query)
                    .then(function (data) {
                    _this.gridOptions.data = data[_this.collectionName];
                    _this.gridOptions.totalItems = data.TotalItems;
                });
            };
            SelectModalCtrl.prototype.sortChanged = function (grid, sortColumn) {
                if (sortColumn.length > 0) {
                    this.sortOptions.sortBy = sortColumn[0].field;
                    this.sortOptions.sortOrder = sortColumn[0].sort.direction;
                }
                else {
                    this.sortOptions.sortBy = '';
                    this.sortOptions.sortOrder = 'none';
                }
                this.getData();
            };
            SelectModalCtrl.prototype.paginationChanged = function (newPage, pageSize) {
                this.paginationOptions.pageNumber = newPage;
                this.paginationOptions.pageSize = pageSize;
                this.getData();
            };
            SelectModalCtrl.prototype.filterChanged = function (gridApi) {
                var _this = this;
                if (angular.isDefined(this.$scope.filterTimeout)) {
                    this.$timeout.cancel(this.$scope.filterTimeout);
                }
                this.$scope.filterTimeout = this.$timeout(function () {
                    _this.searchOptions.filterText = _this.buildAndFilterQuery();
                    _this.getData();
                }, this.searchOptions.searchDelay);
            };
            SelectModalCtrl.prototype.toggleFiltering = function () {
                this.gridOptions.enableFiltering = !this.gridOptions.enableFiltering;
                this.gridApi.core.notifyDataChange('column');
                this.searchOptions.advancedFiltering = !this.searchOptions.advancedFiltering;
                this.clearFilter();
            };
            SelectModalCtrl.prototype.clearFilter = function () {
                this.filterValue = "";
                this.searchOptions.filterText = "";
                angular.forEach(this.gridApi.grid.columns, function (column) {
                    if (column.filters.length > 0) {
                        angular.forEach(column.filters, function (filter) {
                            filter.term = '';
                        });
                    }
                });
                this.getData();
            };
            SelectModalCtrl.prototype.singleFilter = function () {
                var _this = this;
                if (angular.isDefined(this.$scope.filterTimeout)) {
                    this.$timeout.cancel(this.$scope.filterTimeout);
                }
                this.$scope.filterTimeout = this.$timeout(function () {
                    _this.searchOptions.filterText = _this.buildOrFilterQuery();
                    _this.getData();
                }, this.searchOptions.searchDelay);
            };
            SelectModalCtrl.prototype.ok = function () {
                if (this.gridOptions.multiSelect) {
                    this.$uibModalInstance.close(this.gridApi.selection.getSelectedRows());
                }
                else {
                    this.$uibModalInstance.close(this.gridApi.selection.getSelectedRows()[0]);
                }
            };
            SelectModalCtrl.prototype.isOkEnabled = function () {
                if (this.modalConfig.okEnabledCondition)
                    return this.modalConfig.okEnabledCondition(this.gridApi.selection.getSelectedRows());
                return true;
            };
            SelectModalCtrl.prototype.cancel = function () {
                this.$uibModalInstance.close('cancel');
            };
            SelectModalCtrl.prototype.isCancelEnabled = function () {
            };
            SelectModalCtrl.prototype.buildOrFilterQuery = function () {
                var _this = this;
                var serchTerm = [];
                var columns = this.gridApi.grid.columns;
                angular.forEach(columns, function (column) {
                    if (_this.gridOptions.columnDefs.map(function (c) { return c.field; }).indexOf(column.field) !== -1) {
                        var field = column.field;
                        serchTerm.push(field, _this.valueSeparator, _this.filterValue, _this.orSeparator);
                    }
                });
                return serchTerm.join("");
            };
            SelectModalCtrl.prototype.buildAndFilterQuery = function () {
                var _this = this;
                var searchTerm = [];
                angular.forEach(this.gridApi.grid.columns, function (column) {
                    var field = column.field;
                    var filters = column.filters;
                    var filterTerm = filters[0].term;
                    if (filterTerm != null) {
                        searchTerm.push(field, _this.valueSeparator);
                        searchTerm.push(filterTerm);
                        searchTerm.push(_this.andSeparator);
                    }
                });
                return searchTerm.join("");
            };
            SelectModalCtrl.$inject = ['$scope', '$timeout', '$uibModalInstance', 'searchResource', 'selectModalConfig'];
            return SelectModalCtrl;
        }());
        Widgets.SelectModalCtrl = SelectModalCtrl;
    })(Widgets = App.Widgets || (App.Widgets = {}));
})(App || (App = {}));
//# sourceMappingURL=selectModalCtrl.js.map