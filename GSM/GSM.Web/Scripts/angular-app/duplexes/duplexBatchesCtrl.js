var App;
(function (App) {
    var Duplexes;
    (function (Duplexes) {
        var Controllers;
        (function (Controllers) {
            var DuplexBatchesCtrl = (function () {
                function DuplexBatchesCtrl($scope, $window, $timeout, $location, duplexesService, userSettingsService) {
                    var _this = this;
                    this.$scope = $scope;
                    this.$window = $window;
                    this.$timeout = $timeout;
                    this.$location = $location;
                    this.duplexesService = duplexesService;
                    this.userSettingsService = userSettingsService;
                    this.initialize();
                    this.initializeGrid();
                    this.loadUserSettings().then(function () {
                        _this.getDuplexes();
                    });
                }
                DuplexBatchesCtrl.prototype.initialize = function () {
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
                DuplexBatchesCtrl.prototype.initializeGrid = function () {
                    var _this = this;
                    var sTemp = '<div ng-if="row.groupHeader" class="ui-grid-cell-contents">{{grid.getCellValue(row.treeNode.children[0].row, col) CUSTOM_FILTERS}}</div>';
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
                        enableHorizontalScrollbar: true,
                        enableColumnResizing: true,
                        onRegisterApi: function (gridApi) {
                            _this.onRegisterApi(gridApi);
                        },
                        columnDefs: [
                            {
                                name: 'ArrowHeadDuplexBatchNumber',
                                displayName: 'Duplex Batch #',
                                field: 'ArrowHeadDuplexBatchNumber',
                                visible: true
                            },
                            {
                                name: 'PreparedDate',
                                displayName: 'Date Prepared',
                                field: 'PreparedDate',
                                visible: true,
                                cellFilter: 'date:\'yyyy-MM-dd\''
                            },
                            {
                                name: 'Target',
                                displayName: 'Target',
                                field: 'Target.Name',
                                visible: true
                            },
                            {
                                name: 'RunID',
                                displayName: 'Run ID',
                                field: 'RunId',
                                visible: true
                            },
                            {
                                name: 'Purity',
                                displayName: 'Duplex % FLP',
                                field: 'Purity',
                                cellFilter: 'number: 2',
                                visible: true
                            },
                            {
                                name: 'AmountRemaining',
                                displayName: 'Duplex Amount Remaining (mg)',
                                field: 'AmountRemaining',
                                cellFilter: 'number: 1',
                                visible: true
                            },
                            {
                                name: 'ArrowheadDuplexId',
                                displayName: 'Duplex ID',
                                field: 'Duplex.ArrowheadDuplexId',
                                visible: true
                            },
                            {
                                name: 'Unavailable',
                                displayName: 'No Longer Available',
                                field: 'Unavailable',
                                visible: true,
                                type: 'boolean',
                                cellTemplate: '<input type="checkbox" ng-model="row.entity.Unavailable" disabled>'
                            },
                            {
                                name: 'AntiSenseStrandId',
                                displayName: 'AS ID',
                                field: 'Duplex.AntiSenseStrand.ArrowheadStrandId',
                                visible: false
                            },
                            {
                                name: 'AntiSenseStrandMW',
                                displayName: 'AS MW',
                                field: 'Duplex.AntiSenseStrand.MW',
                                visible: false
                            },
                            {
                                name: 'SenseStrandId',
                                displayName: 'SS ID',
                                field: 'Duplex.SenseStrand.ArrowheadStrandId',
                                visible: false
                            },
                            {
                                name: 'SenseStrandMW',
                                displayName: 'SS MW',
                                field: 'Duplex.SenseStrand.MW',
                                visible: false
                            },
                            {
                                name: "ASBatchNumber",
                                displayName: 'AS Batch #',
                                field: "AntisenseStrandBatch.ArrowHeadBatchNumber",
                                visible: true
                            },
                            {
                                name: "ASBatchPurity",
                                displayName: 'AS Batch % FLP',
                                field: "AntisenseStrandBatch.Purity",
                                cellFilter: 'number: 2',
                                visible: true
                            },
                            {
                                name: "ASBatchConcentration",
                                displayName: 'AS Batch Conc. (mg/ml)',
                                field: "AntisenseStrandBatch.Concentration",
                                cellFilter: 'number: 2',
                                visible: true
                            },
                            {
                                name: "ASBatchRemainingVolume",
                                displayName: 'AS Batch Remaining Volume (ul)',
                                field: "AntisenseStrandBatch.RemainingVolume",
                                cellFilter: 'number: 1',
                                visible: true
                            },
                            {
                                name: "SSBatchNumber",
                                displayName: 'SS Batch #',
                                field: "SenseStrandBatch.ArrowHeadBatchNumber",
                                visible: true
                            },
                            {
                                name: "SSBatchPurity",
                                displayName: 'SS Batch % FLP',
                                field: "SenseStrandBatch.Purity",
                                cellFilter: 'number: 2',
                                visible: true
                            },
                            {
                                name: "SSBatchConcentration",
                                displayName: 'SS Batch Conc. (mg/ml)',
                                field: "SenseStrandBatch.Concentration",
                                cellFilter: 'number: 2',
                                visible: true
                            },
                            {
                                name: "SSBatchRemainingVolume",
                                displayName: 'SS Batch Remaining Volume (ul)',
                                field: "SenseStrandBatch.RemainingVolume",
                                cellFilter: 'number: 1',
                                visible: true
                            }
                        ]
                    };
                };
                DuplexBatchesCtrl.prototype.onRegisterApi = function (gridApi) {
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
                DuplexBatchesCtrl.prototype.paginationChanged = function (newPage, pageSize) {
                    this.paginationOptions.pageNumber = newPage;
                    this.paginationOptions.pageSize = pageSize;
                    this.getDuplexes();
                    this.userSettings.pageSize = pageSize;
                    this.saveUserSettings();
                };
                DuplexBatchesCtrl.prototype.rowSelectionChanged = function (row) {
                    this.$window.location.pathname = '/Duplex/EditDuplexBatch/' + row.entity.Id;
                };
                DuplexBatchesCtrl.prototype.filterChanged = function () {
                    var _this = this;
                    if (angular.isDefined(this.$scope.filterTimeout)) {
                        this.$timeout.cancel(this.$scope.filterTimeout);
                    }
                    this.$scope.filterTimeout = this.$timeout(function () {
                        _this.getFilteredData();
                    }, this.searchOptions.searchDelay);
                };
                DuplexBatchesCtrl.prototype.handleColumnVisibilityChanged = function (column) {
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
                    this.getDuplexes();
                };
                DuplexBatchesCtrl.prototype.handleColumnPositionChanged = function (colDef, originalPosition, newPosition) {
                    var newColumnDisplayOrder = this.userSettings.columnDisplayOrder.slice();
                    var index = newColumnDisplayOrder.indexOf(colDef.field);
                    var oldCol = newColumnDisplayOrder.splice(index, 1);
                    newColumnDisplayOrder.splice(newPosition, 0, oldCol[0]);
                    this.userSettings.columnDisplayOrder = newColumnDisplayOrder;
                    this.saveUserSettings();
                };
                DuplexBatchesCtrl.prototype.sortChanged = function (grid, sortColumn) {
                    if (sortColumn.length > 0) {
                        this.sortOptions.sortBy = sortColumn[0].field;
                        this.sortOptions.sortOrder = sortColumn[0].sort.direction;
                    }
                    else {
                        this.sortOptions.sortBy = '';
                        this.sortOptions.sortOrder = 'none';
                    }
                    this.getDuplexes();
                };
                DuplexBatchesCtrl.prototype.singleFilter = function () {
                    var _this = this;
                    if (angular.isDefined(this.$scope.filterTimeout)) {
                        this.$timeout.cancel(this.$scope.filterTimeout);
                    }
                    this.$scope.filterTimeout = this.$timeout(function () {
                        _this.searchOptions.filterText = _this.buildFilterQuery();
                        _this.getDuplexes();
                    }, this.searchOptions.searchDelay);
                };
                DuplexBatchesCtrl.prototype.buildFilterQuery = function () {
                    var filterValue = this.filterValue;
                    var columns = this.gridApi.grid.columns;
                    var filterText = "";
                    angular.forEach(columns, function (column) {
                        if (column.visible) {
                            filterText = filterText +
                                column.field +
                                "=" +
                                filterValue +
                                " or ";
                        }
                    });
                    return filterText;
                };
                DuplexBatchesCtrl.prototype.toggleFiltering = function () {
                    this.gridOptions.enableFiltering = !this.gridOptions.enableFiltering;
                    this.gridApi.core.notifyDataChange('column');
                    this.searchOptions.advancedFiltering = !this.searchOptions.advancedFiltering;
                    this.clearFilter();
                };
                DuplexBatchesCtrl.prototype.clearFilter = function () {
                    this.filterValue = "";
                    this.searchOptions.filterText = "";
                    $.each(this.gridApi.grid.columns, function (index, column) {
                        if (column.filters.length > 0) {
                            $.each(column.filters, function (index, filter) {
                                filter.term = '';
                            });
                        }
                    });
                    this.getDuplexes();
                };
                DuplexBatchesCtrl.prototype.getExportAsCsvLink = function () {
                    this.exportAsCSV = 'filterText=' +
                        this.searchOptions.filterText +
                        '&sortBy=' +
                        this.sortOptions.sortBy +
                        '&sortOrder=' +
                        this.sortOptions.sortOrder;
                    return '/api/duplexes/batches' + '?' + this.exportAsCSV;
                };
                DuplexBatchesCtrl.prototype.getDuplexes = function () {
                    var _this = this;
                    this.loading = true;
                    this.duplexesService.getDuplexBatches(this.paginationOptions, this.sortOptions, this.searchOptions)
                        .then(function (data) {
                        _this.loading = false;
                        if (data) {
                            var items = _this.removeDuplicates(data);
                            //this.denormilize(items);
                            _this.gridOptions.data = items;
                            _this.gridOptions.totalItems = data.TotalItems;
                        }
                    });
                };
                DuplexBatchesCtrl.prototype.removeDuplicates = function (data) {
                    var columns = this.gridApi.grid.columns.filter(function (col) {
                        return col.colDef.visible;
                    });
                    var denormalizedColumns = [
                        "AntisenseStrandBatch.ArrowHeadBatchNumber", "AntisenseStrandBatch.Purity",
                        "AntisenseStrandBatch.Concentration", "AntisenseStrandBatch.RemainingVolume",
                        "SenseStrandBatch.ArrowHeadBatchNumber", "SenseStrandBatch.Purity",
                        "SenseStrandBatch.Concentration", "SenseStrandBatch.RemainingVolume"
                    ];
                    var containsDenormalizedColumns = !columns.some(function (col) {
                        return denormalizedColumns.some(function (dcol) {
                            return dcol === col.field;
                        });
                    });
                    if (containsDenormalizedColumns) {
                        var items_1 = [];
                        angular.forEach(data.ItemList, function (element) {
                            if (!items_1.some(function (item) {
                                return item.Id === element.Id;
                            })) {
                                items_1.push(element);
                            }
                        });
                        return items_1;
                    }
                    return data.ItemList;
                };
                DuplexBatchesCtrl.prototype.getFilteredData = function () {
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
                    this.getDuplexes();
                };
                DuplexBatchesCtrl.prototype.loadUserSettings = function () {
                    var _this = this;
                    return this.userSettingsService.getSettingsByKey("DuplexBatchSearchSettings")
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
                DuplexBatchesCtrl.prototype.saveUserSettings = function () {
                    this.userSettingsService.saveSettings('DuplexBatchSearchSettings', this.userSettings);
                };
                DuplexBatchesCtrl.prototype.denormilize = function (items) {
                    for (var i = 0; i < items.length; i++) {
                        var duplexBatch = items[i];
                        var strandBatch = duplexBatch.StrandBatch;
                        if (strandBatch.Orientation.Name === 'Sense') {
                            var senseStrandBatch = {
                                SSBatchNumber: strandBatch.ArrowHeadBatchNumber,
                                SSBatchPurity: strandBatch.Purity,
                                SSBatchConcentration: strandBatch.Concentration,
                                SSBatchRemainingVolume: strandBatch.RemainingVolume
                            };
                            angular.extend(duplexBatch, senseStrandBatch);
                        }
                        else if (strandBatch.Orientation.Name === 'Antisense') {
                            var antiSenseStrandBatch = {
                                ASBatchNumber: strandBatch.ArrowHeadBatchNumber,
                                ASBatchPurity: strandBatch.Purity,
                                ASBatchConcentration: strandBatch.Concentration,
                                ASBatchRemainingVolume: strandBatch.RemainingVolume
                            };
                            angular.extend(duplexBatch, antiSenseStrandBatch);
                        }
                    }
                };
                DuplexBatchesCtrl.$inject = ['$scope', '$window', '$timeout', '$location', 'duplexesService', 'userSettingsService'];
                return DuplexBatchesCtrl;
            }());
            App.getAppContainer()
                .getSection('app.duplexes')
                .getInstance()
                .controller('DuplexBatchesCtrl', DuplexBatchesCtrl);
        })(Controllers = Duplexes.Controllers || (Duplexes.Controllers = {}));
    })(Duplexes = App.Duplexes || (App.Duplexes = {}));
})(App || (App = {}));
//# sourceMappingURL=duplexBatchesCtrl.js.map