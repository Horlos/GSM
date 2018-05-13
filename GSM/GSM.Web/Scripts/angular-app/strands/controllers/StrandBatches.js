var app = angular.module('listStrandBatchesApp', ['ngResource', 'ui.grid', 'ui.grid.moveColumns', 'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.grid.selection', 'ui.grid.autoFitColumns', 'userSettings']);
app.controller('ListStrandBatchesController', ['$scope', '$timeout', 'strandBatchesService', 'userSettingsAPI', ListStrandBatchesController]);
app.service('strandBatchesService', ['strandResource', StrandBatchesService]);

app.factory('strandResource', ['$resource', function (resource) {
	return resource('/api/strands/batches', null, {
		'query': { isArray: false }
	});
}]);

function StrandBatchesService(strandResource) {
	this.strandResource = strandResource;
	StrandBatchesService.prototype.GetStrandBatches = function (paginationOptions, sortOptions, filterText, onSuccess) {
		var proxy = strandResource.query({
			filterText: filterText,
			pageNo: paginationOptions.pageNumber,
			pageSize: paginationOptions.pageSize,
			sortBy: sortOptions.sortBy,
			sortOrder: sortOptions.sortOrder
		});
		proxy.$promise.then(angular.bind(this, function (data) {
			if (proxy.$resolved) {
				onSuccess(data);
			}
		}));
	}
};

function ListStrandBatchesController(scope, timeout, strandBatchesService, userSettingsAPI) {
	this.strandBatchesService = strandBatchesService;
	this.scope = scope;
	scope.timeout = timeout;
	scope.userSettingsAPI = userSettingsAPI;
	scope.paginationOptions = {
		pageNumber: 1,
		pageSize: 50,
		sort: null
	};
	scope.sortOptions = {
		sortBy: "",
		sortOrder: "none"
	};
	scope.loading = false;
	scope.searchDelay = 500;
	scope.filterText = '';
	this.scope.availableStrandBatches = {
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
		enableHorizontalScrollbar: true,
		noUnselect: true,
		onRegisterApi: function (gridApi) {
			scope.gridApi = gridApi;
			scope.gridApi.core.on.sortChanged(scope, scope.sortChanged);
			scope.gridApi.core.on.columnVisibilityChanged(scope, scope.handleColumnVisibilityChanged);
			scope.gridApi.colMovable.on.columnPositionChanged(scope, scope.handleColumnPositionChanged);
			gridApi.pagination.on.paginationChanged(scope,
				function (newPage, pageSize) {
					scope.paginationOptions.pageNumber = newPage;
					scope.paginationOptions.pageSize = pageSize;
					scope.getStrandBatches();
					var userSettings = scope.userSettingsAPI.get({});
					userSettings.$promise.then(function (settings) {
						settings.strandbatchsearch.pageSize = pageSize;
						settings.$save();
					});
				});
			gridApi.selection.on.rowSelectionChanged(scope,
				function (row) {
					window.location.pathname = '/Strand/EditStrandBatch/' + row.entity.Id;
				});
			scope.gridApi.core.on.filterChanged(scope,
				function () {
					if (angular.isDefined(scope.filterTimeout)) {
						scope.timeout.cancel(scope.filterTimeout);
					}
					scope.filterTimeout = scope.timeout(function () {
						scope.getFiltered();
					},
						scope.searchDelay);
				});
		}
	};
	this.scope.availableStrandBatches.columnDefs = [
		{
			name: 'ArrowHeadBatchNumber',
			field: 'ArrowHeadBatchNumber',
			displayName: 'Batch Number',
			visible: true
		},
		{
			name: 'InitiatedDate',
			field: 'InitiatedDate',
			visible: true,
			cellFilter: 'date:\'yyyy-MM-dd\''
		},
		{
			name: 'SynthesisScale',
			field: 'SynthesisScale',
			displayName: 'Synthesis Scale (μmol)',
			visible: true,
			cellFilter: 'number: 0'
		},
		{
			name: 'Purity',
			field: 'Purity',
			displayName: "% FLP",
			visible: true,
			cellFilter: 'number: 2'
		},
		{
			name: 'PreparedVolume',
			field: 'PreparedVolume',
			displayName: 'Prepared Volume (ul)',
			visible: false,
			cellFilter: 'number: 1'
		},
		{
			name: 'AmountPrepared',
			field: 'AmountPrepared',
			displayName: 'Amount Prepared (mg)',
			visible: false,
			cellFilter: 'number: 1'
		},
		{
			name: 'Sequence',
			field: 'Strand.Sequence',
			displayName: "Sequence",
			visible: true
		},
		{
			name: 'MW',
			field: 'Strand.MW',
			displayName: "MW",
			visible: true
		},
		{
			name: 'Target',
			field: 'Strand.Target.Name',
			displayName: "Target",
			visible: true
		},
		{
			name: 'RunId',
			field: 'RunId',
			displayName: 'RunID',
			visible: false
		},
		{
			name: 'Position',
			field: 'Position',
			visible: false
		},
		{
			name: 'Unavailable',
			displayName: 'Unavailable',
			field: 'Unavailable',
			visible: true,
			type: 'boolean',
			cellTemplate: '<input type="checkbox" ng-model="row.entity.Unavailable" disabled>'
		},
		{
			name: 'Concentration',
			displayName: 'Concentration (mg/ml)',
			field: 'Concentration',
			visible: false,
			cellFilter: 'number: 2'
		},
		{
			name: 'MiscVolumeUsed',
			displayName: 'Misc. Volume Used (ul)',
			field: 'MiscVolumeUsed',
			visible: false,
			cellFilter: 'number: 1'
		},
		{
			name: 'RemainingVolume',
			displayName: 'Remaining Volume (ul)',
			field: 'RemainingVolume',
			visible: false,
			cellFilter: 'number: 1'
		},
		{
			name: 'AmountRemaining',
			displayName: 'Amount Remaining (mg)',
			field: 'AmountRemaining',
			visible: false,
			cellFilter: 'number: 1'
		},
		{
			name: 'Strand.ArrowheadStrandId',
			field: 'Strand.ArrowheadStrandId',
			displayName: 'Strand ID',
			visible: false
		},
		{
			name: 'Notes',
			field: 'Notes',
			displayName: 'Notes',
			visible: false
		},
		{
			name: 'Strand.ExtinctionCoefficient',
			field: 'Strand.ExtinctionCoefficient',
			displayName: 'Ext. Coefficient',
			visible: false
		}
	];
	scope.getStrandBatches = angular.bind(this, this.getStrandBatches);
	scope.loadUserSettings = angular.bind(this, this.loadUserSettings);
	scope.sortChanged = angular.bind(this, this.sortChanged);
	scope.toggleFiltering = angular.bind(this, this.toggleFiltering);
	scope.singleFilter = angular.bind(this, this.singleFilter);
	scope.handleColumnVisibilityChanged = angular.bind(this, this.handleColumnVisibilityChanged);
	scope.handleColumnPositionChanged = angular.bind(this, this.handleColumnPositionChanged);
	scope.clearFilter = angular.bind(this, this.clearFilter);
	scope.buildFilterQuery = angular.bind(this, this.buildFilterQuery);
	scope.getFiltered = angular.bind(this, this.getFiltered);
	this.scope.loadUserSettings();
	this.scope.getStrandBatches();
}

