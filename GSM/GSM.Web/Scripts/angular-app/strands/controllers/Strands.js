var app = angular.module('listStrandsApp',
[
	'ngResource', 'ui.grid', 'ui.grid.moveColumns', 'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.grid.selection', 'ui.grid.autoFitColumns',
	'userSettings'
]);

app.factory('strandResource', ['$resource', function (resource) {
	return resource('/api/strands', null, {
		'query': { isArray: false }
	});
}]);

function StrandService(strandResource) {
	this.strandResource = strandResource;
	StrandService.prototype.GetStrands = function (paginationOptions, sortOptions, filterText, onSuccess) {
		var proxy = this.strandResource.query({
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

function ListStrandsController(scope, timeout, $location, strandSvc, userSettingsAPI) {
	this.strandSvc = strandSvc;
	this.scope = scope;
	this.$location = $location;
	scope.userSettingsAPI = userSettingsAPI;
	scope.timeout = timeout;
	scope.paginationOptions = {
		pageNumber: 1,
		pageSize: 50,
		sort: null
	};
	scope.sortOptions = {
		sortBy: "",
		sortOrder: "none"
	};
	scope.searchDelay = 500;
	scope.filterText = '';
	scope.availableStrands = {
		paginationPageSizes: [50, 100, 500],
		enableGridMenu: true,
		enableColumnMenus: false,
		useExternalSorting: true,
		useExternalPagination: true,
		useExternalFiltering: true,
		enableRowSelection: true,
		enableRowHeaderSelection: false,
		enableHorizontalScrollbar: true,
		enableColumnResizing: true,
		multiSelect: false,
		modifierKeysToMultiSelect: false,
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
					scope.GetStrands();
					var userSettings = scope.userSettingsAPI.get({});
					userSettings.$promise.then(function (settings) {
						settings.strandsearch.pageSize = pageSize;
						settings.$save();
					});
				});
			gridApi.selection.on.rowSelectionChanged(scope, function (row) {
				window.location.pathname = '/Strand/Edit/' + row.entity.Id;
			});
			scope.gridApi.core.on.filterChanged(scope,
				function () {
					if (angular.isDefined(scope.filterTimeout)) {
						scope.timeout.cancel(scope.filterTimeout);
					}
					scope.filterTimeout = scope.timeout(function () {
						scope.filterText = "";
						$.each(scope.gridApi.grid.columns,
							function () {
								var column = this;
								if (column.filters[0].term != null) {
									scope.filterText = scope.filterText +
										column.field +
										"=" +
										column.filters[0].term +
										" and ";
								}
							});
						scope.GetStrands();
					},
						scope.searchDelay);
				});
		}
	};
	scope.loading = false;
	scope.availableStrands.columnDefs = [
		{ name: 'ArrowheadStrandID', field: 'ArrowheadStrandId', displayName: 'Strand ID', visible: true },
		{ name: 'GenomeNumber', field: 'GenomeNumber', visible: true },
		{ name: 'GenomePosition', field: 'GenomePosition', visible: true },
		{ name: 'Sequence', field: 'Sequence', visible: true },
		{ name: 'BaseSequence', field: 'BaseSequence', visible: true },
		{ name: 'MW', field: 'MW', visible: true },
		{ name: 'ExtinctionCoefficient', field: 'ExtinctionCoefficient', visible: true },
		{ name: 'ColumnIdentity', field: 'ColumnIdentity', visible: true },
		{ name: 'Target.Name', field: 'Target.Name', displayName: 'Target', visible: true },
		{ name: 'Orientation.Name', field: 'Orientation.Name', displayName: 'Orientation', visible: true }
	];

	scope.getFilterParams = angular.bind(this, this.getFilterParams);
	scope.GetStrands = angular.bind(this, this.GetStrands);
	scope.getExportAsCsvLink = angular.bind(this, this.getExportAsCsvLink);
	scope.loadUserSettings = angular.bind(this, this.loadUserSettings);
	scope.sortChanged = angular.bind(this, this.sortChanged);
	scope.toggleFiltering = angular.bind(this, this.toggleFiltering);
	scope.singleFilter = angular.bind(this, this.singleFilter);
	scope.handleColumnVisibilityChanged = angular.bind(this, this.handleColumnVisibilityChanged);
	scope.handleColumnPositionChanged = angular.bind(this, this.handleColumnPositionChanged);
	scope.clearFilter = angular.bind(this, this.clearFilter);
	scope.buildFilterQuery = angular.bind(this, this.buildFilterQuery);
	this.scope.loadUserSettings()
		.then(function () {
			scope.getFilterParams();
		});

}

ListStrandsController.prototype.getFilterParams = function () {
	var paramValue = this.$location.search().search;
	if (paramValue) {
		this.scope.filterText = this.scope.filterValue = paramValue;
		this.scope.singleFilter();
		this.$location.search('search', null);
	} else {
		this.scope.GetStrands();
	}
}

ListStrandsController.prototype.handleColumnVisibilityChanged = function (column) {
	var that = this;
	var userSettings = this.scope.userSettingsAPI.get({});
	userSettings.$promise.then(function (settings) {
		var newColumnDisplayOrder = settings.strandsearch.columnDisplayOrder.slice();
		var columns = that.scope.gridApi.grid.columns;
		if (column.visible) {
			var index = columns.filter(function (col) { return col.visible; }).indexOf(column);
			newColumnDisplayOrder.splice(index, 0, column.field);
		} else {
			var index = newColumnDisplayOrder.indexOf(column.field);
			newColumnDisplayOrder.splice(index, 1);
		}
		settings.strandsearch.columnDisplayOrder = newColumnDisplayOrder;
		settings.$save();
	});
}

ListStrandsController.prototype.handleColumnPositionChanged = function (colDef, originalPosition, newPosition) {
	var userSettings = this.scope.userSettingsAPI.get({})
		.$promise.then(function (settings) {
			var newColumnDisplayOrder = settings.strandsearch.columnDisplayOrder.slice();
			var index = newColumnDisplayOrder.indexOf(colDef.field);
			var oldCol = newColumnDisplayOrder.splice(index, 1);
			newColumnDisplayOrder.splice(newPosition, 0, oldCol[0]);
			settings.strandsearch.columnDisplayOrder = newColumnDisplayOrder;
			settings.$save();
		});
};

ListStrandsController.prototype.sortChanged = function (grid, sortColumn) {
	if (sortColumn.length > 0) {
		this.scope.sortOptions.sortBy = sortColumn[0].field;
		this.scope.sortOptions.sortOrder = sortColumn[0].sort.direction;
	}
	else {
		this.scope.sortOptions.sortBy = '';
		this.scope.sortOptions.sortOrder = 'none';
	}
	this.scope.GetStrands();
}

ListStrandsController.prototype.GetStrands = function () {
	this.scope.loading = true;
	this.strandSvc.GetStrands(this.scope.paginationOptions, this.scope.sortOptions, this.scope.filterText, angular.bind(this, function (data) {
		this.scope.loading = false;
		if (data) {
			this.scope.availableStrands.totalItems = data.TotalItems;
			this.scope.availableStrands.data = data.ItemList;
		}
	}));
}

ListStrandsController.prototype.getExportAsCsvLink = function () {
	this.scope.exportAsCSV = 'filterText=' +
		this.scope.filterText +
		'&sortBy=' +
		this.scope.sortOptions.sortBy +
		'&sortOrder=' +
		this.scope.sortOptions.sortOrder;
	return '/api/strands?' + this.scope.exportAsCSV;
}

ListStrandsController.prototype.singleFilter = function () {
	if (angular.isDefined(this.scope.filterTimeout)) {
		this.scope.timeout.cancel(this.scope.filterTimeout);
	}
	this.scope.filterTimeout = this.scope.timeout(angular.bind(this, function () {
		this.scope.filterText = this.scope.buildFilterQuery();
		this.scope.GetStrands();
	}),
	this.scope.searchDelay);
};

ListStrandsController.prototype.toggleFiltering = function () {
	this.scope.availableStrands.enableFiltering = !this.scope.availableStrands.enableFiltering;
	this.scope.gridApi.core.notifyDataChange('column');
	this.scope.advancedFiltering = !this.scope.advancedFiltering;
	this.scope.clearFilter();
};

ListStrandsController.prototype.clearFilter = function () {
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
	this.scope.GetStrands();
};

ListStrandsController.prototype.buildFilterQuery = function () {
	var filterValue = this.scope.filterValue;
	var columns = this.scope.gridApi.grid.columns;
	var filterText = "";
	$.each(columns,
		function () {
			var column = this;
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

ListStrandsController.prototype.loadUserSettings = function () {
	var userSettings = this.scope.userSettingsAPI.get({});
	return userSettings.$promise.then(angular.bind(this, function (data) {

		//
		// Re-order the columnDefs to match the saved preferences 
		//
		var newColDefs = [];
		var currentLocations = [];
		var pageSize = data.strandsearch.pageSize || 50;
		this.scope.availableStrands.paginationPageSize = pageSize;
		angular.forEach(this.scope.availableStrands.columnDefs, function (item) {
			currentLocations.push(item.field);
		});
		angular.forEach(data.strandsearch.columnDisplayOrder, angular.bind(this, function (columnName) {
			var colDef = this.scope.availableStrands.columnDefs[currentLocations.indexOf(columnName)];
			if (angular.isDefined(colDef)) {
				colDef.visible = true;
				newColDefs.push(colDef);
			}
		}));

		if (newColDefs.length > 0) {
			angular.forEach(this.scope.availableStrands.columnDefs,
				function (item) {
					if (newColDefs.indexOf(item) == -1) {
						item.visible = false;
						newColDefs.push(item);
					}
				});
			this.scope.availableStrands.columnDefs = newColDefs;
		}
	}));
};

app.service('strandService', ['strandResource', StrandService]);
app.controller('listStrandsController', ['$scope', '$timeout', '$location', 'strandService', 'userSettingsAPI', ListStrandsController]);