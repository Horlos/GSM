var App;
(function (App) {
    var Species;
    (function (Species) {
        var Controllers;
        (function (Controllers) {
            var SpeciesCtrl = (function () {
                function SpeciesCtrl($scope, $timeout, $location, speciesService, userSettingsService) {
                    this.$scope = $scope;
                    this.$timeout = $timeout;
                    this.$location = $location;
                    this.speciesService = speciesService;
                    this.userSettingsService = userSettingsService;
                    this.initialize();
                    this.initializeGrid();
                    this.loadUserSettings();
                    this.getSpecies();
                }
                SpeciesCtrl.prototype.initialize = function () {
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
                SpeciesCtrl.prototype.initializeGrid = function () {
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
                SpeciesCtrl.prototype.onRegisterApi = function (gridApi) {
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
                SpeciesCtrl.prototype.sortChanged = function (grid, sortColumn) {
                    if (sortColumn.length > 0) {
                        this.sortOptions.sortBy = sortColumn[0].field;
                        this.sortOptions.sortOrder = sortColumn[0].sort.direction;
                    }
                    else {
                        this.sortOptions.sortBy = '';
                        this.sortOptions.sortOrder = 'none';
                    }
                    this.getSpecies();
                };
                SpeciesCtrl.prototype.handleColumnVisibilityChanged = function (column) {
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
                SpeciesCtrl.prototype.filterChanged = function () {
                    var _this = this;
                    if (angular.isDefined(this.$scope.filterTimeout)) {
                        this.$timeout.cancel(this.$scope.filterTimeout);
                    }
                    this.$scope.filterTimeout = this.$timeout(function () {
                        _this.getFilteredSpecies();
                    }, this.searchOptions.searchDelay);
                };
                SpeciesCtrl.prototype.handleColumnPositionChanged = function (colDef, originalPosition, newPosition) {
                    var newColumnDisplayOrder = this.userSettings.columnDisplayOrder.slice();
                    var index = newColumnDisplayOrder.indexOf(colDef.field);
                    var oldCol = newColumnDisplayOrder.splice(index, 1);
                    newColumnDisplayOrder.splice(newPosition, 0, oldCol[0]);
                    this.userSettings.columnDisplayOrder = newColumnDisplayOrder;
                    this.saveUserSettings();
                };
                SpeciesCtrl.prototype.paginationChanged = function (newPage, pageSize) {
                    this.paginationOptions.pageNumber = newPage;
                    this.paginationOptions.pageSize = pageSize;
                    this.getSpecies();
                    this.userSettings.pageSize = pageSize;
                    this.saveUserSettings();
                };
                SpeciesCtrl.prototype.rowSelectionChanged = function (row) {
                    window.location.pathname = '/Species/Edit/' + row.entity.Id;
                };
                SpeciesCtrl.prototype.singleFilter = function () {
                    var _this = this;
                    if (angular.isDefined(this.$scope.filterTimeout)) {
                        this.$timeout.cancel(this.$scope.filterTimeout);
                    }
                    this.$scope.filterTimeout = this.$timeout(function () {
                        _this.searchOptions.filterText = _this.buildFilterQuery();
                        _this.getSpecies();
                    }, this.searchOptions.searchDelay);
                };
                SpeciesCtrl.prototype.toggleFiltering = function () {
                    this.gridOptions.enableFiltering = !this.gridOptions.enableFiltering;
                    this.gridApi.core.notifyDataChange('column');
                    this.searchOptions.advancedFiltering = !this.searchOptions.advancedFiltering;
                    this.clearFilter();
                };
                SpeciesCtrl.prototype.clearFilter = function () {
                    this.filterValue = "";
                    this.searchOptions.filterText = "";
                    $.each(this.gridApi.grid.columns, function (index, column) {
                        if (column.filters.length > 0) {
                            $.each(column.filters, function (index, filter) {
                                filter.term = '';
                            });
                        }
                    });
                    this.getSpecies();
                };
                SpeciesCtrl.prototype.getSpecies = function () {
                    var _this = this;
                    this.loading = true;
                    this.speciesService.getSpecies(this.paginationOptions, this.sortOptions, this.searchOptions)
                        .then(function (data) {
                        _this.loading = false;
                        if (data) {
                            _this.gridOptions.totalItems = data.TotalItems;
                            _this.gridOptions.data = data.ItemList;
                        }
                    });
                };
                SpeciesCtrl.prototype.getFilteredSpecies = function () {
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
                    this.getSpecies();
                };
                SpeciesCtrl.prototype.getExportAsCsvLink = function () {
                    this.exportAsCSV = 'filterText=' +
                        this.searchOptions.filterText +
                        '&sortBy=' +
                        this.sortOptions.sortBy +
                        '&sortOrder=' +
                        this.sortOptions.sortOrder;
                    return '/api/species?' + this.exportAsCSV;
                };
                SpeciesCtrl.prototype.buildFilterQuery = function () {
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
                SpeciesCtrl.prototype.loadUserSettings = function () {
                    var _this = this;
                    this.userSettingsService.getSettingsByKey("SpeciesSearchSettings")
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
                SpeciesCtrl.prototype.saveUserSettings = function () {
                    this.userSettingsService.saveSettings('SpeciesSearchSettings', this.userSettings);
                };
                SpeciesCtrl.$inject = ['$scope', '$timeout', '$location', 'speciesService', 'userSettingsService'];
                return SpeciesCtrl;
            }());
            App.getAppContainer()
                .getSection("app.species")
                .getInstance()
                .controller("SpeciesCtrl", SpeciesCtrl);
        })(Controllers = Species.Controllers || (Species.Controllers = {}));
    })(Species = App.Species || (App.Species = {}));
})(App || (App = {}));
//# sourceMappingURL=speciesCtrl.js.map