ListStrandBatchesController.prototype.handleColumnVisibilityChanged = function (column) {
	var that = this;
	var userSettings = this.scope.userSettingsAPI.get({});
	userSettings.$promise.then(function (settings) {
		var newColumnDisplayOrder = settings.strandbatchsearch.columnDisplayOrder.slice();
		var columns = that.scope.gridApi.grid.columns;
		if (column.visible) {
			var index = columns.filter(function (col) { return col.visible; }).indexOf(column);
			newColumnDisplayOrder.splice(index, 0, column.field);
		} else {
			var index = newColumnDisplayOrder.indexOf(column.field);
			newColumnDisplayOrder.splice(index, 1);
		}
		settings.strandbatchsearch.columnDisplayOrder = newColumnDisplayOrder;
		settings.$save();
	});
}

ListStrandBatchesController.prototype.handleColumnPositionChanged = function (colDef, originalPosition, newPosition) {
	var userSettings = this.scope.userSettingsAPI.get({})
		.$promise.then(function (settings) {
			var newColumnDisplayOrder = settings.strandbatchsearch.columnDisplayOrder.slice();
			var index = newColumnDisplayOrder.indexOf(colDef.field);
			var oldCol = newColumnDisplayOrder.splice(index, 1);
			newColumnDisplayOrder.splice(newPosition, 0, oldCol[0]);
			settings.strandbatchsearch.columnDisplayOrder = newColumnDisplayOrder;
			settings.$save();
		});
};

