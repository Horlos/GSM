namespace App.Duplexes.Controllers {

	class DuplexBatchesCtrl {
		public searchOptions: App.Common.ISearchOptions;
		public paginationOptions: App.Common.IPaginationOptions;
		public sortOptions: App.Common.ISortOptions;
		public gridOptions: uiGrid.IGridOptions;
		public gridApi: uiGrid.IGridApi;
		public loading: boolean;

		public filterValue: string;
		public exportAsCSV: string;
		private userSettings: any;

		static $inject = ['$scope', '$window', '$timeout', '$location', 'duplexesService', 'userSettingsService'];
		constructor(
			private $scope,
			private $window: ng.IWindowService,
			private $timeout,
			private $location: ng.ILocationService,
			private duplexesService: App.Duplexes.Services.IDuplexesService,
			private userSettingsService: App.Services.IUserSettingsService) {

			this.initialize();
			this.initializeGrid();
			this.loadUserSettings().then(() => {
				this.getDuplexes();
			});
		}

		initialize(): void {
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
		}

		initializeGrid(): void {
			let sTemp = '<div ng-if="row.groupHeader" class="ui-grid-cell-contents">{{grid.getCellValue(row.treeNode.children[0].row, col) CUSTOM_FILTERS}}</div>';
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

				onRegisterApi: (gridApi: uiGrid.IGridApi) => {
					this.onRegisterApi(gridApi);
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
		}

		onRegisterApi(gridApi: uiGrid.IGridApi) {
			this.gridApi = gridApi;
			gridApi.core.on.sortChanged(this.$scope, (grid, sortColumn) => {
				this.sortChanged(grid, sortColumn);
			});
			gridApi.core.on.columnVisibilityChanged(this.$scope, (column) => {
				this.handleColumnVisibilityChanged(column);
			});
			gridApi.core.on.filterChanged(this.$scope, () => {
				this.filterChanged();
			});
			gridApi.colMovable.on.columnPositionChanged(this.$scope, (colDef, originalPosition, newPosition) => {
				this.handleColumnPositionChanged(colDef, originalPosition, newPosition);
			});
			gridApi.pagination.on.paginationChanged(this.$scope, (newPage, pageSize) => {
				this.paginationChanged(newPage, pageSize);
			});
			gridApi.selection.on.rowSelectionChanged(this.$scope, (row) => {
				this.rowSelectionChanged(row);
			});
		}

		paginationChanged(newPage, pageSize) {
			this.paginationOptions.pageNumber = newPage;
			this.paginationOptions.pageSize = pageSize;
			this.getDuplexes();

			this.userSettings.pageSize = pageSize;
			this.saveUserSettings();
		}

		rowSelectionChanged(row) {
			this.$window.location.pathname = '/Duplex/EditDuplexBatch/' + row.entity.Id;
		}

		filterChanged() {
			if (angular.isDefined(this.$scope.filterTimeout)) {
				this.$timeout.cancel(this.$scope.filterTimeout);
			}
			this.$scope.filterTimeout = this.$timeout(() => {
				this.getFilteredData();
			}, this.searchOptions.searchDelay);
		}

		handleColumnVisibilityChanged(column): void {
			let newColumnDisplayOrder = this.userSettings.columnDisplayOrder.slice();
			let columns = this.gridApi.grid.columns;
			let index = -1;
			if (column.visible) {
				index = columns.filter(function (col: any) { return col.visible; }).indexOf(column);
				newColumnDisplayOrder.splice(index, 0, column.field);
			} else {
				index = newColumnDisplayOrder.indexOf(column.field);
				newColumnDisplayOrder.splice(index, 1);
			}
			this.userSettings.columnDisplayOrder = newColumnDisplayOrder;
			this.saveUserSettings();
			this.getDuplexes();
		}

		handleColumnPositionChanged(colDef: uiGrid.IColumnDef, originalPosition, newPosition): void {
			var newColumnDisplayOrder = this.userSettings.columnDisplayOrder.slice();
			let index = newColumnDisplayOrder.indexOf(colDef.field);
			let oldCol = newColumnDisplayOrder.splice(index, 1);
			newColumnDisplayOrder.splice(newPosition, 0, oldCol[0]);
			this.userSettings.columnDisplayOrder = newColumnDisplayOrder;
			this.saveUserSettings();
		}

		sortChanged(grid, sortColumn): void {
			if (sortColumn.length > 0) {
				this.sortOptions.sortBy = sortColumn[0].field;
				this.sortOptions.sortOrder = sortColumn[0].sort.direction;
			} else {
				this.sortOptions.sortBy = '';
				this.sortOptions.sortOrder = 'none';
			}
			this.getDuplexes();
		}

		singleFilter(): void {
			if (angular.isDefined(this.$scope.filterTimeout)) {
				this.$timeout.cancel(this.$scope.filterTimeout);
			}
			this.$scope.filterTimeout = this.$timeout(
				() => {
					this.searchOptions.filterText = this.buildFilterQuery();
					this.getDuplexes();
				},
				this.searchOptions.searchDelay);
		}

		buildFilterQuery() {
			let filterValue = this.filterValue;
			let columns = this.gridApi.grid.columns;
			let filterText = "";
			angular.forEach(columns,
				(column: uiGrid.IColumnDef) => {
					if (column.visible) {
						filterText = filterText +
							column.field +
							"=" +
							filterValue +
							" or ";
					}
				});
			return filterText;
		}

		toggleFiltering(): void {
			this.gridOptions.enableFiltering = !this.gridOptions.enableFiltering;
			this.gridApi.core.notifyDataChange('column');
			this.searchOptions.advancedFiltering = !this.searchOptions.advancedFiltering;
			this.clearFilter();
		}

		clearFilter(): void {
			this.filterValue = "";
			this.searchOptions.filterText = "";
			$.each(this.gridApi.grid.columns,
				(index, column) => {
					if (column.filters.length > 0) {
						$.each(column.filters,
							(index: number, filter) => {
								filter.term = '';
							});
					}
				});
			this.getDuplexes();
		}

		getExportAsCsvLink(): string {
			this.exportAsCSV = 'filterText=' +
				this.searchOptions.filterText +
				'&sortBy=' +
				this.sortOptions.sortBy +
				'&sortOrder=' +
				this.sortOptions.sortOrder;
			return '/api/duplexes/batches' + '?' + this.exportAsCSV;
		}

		private getDuplexes() {
			this.loading = true;
			this.duplexesService.getDuplexBatches(this.paginationOptions, this.sortOptions, this.searchOptions)
				.then((data) => {
					this.loading = false;
					if (data) {
						var items: any[] = this.removeDuplicates(data);
						//this.denormilize(items);
						this.gridOptions.data = items;
						this.gridOptions.totalItems = data.TotalItems;
					}
				});
		}

		private removeDuplicates(data) {

			let columns = this.gridApi.grid.columns.filter((col: any) => {
				return col.colDef.visible;
			});

			var denormalizedColumns =
				[
					"AntisenseStrandBatch.ArrowHeadBatchNumber", "AntisenseStrandBatch.Purity",
					"AntisenseStrandBatch.Concentration", "AntisenseStrandBatch.RemainingVolume",
					"SenseStrandBatch.ArrowHeadBatchNumber", "SenseStrandBatch.Purity",
					"SenseStrandBatch.Concentration", "SenseStrandBatch.RemainingVolume"
				];

			let containsDenormalizedColumns = !columns.some((col) => {
				return denormalizedColumns.some((dcol) => {
					return dcol === col.field;
				});
			});
			if (containsDenormalizedColumns) {
				let items: any[] = [];
				angular.forEach(data.ItemList,
					(element) => {
						if (!items.some((item) => {
							return item.Id === element.Id;
						})) {
							items.push(element);
						}
					});
				return items;
			}

			return data.ItemList;
		}

		private getFilteredData(): void {
			this.searchOptions.filterText = "";
			$.each(this.gridApi.grid.columns,
				(index: number, column) => {
					if (column.filters[0].term != null) {
						this.searchOptions.filterText = this.searchOptions.filterText +
							column.field +
							"=" +
							column.filters[0].term +
							" and ";
					}
				});
			this.getDuplexes();
		}

		private loadUserSettings(): ng.IPromise<any> {
			return this.userSettingsService.getSettingsByKey("DuplexBatchSearchSettings")
				.then((data) => {
					var newColDefs = [];
					var currentLocations = [];
					var columnDefs = this.gridOptions.columnDefs;
					var columnDisplayOrder = data.columnDisplayOrder;
					var pageSize = data.pageSize || 50;
					this.gridOptions.paginationPageSize = pageSize;
					angular.forEach(columnDefs,
						(item) => {
							currentLocations.push(item.field);
						});

					angular.forEach(columnDisplayOrder,
						(columnName) => {
							let colDef = columnDefs[currentLocations.indexOf(columnName)];
							if (angular.isDefined(colDef)) {
								colDef.visible = true;
								newColDefs.push(colDef);
							}
						});

					if (newColDefs.length > 0) {
						angular.forEach(columnDefs,
							(item) => {
								if (newColDefs.indexOf(item) === -1) {
									item.visible = false;
									newColDefs.push(item);
								}
							});
						this.gridOptions.columnDefs = newColDefs;
					}
					this.userSettings = data;
				});
		}

		private saveUserSettings() {
			this.userSettingsService.saveSettings('DuplexBatchSearchSettings', this.userSettings);
		}

		private denormilize(items: any) {
			for (let i = 0; i < items.length; i++) {
				let duplexBatch = items[i];
				let strandBatch = duplexBatch.StrandBatch;
				if (strandBatch.Orientation.Name === 'Sense') {
					let senseStrandBatch = {
						SSBatchNumber: strandBatch.ArrowHeadBatchNumber,
						SSBatchPurity: strandBatch.Purity,
						SSBatchConcentration: strandBatch.Concentration,
						SSBatchRemainingVolume: strandBatch.RemainingVolume
					}
					angular.extend(duplexBatch, senseStrandBatch);
				} else if (strandBatch.Orientation.Name === 'Antisense') {
					let antiSenseStrandBatch = {
						ASBatchNumber: strandBatch.ArrowHeadBatchNumber,
						ASBatchPurity: strandBatch.Purity,
						ASBatchConcentration: strandBatch.Concentration,
						ASBatchRemainingVolume: strandBatch.RemainingVolume
					}
					angular.extend(duplexBatch, antiSenseStrandBatch);
				}
			}
		}
	}

	App.getAppContainer()
		.getSection('app.duplexes')
		.getInstance()
		.controller('DuplexBatchesCtrl', DuplexBatchesCtrl);
}