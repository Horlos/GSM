var App;
(function (App) {
    var Targets;
    (function (Targets) {
        var Controllers;
        (function (Controllers) {
            var TargetsCtrl = (function () {
                function TargetsCtrl($scope, $timeout, $location, targetsService, userSettingsService) {
                    this.$scope = $scope;
                    this.$timeout = $timeout;
                    this.$location = $location;
                    this.targetsService = targetsService;
                    this.userSettingsService = userSettingsService;
                    this.initialize();
                    this.initializeGrid();
                    this.loadUserSettings();
                    this.getTargets();
                }
                TargetsCtrl.prototype.initialize = function () {
                    this.loading = false;
                    this.searchOptions = {
                        advancedFiltering: false,
                        filterText: '',
                        searchDelay: 500
                    };
                    this.paginationOptions = {
                        pageNumber: 1,
                        pageSize: 50,
                        sort: null
                    };
                    this.sortOptions = {
                        sortBy: '',
                        sortOrder: 'none'
                    };
                };
                TargetsCtrl.prototype.initializeGrid = function () {
                    var _this = this;
                    this.gridOptions = {
                        paginationPageSizes: [50, 100, 500],
                        enableGridMenu: true,
                        enableColumnMenus: false,
                        useExternalSorting: true,
                        useExternalPagination: true,
                        useExternalFiltering: true,
                        enableRowSelection: true,
                        enableRowHeaderSelection: false,
                        multiSelect: false,
                        modifierKeysToMultiSelect: false,
                        noUnselect: true,
                        appScopeProvider: this,
                        onRegisterApi: function (gridApi) {
                            _this.onRegisterApi(gridApi);
                        },
                        columnDefs: [
                            { name: 'Name', field: 'Name', visible: true },
                            { name: 'IsActive', field: 'IsActive', visible: true }
                        ]
                    };
                };
                TargetsCtrl.prototype.onRegisterApi = function (gridApi) {
                    var _this = this;
                    this.gridApi = gridApi;
                    gridApi.core.on.sortChanged(this.$scope, function (grid, sortColumn) {
                        _this.sortChanged(grid, sortColumn);
                    });
                    gridApi.core.on.columnVisibilityChanged(this.$scope, function (column) {
                        _this.handleColumnVisibilityChanged(column);
                    });
                    gridApi.core.on.filterChanged(this.$scope, function () {
                        _this.filterChanged();
                    });
                    gridApi.colMovable.on.columnPositionChanged(this.$scope, function (colDef, originalPosition, newPosition) {
                        _this.handleColumnPositionChanged(colDef, originalPosition, newPosition);
                    });
                    gridApi.pagination.on.paginationChanged(this.$scope, function (newPage, pageSize) {
                        _this.paginationChanged(newPage, pageSize);
                    });
                    gridApi.selection.on.rowSelectionChanged(this.$scope, function (row) {
                        _this.rowSelectionChanged(row);
                    });
                };
                TargetsCtrl.prototype.sortChanged = function (grid, sortColumn) {
                    if (sortColumn.length > 0) {
                        this.sortOptions.sortBy = sortColumn[0].field;
                        this.sortOptions.sortOrder = sortColumn[0].sort.direction;
                    }
                    else {
                        this.sortOptions.sortBy = '';
                        this.sortOptions.sortOrder = 'none';
                    }
                    this.getTargets();
                };
                TargetsCtrl.prototype.handleColumnVisibilityChanged = function (column) {
                    var newColumnDisplayOrder = this.userSettings.columnDisplayOrder.slice();
                    var columns = this.gridApi.grid.columns;
                    var index = -1;
                    if (column.visible) {
                        index = columns.filter(function (col) { return col.visible; }).indexOf(column);
                        newColumnDisplayOrder.splice(index, 0, column.field);
                    }
                    else {
                        index = newColumnDisplayOrder.indexOf(column.field);
                        newColumnDisplayOrder.splice(index, 1);
                    }
                    this.userSettings.columnDisplayOrder = newColumnDisplayOrder;
                    this.saveUserSettings();
                };
                TargetsCtrl.prototype.filterChanged = function () {
                    var _this = this;
                    if (angular.isDefined(this.$scope.filterTimeout)) {
                        this.$timeout.cancel(this.$scope.filterTimeout);
                    }
                    this.$scope.filterTimeout = this.$timeout(function () {
                        _this.getFilteredTargets();
                    }, this.searchOptions.searchDelay);
                };
                TargetsCtrl.prototype.handleColumnPositionChanged = function (colDef, originalPosition, newPosition) {
                    var newColumnDisplayOrder = this.userSettings.columnDisplayOrder.slice();
                    var index = newColumnDisplayOrder.indexOf(colDef.field);
                    var oldCol = newColumnDisplayOrder.splice(index, 1);
                    newColumnDisplayOrder.splice(newPosition, 0, oldCol[0]);
                    this.userSettings.columnDisplayOrder = newColumnDisplayOrder;
                    this.saveUserSettings();
                };
                TargetsCtrl.prototype.paginationChanged = function (newPage, pageSize) {
                    this.paginationOptions.pageNumber = newPage;
                    this.paginationOptions.pageSize = pageSize;
                    this.getTargets();
                    this.userSettings.pageSize = pageSize;
                    this.saveUserSettings();
                };
                TargetsCtrl.prototype.rowSelectionChanged = function (row) {
                    window.location.pathname = '/Target/Edit/' + row.entity.Id;
                };
                TargetsCtrl.prototype.singleFilter = function () {
                    var _this = this;
                    if (angular.isDefined(this.$scope.filterTimeout)) {
                        this.$timeout.cancel(this.$scope.filterTimeout);
                    }
                    this.$scope.filterTimeout = this.$timeout(function () {
                        _this.searchOptions.filterText = _this.buildFilterQuery();
                        _this.getTargets();
                    }, this.searchOptions.searchDelay);
                };
                TargetsCtrl.prototype.toggleFiltering = function () {
                    this.gridOptions.enableFiltering = !this.gridOptions.enableFiltering;
                    this.gridApi.core.notifyDataChange('column');
                    this.searchOptions.advancedFiltering = !this.searchOptions.advancedFiltering;
                    this.clearFilter();
                };
                TargetsCtrl.prototype.clearFilter = function () {
                    this.filterValue = "";
                    this.searchOptions.filterText = "";
                    $.each(this.gridApi.grid.columns, function (index, column) {
                        if (column.filters.length > 0) {
                            $.each(column.filters, function (index, filter) {
                                filter.term = '';
                            });
                        }
                    });
                    this.getTargets();
                };
                TargetsCtrl.prototype.getTargets = function () {
                    var _this = this;
                    this.loading = true;
                    this.gridOptions.data = [];
                    this.targetsService.getTargets(this.paginationOptions, this.sortOptions, this.searchOptions)
                        .then(function (data) {
                        _this.loading = false;
                        if (data) {
                            _this.gridOptions.totalItems = data.TotalItems;
                            _this.gridOptions.data = data.ItemList;
                        }
                    });
                };
                TargetsCtrl.prototype.getFilteredTargets = function () {
                    var _this = this;
                    this.searchOptions.filterText = "";
                    $.each(this.gridApi.grid.columns, function (index, column) {
                        if (column.filters[0].term != null) {
                            _this.searchOptions.filterText = _this.searchOptions.filterText +
                                column.field +
                                "=" +
                                column.filters[0].term +
                                " and ";
                        }
                    });
                    this.getTargets();
                };
                TargetsCtrl.prototype.getExportAsCsvLink = function () {
                    this.exportAsCSV = 'filterText=' +
                        this.searchOptions.filterText +
                        '&sortBy=' +
                        this.sortOptions.sortBy +
                        '&sortOrder=' +
                        this.sortOptions.sortOrder;
                    return '/api/targets?' + this.exportAsCSV;
                };
                TargetsCtrl.prototype.buildFilterQuery = function () {
                    var _this = this;
                    var filterText = "";
                    var columns = this.gridApi.grid.columns;
                    $.each(columns, function (index, column) {
                        if (column.visible) {
                            filterText = filterText +
                                column.field +
                                "=" +
                                _this.filterValue +
                                " or ";
                        }
                    });
                    return filterText;
                };
                TargetsCtrl.prototype.loadUserSettings = function () {
                    var _this = this;
                    this.userSettingsService.getSettingsByKey("TargetSearchSettings")
                        .then(function (data) {
                        var newColDefs = [];
                        var currentLocations = [];
                        var columnDefs = _this.gridOptions.columnDefs;
                        var columnDisplayOrder = data.columnDisplayOrder;
                        var pageSize = data.pageSize || 50;
                        _this.gridOptions.paginationPageSize = pageSize;
                        angular.forEach(columnDefs, function (item) {
                            currentLocations.push(item.field);
                        });
                        angular.forEach(columnDisplayOrder, function (columnName) {
                            var colDef = columnDefs[currentLocations.indexOf(columnName)];
                            if (angular.isDefined(colDef)) {
                                colDef.visible = true;
                                newColDefs.push(colDef);
                            }
                        });
                        if (newColDefs.length > 0) {
                            angular.forEach(columnDefs, function (item) {
                                if (newColDefs.indexOf(item) === -1) {
                                    item.visible = false;
                                    newColDefs.push(item);
                                }
                            });
                            _this.gridOptions.columnDefs = newColDefs;
                        }
                        _this.userSettings = data;
                    });
                };
                TargetsCtrl.prototype.saveUserSettings = function () {
                    this.userSettingsService.saveSettings('TargetSearchSettings', this.userSettings);
                };
                TargetsCtrl.$inject = ['$scope', '$timeout', '$location', 'targetsService', 'userSettingsService'];
                return TargetsCtrl;
            }());
            App.getAppContainer()
                .getSection("app.targets")
                .getInstance()
                .controller("TargetsCtrl", TargetsCtrl);
        })(Controllers = Targets.Controllers || (Targets.Controllers = {}));
    })(Targets = App.Targets || (App.Targets = {}));
})(App || (App = {}));
//# sourceMappingURL=targetsCtrl.js.map