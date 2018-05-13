(function () {

	angular.module('synthesisRequestApp')
		.controller('IndexSynthesisRequestCtrl', IndexSynthesisRequestCtrl);

	IndexSynthesisRequestCtrl.$inject = [
		'$scope',
		'$location',
		'$routeParams',
		'$timeout',
		'$uibModal',
		'SynthesisRequestService',
		'userSettingsAPI'
	];

	function IndexSynthesisRequestCtrl($scope, $location, $routeParams, $timeout, $uibModal, SynthesisRequestService, userSettingsAPI) {

		var indexSynthesisRequest = this;
		indexSynthesisRequest.$location = $location;
		indexSynthesisRequest.userSettingsAPI = userSettingsAPI;
		indexSynthesisRequest.submitMessage = "";
		indexSynthesisRequest.timeout = $timeout;
		indexSynthesisRequest.exportAsCSV = "";
		indexSynthesisRequest.loading = false;
		indexSynthesisRequest.paginationOptions = {
			pageNumber: 1,
			pageSize: 50,
			sort: null
		};

		indexSynthesisRequest.sortOptions = {
			sortBy: "",
			sortOrder: ""
		};

		indexSynthesisRequest.searchDelay = 500;
		indexSynthesisRequest.filterText = '';

		//selected objects grid
		indexSynthesisRequest.availableSynthesisRequests = {
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

			//expandableRowTemplate: '<div ui-grid="row.entity.subGridOptions"></div>',
			onRegisterApi: function (gridApi) {

				indexSynthesisRequest.gridApi = gridApi;
				indexSynthesisRequest.gridApi.core.on.sortChanged(null, indexSynthesisRequest.sortChanged);
				indexSynthesisRequest.gridApi.core.on.columnVisibilityChanged(null, indexSynthesisRequest.handleColumnVisibilityChanged);
				indexSynthesisRequest.gridApi.colMovable.on.columnPositionChanged(null, indexSynthesisRequest.handleColumnPositionChanged);

				gridApi.pagination.on.paginationChanged(null,
					function (newPage, pageSize) {
						indexSynthesisRequest.paginationOptions.pageNumber = newPage;
						indexSynthesisRequest.paginationOptions.pageSize = pageSize;

						indexSynthesisRequest.loadSynthesisRequests();
						var userSettings = indexSynthesisRequest.userSettingsAPI.get({});
						userSettings.$promise.then(function (settings) {
							settings.synthesisrequestsearch.pageSize = pageSize;
							settings.$save();
						});
					});

				gridApi.selection.on.rowSelectionChanged(null, function (row) {
					window.location.pathname = '/SynthesisRequest/Details/' + row.entity.Id;
				});

				indexSynthesisRequest.gridApi.core.on.filterChanged(null, function () {

					if (angular.isDefined(indexSynthesisRequest.filterTimeout)) {
						indexSynthesisRequest.timeout.cancel(indexSynthesisRequest.filterTimeout);
					}
					indexSynthesisRequest.filterTimeout = indexSynthesisRequest.timeout(function () {
						indexSynthesisRequest.filterText = "";

						$.each(indexSynthesisRequest.gridApi.grid.columns, function () {
							var column = this;
							if (column.filters[0].term != null && column.filters[0].term != "") {
								if (column.colDef.type == 'date') {
									indexSynthesisRequest.filterText = indexSynthesisRequest.filterText + column.field + "=" + new moment(column.filters[0].term).format('MM-DD-YYYY') + " and ";
								} else {
									indexSynthesisRequest.filterText = indexSynthesisRequest.filterText + column.field + "=" + column.filters[0].term + " and ";
								}
							}
						});
						indexSynthesisRequest.loadSynthesisRequests();
					}, indexSynthesisRequest.searchDelay);
				});
			}
		};

		indexSynthesisRequest.availableSynthesisRequests.columnDefs = [
			{
				name: 'SynthesisRequestID',
				field: 'Id',
				displayName: 'Synthesis Request ID',
				visible: true
			},
			{
				name: 'RequestDate',
				field: 'RequestDate',
				displayName: 'Request Date',
				cellFilter: 'date:"MM-dd-yyyy\"',
				visible: true,
				type: 'date',
				filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><input type="date" ng-model="colFilter.term" style="font-size:12px" /></div>'
			},
			{
				name: 'Needed',
				field: 'Needed',
				displayName: 'Need By Date',
				cellFilter: 'date:"MM-dd-yyyy\"',
				visible: true,
				type: 'date',
				filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><input type="date" ng-model="colFilter.term" style="font-size:12px" /></div>'
			},
			{
				name: 'Status.Description',
				field: 'Status.Description',
				displayName: 'Status',
				visible: true
			},
			{
				name: 'RequestedBy',
				displayName: 'Requested By',
				field: 'RequestedBy',
				visible: false
			},
			{
				name: 'StrandId',
				displayName: 'Strand ID',
				field: 'StrandSynthesisRequest.Strand.ArrowheadStrandId',
				visible: false
			},
			{
				name: 'Target',
				displayName: 'Target',
				field: 'StrandSynthesisRequest.Strand.Target.Name',
				visible: false
			},
			{
				name: 'Scale',
				displayName: 'Scale',
				field: 'StrandSynthesisRequest.Scale',
				visible: false
			},
			{
				name: 'Notes',
				displayName: 'Notes',
				field: 'Notes',
				visible: false
			},
			{
				name: 'MaterialRequestID',
				displayName: 'Material Request ID',
				field: 'MaterialRequestId',
				visible: false
			}
		];

		indexSynthesisRequest.getFilterParams = getFilterParams;
		indexSynthesisRequest.toggleFiltering = toggleFiltering;
		indexSynthesisRequest.singleFilter = singleFilter;
		indexSynthesisRequest.loadSynthesisRequests = loadSynthesisRequests;
		indexSynthesisRequest.clearFilter = clearFilter;
		indexSynthesisRequest.sortChanged = sortChanged;
		indexSynthesisRequest.removeDuplicates = removeDuplicates;
		indexSynthesisRequest.buildFilterQuery = buildFilterQuery;
		indexSynthesisRequest.handleColumnVisibilityChanged = handleColumnVisibilityChanged;
		indexSynthesisRequest.handleColumnPositionChanged = handleColumnPositionChanged;


		loadUserSettings()
			.then(function () {
				getFilterParams();
			});

		function getFilterParams() {
			var paramValue = $location.search().search;
			if (paramValue) {
				indexSynthesisRequest.filterValue = paramValue;
				indexSynthesisRequest.singleFilter();
				indexSynthesisRequest.$location.search('search', null);
			} else {
				loadSynthesisRequests();
			}
		}

		function loadSynthesisRequests() {

			var SynthesisRequestData = {
				filterText: indexSynthesisRequest.filterText,
				pageNo: indexSynthesisRequest.paginationOptions.pageNumber,
				pageSize: indexSynthesisRequest.paginationOptions.pageSize,
				sortBy: indexSynthesisRequest.sortOptions.sortBy,
				sortOrder: indexSynthesisRequest.sortOptions.sortOrder,
				filterList: indexSynthesisRequest.filterList
			};

			indexSynthesisRequest.exportAsCSV = 'filterText=' + indexSynthesisRequest.filterText +
				'&sortBy=' + indexSynthesisRequest.sortOptions.sortBy +
				'&sortOrder=' + indexSynthesisRequest.sortOptions.sortOrder;
			indexSynthesisRequest.loading = true;
			indexSynthesisRequest.availableSynthesisRequests.data = [];
			SynthesisRequestService.getAll(SynthesisRequestData)
				.then(function (data) {
					indexSynthesisRequest.loading = false;
					if (data) {
						onLoadCompleted(data);
					}
				}, function (e) {
					indexSynthesisRequest.submitMessage = "Error: !" + e;
				});
		}


		function onLoadCompleted(data) {
			var items = indexSynthesisRequest.removeDuplicates(data);

			indexSynthesisRequest.availableSynthesisRequests.totalItems = data.TotalItems;
			indexSynthesisRequest.availableSynthesisRequests.data = items;

			//for (var i = 0; i < items.length; i++) {
			//    items[i].subGridOptions = {
			//        columnDefs: [
			//            { name: "StrandId", displayName: 'Strand ID', field: "StrandId" },
			//            { name: "Scale", displayName: 'Scale', field: "Scale" }
			//        ],
			//        data: items[i].SynthesisRequestStrands
			//    }
			//}
		}

		function removeDuplicates(data) {

			var columns = indexSynthesisRequest.gridApi.grid.columns.filter(function (col) {
				return col.colDef.visible;
			});

			var denormalizedColumns =
				[
					"StrandSynthesisRequest.StrandId", "StrandSynthesisRequest.Scale", "MaterialRequestId"
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
			var userSettings = indexSynthesisRequest.userSettingsAPI.get({})
				.$promise.then(function (settings) {
					var newColumnDisplayOrder = settings.synthesisrequestsearch.columnDisplayOrder.slice();
					var index = newColumnDisplayOrder.indexOf(colDef.field);
					var oldCol = newColumnDisplayOrder.splice(index, 1);
					newColumnDisplayOrder.splice(newPosition, 0, oldCol[0]);
					settings.synthesisrequestsearch.columnDisplayOrder = newColumnDisplayOrder;
					settings.$save();
				});
		};

		function handleColumnVisibilityChanged(column) {
			var userSettings = indexSynthesisRequest.userSettingsAPI.get({});
			userSettings.$promise.then(function (settings) {
				var newColumnDisplayOrder = settings.synthesisrequestsearch.columnDisplayOrder;
				var columns = indexSynthesisRequest.gridApi.grid.columns;
				if (column.visible) {
					var index = columns.filter(function (col) { return col.visible; }).indexOf(column);
					newColumnDisplayOrder.splice(index, 0, column.field);
				} else {
					var index = newColumnDisplayOrder.indexOf(column.field);
					newColumnDisplayOrder.splice(index, 1);
				}
				settings.synthesisrequestsearch.columnDisplayOrder = newColumnDisplayOrder;
				settings.$save();
			});
			indexSynthesisRequest.loadSynthesisRequests();
		};

		function sortChanged(grid, sortColumn) {
			if (sortColumn.length > 0) {
				indexSynthesisRequest.sortOptions.sortBy = sortColumn[0].field;
				indexSynthesisRequest.sortOptions.sortOrder = sortColumn[0].sort.direction;
			}
			else {
				indexSynthesisRequest.sortOptions.sortBy = null;
				indexSynthesisRequest.sortOptions.sortOrder = null;
			}
			indexSynthesisRequest.loadSynthesisRequests();
		};

		function singleFilter() {
			if (angular.isDefined(indexSynthesisRequest.filterTimeout)) {
				indexSynthesisRequest.timeout.cancel(indexSynthesisRequest.filterTimeout);
			}
			indexSynthesisRequest.filterTimeout = indexSynthesisRequest.timeout(angular.bind(this, function () {
				indexSynthesisRequest.filterText = indexSynthesisRequest.buildFilterQuery();
				indexSynthesisRequest.loadSynthesisRequests();
			}),
			indexSynthesisRequest.searchDelay);
		};

		function toggleFiltering() {
			indexSynthesisRequest.availableSynthesisRequests.enableFiltering = !indexSynthesisRequest.availableSynthesisRequests.enableFiltering;
			indexSynthesisRequest.gridApi.core.notifyDataChange('column');
			indexSynthesisRequest.advancedFiltering = !indexSynthesisRequest.advancedFiltering;
			indexSynthesisRequest.clearFilter();
		};

		function clearFilter() {
			indexSynthesisRequest.filterValue = "";
			indexSynthesisRequest.filterText = "";
			$.each(indexSynthesisRequest.gridApi.grid.columns, function () {
				var column = this;
				if (column.filters.length > 0) {
					$.each(column.filters, function () {
						var filter = this;
						filter.term = '';
					});
				}
			});
			indexSynthesisRequest.loadSynthesisRequests();
		};

		function buildFilterQuery() {
			var filterText = "";
			var columns = indexSynthesisRequest.gridApi.grid.columns;
			$.each(columns,
				function (index, column) {
					if (column.visible) {
						filterText = filterText +
							column.field +
							"=" +
							indexSynthesisRequest.filterValue +
							" or ";
					}
				});
			return filterText;
		}

		//user settings
		function loadUserSettings() {
			var userSettings = indexSynthesisRequest.userSettingsAPI.get({});
			return userSettings.$promise.then(angular.bind(this, function (data) {

				//
				// Re-order the columnDefs to match the saved preferences 
				//
				var newColDefs = [];
				var currentLocations = [];
				var pageSize = data.synthesisrequestsearch.pageSize || 50;
				indexSynthesisRequest.availableSynthesisRequests.paginationPageSize = pageSize;
				angular.forEach(indexSynthesisRequest.availableSynthesisRequests.columnDefs, function (item) {
					currentLocations.push(item.field);
				});
				angular.forEach(data.synthesisrequestsearch.columnDisplayOrder, angular.bind(this, function (columnName) {
					var colDef = indexSynthesisRequest.availableSynthesisRequests.columnDefs[currentLocations.indexOf(columnName)];
					if (angular.isDefined(colDef)) {
						colDef.visible = true;
						newColDefs.push(colDef);
					}
				}));

				if (newColDefs.length > 0) {
					angular.forEach(indexSynthesisRequest.availableSynthesisRequests.columnDefs,
						function (item) {
							if (newColDefs.indexOf(item) === -1) {
								item.visible = false;
								newColDefs.push(item);
							}
						});
					indexSynthesisRequest.availableSynthesisRequests.columnDefs = newColDefs;
				}
			}));
		};
	}
})();