(function () {

	angular.module('materialRequestApp')
		.controller('IndexMaterialRequestCtrl', IndexMaterialRequestCtrl);

	IndexMaterialRequestCtrl.$inject = [
		'$scope',
		'$location',
		'$routeParams',
		'$timeout',
		'$uibModal',
		'MaterialRequestService',
		'userSettingsAPI'
	];

	function IndexMaterialRequestCtrl($scope, $location, $routeParams, $timeout, $uibModal, MaterialRequestService, userSettingsAPI) {

		var indexMaterialRequest = this;
		indexMaterialRequest.$location = $location;
		indexMaterialRequest.userSettingsAPI = userSettingsAPI;
		indexMaterialRequest.submitMessage = "";
		indexMaterialRequest.timeout = $timeout;
		indexMaterialRequest.exportAsCSV = "";
		indexMaterialRequest.loading = false;
		indexMaterialRequest.paginationOptions = {
			pageNumber: 1,
			pageSize: 50,
			sort: null
		};

		indexMaterialRequest.sortOptions = {
			sortBy: "",
			sortOrder: ""
		};

		indexMaterialRequest.searchDelay = 500;
		indexMaterialRequest.filterText = '';

		//selected objects grid
		indexMaterialRequest.availableMaterialRequets = {
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
			onRegisterApi: function (gridApi) {

				indexMaterialRequest.gridApi = gridApi;
				indexMaterialRequest.gridApi.core.on.sortChanged(null, indexMaterialRequest.sortChanged);
				indexMaterialRequest.gridApi.core.on.columnVisibilityChanged(null, indexMaterialRequest.handleColumnVisibilityChanged);
				indexMaterialRequest.gridApi.colMovable.on.columnPositionChanged(null, indexMaterialRequest.handleColumnPositionChanged);

				gridApi.pagination.on.paginationChanged(null,
					function (newPage, pageSize) {
						indexMaterialRequest.paginationOptions.pageNumber = newPage;
						indexMaterialRequest.paginationOptions.pageSize = pageSize;

						indexMaterialRequest.loadMaterialRequests();
						var userSettings = indexMaterialRequest.userSettingsAPI.get({});
						userSettings.$promise.then(function (settings) {
							settings.materialrequestsearch.pageSize = pageSize;
							settings.$save();
						});
					});

				gridApi.selection.on.rowSelectionChanged(null, function (row) {
					window.location.pathname = '/MaterialRequest/Details/' + row.entity.Id;
				});

				indexMaterialRequest.gridApi.core.on.filterChanged(null, function () {

					if (angular.isDefined(indexMaterialRequest.filterTimeout)) {
						indexMaterialRequest.timeout.cancel(indexMaterialRequest.filterTimeout);
					}
					indexMaterialRequest.filterTimeout = indexMaterialRequest.timeout(function () {
						indexMaterialRequest.filterText = "";

						$.each(indexMaterialRequest.gridApi.grid.columns, function () {
							var column = this;
							if (column.filters[0].term != null && column.filters[0].term != "") {
								if (column.colDef.type == 'date') {
									indexMaterialRequest.filterText = indexMaterialRequest.filterText + column.field + "=" + new moment(column.filters[0].term).format('MM-DD-YYYY') + " and ";
								} else {
									indexMaterialRequest.filterText = indexMaterialRequest.filterText + column.field + "=" + column.filters[0].term + " and ";
								}
							}
						});
						indexMaterialRequest.loadMaterialRequests();
					}, indexMaterialRequest.searchDelay);
				});
			}
		};

		indexMaterialRequest.availableMaterialRequets.columnDefs = [
			{
				name: 'MaterialRequestID',
				field: 'Id',
				displayName: 'Material Request ID',
				visible: true

			},
			{
				name: 'RequestDate',
				field: 'RequestDate',
				displayName: 'Request Date',
				cellFilter: 'date:"MM-dd-yyyy\"',
				visible: true,
				type: 'date',
				filterHeaderTemplate:
					'<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><input type="date" ng-model="colFilter.term" style="font-size:12px" /></div>',
			},
			{
				name: 'NeedByDate',
				field: 'NeedByDate',
				displayName: 'Need By Date',
				cellFilter: 'date:"MM-dd-yyyy\"',
				visible: true,
				type: 'date',
				filterHeaderTemplate:
					'<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><input type="date" ng-model="colFilter.term" style="font-size:12px" /></div>',
			},
			{
				name: 'Status.Description',
				field: 'Status.Description',
				displayName: 'Status',
				visible: true
			},
			{
				name: 'DuplexID',
				field: 'DuplexMaterialRequest.Duplex.ArrowheadDuplexId',
				displayName: 'Duplex ID',
				visible: true
			},
			{
				name: 'AmountRequested',
				field: 'DuplexMaterialRequest.AmountRequested',
				displayName: 'Amount Requested (mg)',
				visible: true
			},
			{
				name: 'Target',
				field: 'DuplexMaterialRequest.Duplex.Target.Name',
				displayName: 'Target',
				visible: true
			},
			{
				name: 'Notes',
				field: 'Notes',
				displayName: 'Notes',
				visible: true
			}
		];


		indexMaterialRequest.getFilterParams = getFilterParams;
		indexMaterialRequest.toggleFiltering = toggleFiltering;
		indexMaterialRequest.singleFilter = singleFilter;
		indexMaterialRequest.buildFilterQuery = buildFilterQuery;
		indexMaterialRequest.loadMaterialRequests = loadMaterialRequests;
		indexMaterialRequest.clearFilter = clearFilter;
		indexMaterialRequest.removeDuplicates = removeDuplicates;
		indexMaterialRequest.sortChanged = sortChanged;
		indexMaterialRequest.handleColumnVisibilityChanged = handleColumnVisibilityChanged;
		indexMaterialRequest.handleColumnPositionChanged = handleColumnPositionChanged;


		loadUserSettings()
			.then(function () {
				getFilterParams();
			});


		function loadMaterialRequests() {

			var materialRequestData = {
				filterText: indexMaterialRequest.filterText,
				pageNo: indexMaterialRequest.paginationOptions.pageNumber,
				pageSize: indexMaterialRequest.paginationOptions.pageSize,
				sortBy: indexMaterialRequest.sortOptions.sortBy,
				sortOrder: indexMaterialRequest.sortOptions.sortOrder,
				filterList: indexMaterialRequest.filterList
			};

			indexMaterialRequest.exportAsCSV = 'filterText=' +
				indexMaterialRequest.filterText +
				'&sortBy=' +
				indexMaterialRequest.sortOptions.sortBy +
				'&sortOrder=' +
				indexMaterialRequest.sortOptions.sortOrder;
			indexMaterialRequest.loading = true;
			MaterialRequestService.getAll(materialRequestData)
				.then(function (data) {
					indexMaterialRequest.loading = false;
					if (data) {
						onLoadCompleted(data);
					}
				},
					function (e) {
						indexMaterialRequest.submitMessage = "Error: !" + e;
					});
		}

		function getFilterParams() {
			var paramValue = $location.search().search;
			if (paramValue) {
				indexMaterialRequest.filterValue = paramValue;
				indexMaterialRequest.singleFilter();
				indexMaterialRequest.$location.search('search', null);
			} else {
				loadMaterialRequests();
			}
		}

		function onLoadCompleted(data) {
			var items = indexMaterialRequest.removeDuplicates(data);

			indexMaterialRequest.availableMaterialRequets.totalItems = data.TotalItems;
			indexMaterialRequest.availableMaterialRequets.data = items;
		}

		function removeDuplicates(data) {

			var columns = indexMaterialRequest.gridApi.grid.columns.filter(function (col) {
				return col.colDef.visible;
			});

			var denormalizedColumns =
				[
					"DuplexMaterialRequest.Duplex.ArrowheadDuplexId",
					"DuplexMaterialRequest.AmountRequested",
					"DuplexMaterialRequest.Duplex.Target.Name"
				];

			var containsDenormalizedColumns = !columns.some(function (col) {
				return denormalizedColumns.some(function (dcol) {
					return dcol === col.field;
				});
			});
			if (containsDenormalizedColumns) {
				var items = [];
				angular.forEach(data.ItemList,
					function (element) {
						if (!items.some(function (item) {
							return item.Id === element.Id;
						})) {
							items.push(element);
						}
					});
				return items;
			}

			return data.ItemList;
		}

		function handleColumnPositionChanged(colDef, originalPosition, newPosition) {
			var userSettings = indexMaterialRequest.userSettingsAPI.get({})
				.$promise
				.then(function (settings) {
					var newColumnDisplayOrder = settings.materialrequestsearch.columnDisplayOrder.slice();
					var index = newColumnDisplayOrder.indexOf(colDef.field);
					var oldCol = newColumnDisplayOrder.splice(index, 1);
					newColumnDisplayOrder.splice(newPosition, 0, oldCol[0]);
					settings.materialrequestsearch.columnDisplayOrder = newColumnDisplayOrder;
					settings.$save();
				});
		};

		function handleColumnVisibilityChanged(column) {
			var userSettings = indexMaterialRequest.userSettingsAPI.get({});
			userSettings.$promise.then(function (settings) {
				var newColumnDisplayOrder = settings.materialrequestsearch.columnDisplayOrder.slice();
				var columns = indexMaterialRequest.gridApi.grid.columns;
				if (column.visible) {
					var index = columns.filter(function (col) { return col.visible; }).indexOf(column);
					newColumnDisplayOrder.splice(index, 0, column.field);
				} else {
					var index = newColumnDisplayOrder.indexOf(column.field);
					newColumnDisplayOrder.splice(index, 1);
				}
				settings.materialrequestsearch.columnDisplayOrder = newColumnDisplayOrder;
				settings.$save();
			});
		}

		function sortChanged(grid, sortColumn) {
			if (sortColumn.length > 0) {
				indexMaterialRequest.sortOptions.sortBy = sortColumn[0].field;
				indexMaterialRequest.sortOptions.sortOrder = sortColumn[0].sort.direction;
			}
			else {
				indexMaterialRequest.sortOptions.sortBy = null;
				indexMaterialRequest.sortOptions.sortOrder = null;
			}
			indexMaterialRequest.loadMaterialRequests();
		}

		function singleFilter() {
			if (angular.isDefined(indexMaterialRequest.filterTimeout)) {
				indexMaterialRequest.timeout.cancel(indexMaterialRequest.filterTimeout);
			}
			indexMaterialRequest.filterTimeout = indexMaterialRequest.timeout(angular.bind(this, function () {
				indexMaterialRequest.filterText = indexMaterialRequest.buildFilterQuery();
				indexMaterialRequest.loadMaterialRequests();
			}),
			indexMaterialRequest.searchDelay);
		};

		function buildFilterQuery() {
			var filterText = "";
			var columns = indexMaterialRequest.gridApi.grid.columns;
			$.each(columns,
				function (index, column) {
					if (column.visible) {
						filterText = filterText +
							column.field +
							"=" +
							indexMaterialRequest.filterValue +
							" or ";
					}
				});
			return filterText;
		}

		function toggleFiltering() {
			indexMaterialRequest.availableMaterialRequets.enableFiltering = !indexMaterialRequest.availableMaterialRequets.enableFiltering;
			indexMaterialRequest.gridApi.core.notifyDataChange('column');
			indexMaterialRequest.advancedFiltering = !indexMaterialRequest.advancedFiltering
			indexMaterialRequest.clearFilter();
		};

		function clearFilter() {
			indexMaterialRequest.filterValue = "";
			indexMaterialRequest.filterText = "";
			$.each(indexMaterialRequest.gridApi.grid.columns, function () {
				var column = this;
				if (column.filters.length > 0) {
					$.each(column.filters, function () {
						var filter = this;
						filter.term = '';
					});
				}
			});
			indexMaterialRequest.loadMaterialRequests();
		};

		//user settings
		function loadUserSettings() {
			var userSettings = indexMaterialRequest.userSettingsAPI.get({});
			return userSettings.$promise.then(angular.bind(this, function (data) {

				//
				// Re-order the columnDefs to match the saved preferences 
				//
				var newColDefs = [];
				var currentLocations = [];
				var pageSize = data.materialrequestsearch.pageSize || 50;
				indexMaterialRequest.availableMaterialRequets.paginationPageSize = pageSize;
				angular.forEach(indexMaterialRequest.availableMaterialRequets.columnDefs, function (item) {
					currentLocations.push(item.field);
				});
				angular.forEach(data.materialrequestsearch.columnDisplayOrder, angular.bind(this, function (columnName) {
					var colDef = indexMaterialRequest.availableMaterialRequets.columnDefs[currentLocations.indexOf(columnName)];
					colDef.visible = true;
					newColDefs.push(colDef);
				}));

				if (newColDefs.length > 0) {
					angular.forEach(indexMaterialRequest.availableMaterialRequets.columnDefs,
						function (item) {
							if (newColDefs.indexOf(item) == -1) {
								item.visible = false;
								newColDefs.push(item);
							}
						});
					indexMaterialRequest.availableMaterialRequets.columnDefs = newColDefs;
				}
			}));
		};
	}

})();