ListStrandBatchesController.prototype.loadUserSettings = function () {
	var userSettings = this.scope.userSettingsAPI.get({});
	userSettings.$promise.then(angular.bind(this, function (data) {

		//
		// Re-order the columnDefs to match the saved preferences 
		//
		var newColDefs = [];
		var currentLocations = [];
		var pageSize = data.strandbatchsearch.pageSize || 50;
		this.scope.availableStrandBatches.paginationPageSize = pageSize;
		angular.forEach(this.scope.availableStrandBatches.columnDefs, function (item) {
			currentLocations.push(item.field);
		});
		angular.forEach(data.strandbatchsearch.columnDisplayOrder, angular.bind(this, function (columnName) {
			var colDef = this.scope.availableStrandBatches.columnDefs[currentLocations.indexOf(columnName)];
			if (colDef) {
				colDef.visible = true;
				newColDefs.push(colDef);
			}
		}));

		if (newColDefs.length > 0) {
			angular.forEach(this.scope.availableStrandBatches.columnDefs,
				function (item) {
					var index = newColDefs.indexOf(item);
					if (index === -1) {
						item.visible = false;
						newColDefs.push(item);
					}
				});
			this.scope.availableStrandBatches.columnDefs = newColDefs;
		}
	}));
};

ListStrandBatchesController.prototype.singleFilter = function () {
	if (angular.isDefined(this.scope.filterTimeout)) {
		this.scope.timeout.cancel(this.scope.filterTimeout);
	}
	this.scope.filterTimeout = this.scope.timeout(angular.bind(this, function () {
		this.scope.filterText = this.scope.buildFilterQuery();
		this.scope.getStrandBatches();
	}),
	this.scope.searchDelay);
};

ListStrandBatchesController.prototype.toggleFiltering = function () {
	this.scope.availableStrandBatches.enableFiltering = !this.scope.availableStrandBatches.enableFiltering;
	this.scope.gridApi.core.notifyDataChange('column');
	this.scope.advancedFiltering = !this.scope.advancedFiltering;
	this.scope.clearFilter();
};

ListStrandBatchesController.prototype.clearFilter = function () {
	this.scope.filterValue = "";
	this.scope.filterText = "";
	$.each(this.scope.gridApi.grid.columns, function () {
		var column = this;
		if (column.filters.length > 0) {
			$.each(column.filters, function () {
				var filter = this;
				filter.term = '';
			});
		}
	});
	this.scope.getStrandBatches();
};

ListStrandBatchesController.prototype.buildFilterQuery = function () {
	var _this = this;
	var filterText = "";
	var columns = this.scope.gridApi.grid.columns;
	$.each(columns,
		function (index, column) {
			if (column.visible) {
				filterText = filterText +
					column.field +
					"=" +
					_this.scope.filterValue +
					" or ";
			}
		});
	return filterText;
}

ListStrandBatchesController.prototype.getFiltered = function () {
	var _this = this;
	this.scope.filterText = "";
	$.each(this.scope.gridApi.grid.columns,
		function (index, column) {
			if (column.filters[0].term != null) {
				_this.scope.filterText = _this.scope.filterText +
					column.field +
					"=" +
					column.filters[0].term +
					" and ";
			}
		});
	this.scope.getStrandBatches();
}

ListStrandBatchesController.prototype.sortChanged = function (grid, sortColumn) {
	if (sortColumn.length > 0) {
		this.scope.sortOptions.sortBy = sortColumn[0].field;
		this.scope.sortOptions.sortOrder = sortColumn[0].sort.direction;
	}
	else {
		this.scope.sortOptions.sortBy = '';
		this.scope.sortOptions.sortOrder = 'none';
	}
	this.scope.getStrandBatches();
}

ListStrandBatchesController.prototype.getStrandBatches = function () {
	this.scope.loading = true;
	this.scope.exportAsCSV = 'filterText=' + this.scope.filterText + '&sortBy=' + this.scope.sortOptions.sortBy + '&sortOrder=' + this.scope.sortOptions.sortOrder;
	this.strandBatchesService.GetStrandBatches(this.scope.paginationOptions, this.scope.sortOptions, this.scope.filterText, angular.bind(this, function (data) {
		this.scope.loading = false;
		if (data) {
			this.scope.availableStrandBatches.totalItems = data.TotalItems;
			this.scope.availableStrandBatches.data = data.ItemList;
		}
	}));
}