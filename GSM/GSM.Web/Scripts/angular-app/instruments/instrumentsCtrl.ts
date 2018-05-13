namespace App.Instruments.Controllers {

	interface IInstrumentsScope extends ng.IScope {
		filterTimeout: ng.IPromise<void>;
	}

	class InstrumentsCtrl {
		public searchOptions: App.Common.ISearchOptions;
		public paginationOptions: App.Common.IPaginationOptions;
		public sortOptions: App.Common.ISortOptions;
		public gridOptions: uiGrid.IGridOptions;
		public gridApi: uiGrid.IGridApi;
		public loading: boolean;

		public filterValue: string;
		public exportAsCSV: string;
		private userSettings: any;

		static $inject = ['$scope', '$timeout', '$location', 'instrumentsService', 'userSettingsService'];
		constructor(
			private $scope: IInstrumentsScope,
			private $timeout: ng.ITimeoutService,
			private $location: ng.ILocationService,
			private instrumentsService: App.Instruments.Services.IInstrumentsService,
			private userSettingsService: App.Services.IUserSettingsService) {
			this.initialize();
			this.initializeGrid();
			this.loadUserSettings();
			this.getInstruments();
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
				onRegisterApi: (gridApi: uiGrid.IGridApi) => {
					this.onRegisterApi(gridApi);
				},
				columnDefs: [
					{ name: 'Name', field: 'Name', visible: true },
					{ name: 'MaxAmidites', field: 'MaxAmidites', visible: true },
					{ name: 'IsActive', field: 'IsActive', visible: true }
				]
			};
		}

		onRegisterApi(gridApi: uiGrid.IGridApi): void {
			this.gridApi = gridApi;
			gridApi.core.on.sortChanged(this.$scope,
				(gridApi, sortColumn) => {
					this.sortChanged(gridApi, sortColumn);
				});
			gridApi.core.on.columnVisibilityChanged(this.$scope,
				(column) => {
					this.handleColumnVisibilityChanged(column);
				});
			gridApi.core.on.filterChanged(this.$scope,
				() => {
					this.filterChanged();
				});
			gridApi.colMovable.on.columnPositionChanged(this.$scope,
				(colDef, originalPosition, newPosition) => {
					this.handleColumnPositionChanged(colDef, originalPosition, newPosition);
				});
			gridApi.pagination.on.paginationChanged(this.$scope,
				(newPage, pageSize) => {
					this.paginationChanged(newPage, pageSize);
				});
			gridApi.selection.on.rowSelectionChanged(this.$scope,
				(row) => {
					this.rowSelectionChanged(row);
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
			this.getInstruments();
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
		}

		filterChanged(): void {
			if (angular.isDefined(this.$scope.filterTimeout)) {
				this.$timeout.cancel(this.$scope.filterTimeout);
			}
			this.$scope.filterTimeout = this.$timeout(() => {
				this.getFilteredInstruments();
			}, this.searchOptions.searchDelay);
		}

		handleColumnPositionChanged(colDef, originalPosition, newPosition): void {
			var newColumnDisplayOrder = this.userSettings.columnDisplayOrder.slice();
			let index = newColumnDisplayOrder.indexOf(colDef.field);
			let oldCol = newColumnDisplayOrder.splice(index, 1);
			newColumnDisplayOrder.splice(newPosition, 0, oldCol[0]);
			this.userSettings.columnDisplayOrder = newColumnDisplayOrder;
			this.saveUserSettings();
		}

		paginationChanged(newPage, pageSize): void {
			this.paginationOptions.pageNumber = newPage;
			this.paginationOptions.pageSize = pageSize;
			this.getInstruments();

			this.userSettings.pageSize = pageSize;
			this.saveUserSettings();
		}

		rowSelectionChanged(row): void {
			window.location.pathname = '/Instrument/Edit/' + row.entity.Id;
		}

		singleFilter(): void {
			if (angular.isDefined(this.$scope.filterTimeout)) {
				this.$timeout.cancel(this.$scope.filterTimeout);
			}
			this.$scope.filterTimeout = this.$timeout(
				() => {
					this.searchOptions.filterText = this.buildFilterQuery();
					this.getInstruments();
				},
				this.searchOptions.searchDelay);
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
				(index: number, column: uiGrid.IGridColumn) => {
					if (column.filters.length > 0) {
						$.each(column.filters,
							(index: number, filter) => {
								filter.term = '';
							});
					}
				});
			this.getInstruments();
		}

		getInstruments(): void {
			this.loading = true;
			this.instrumentsService.getInstruments(this.paginationOptions, this.sortOptions, this.searchOptions)
				.then((data) => {
					this.loading = false;
					if (data) {
						this.gridOptions.totalItems = data.TotalItems;
						this.gridOptions.data = data.ItemList;
					}
				});
		}

		getFilteredInstruments(): void {
			this.searchOptions.filterText = "";
			$.each(this.gridApi.grid.columns,
				(index, column) => {
					if (column.filters[0].term != null) {
						this.searchOptions.filterText = this.searchOptions.filterText +
							column.field +
							"=" +
							column.filters[0].term +
							" and ";
					}
				});
			this.getInstruments();
		}

		getExportAsCsvLink(): string {
			this.exportAsCSV = 'filterText=' +
				this.searchOptions.filterText +
				'&sortBy=' +
				this.sortOptions.sortBy +
				'&sortOrder=' +
				this.sortOptions.sortOrder;
			return '/api/instruments?' + this.exportAsCSV;
		}

		buildFilterQuery(): string {
			let filterText = "";
			let columns = this.gridApi.grid.columns;
			angular.forEach(columns, (column: uiGrid.IColumnDef) => {
				if (column.visible) {
					filterText = filterText +
						column.field +
						"=" +
						this.filterValue +
						" or ";
				}
			});
			return filterText;
		}

		loadUserSettings(): void {
			this.userSettingsService.getSettingsByKey("InstrumentSearchSettings")
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

		saveUserSettings() {
			this.userSettingsService.saveSettings('InstrumentSearchSettings', this.userSettings);
		}
	}
	App.getAppContainer()
		.getSection("app.instruments")
		.getInstance()
		.controller("InstrumentsCtrl", InstrumentsCtrl);
}