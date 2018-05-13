var app = angular.module('listDuplexesApp',
[
	'ngResource', 'ui.grid', 'ui.grid.moveColumns', 'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.grid.selection',
	'userSettings'
]);

app.factory('duplexResource', ['$resource', function (resource) {
	return resource('/api/duplexes', null, {
		'query': { isArray: false }
	});
}]);

function DuplexService(duplexResource) {
	this.duplexResource = duplexResource;
	DuplexService.prototype.GetDuplexes = function (paginationOptions, sortOptions, filterText, onSuccess) {
		var proxy = this.duplexResource.query({
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

function ListDuplexesController(scope, timeout, $location, duplexSvc, userSettingsAPI) {
	this.duplexSvc = duplexSvc;
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
	scope.loading = false;
	scope.searchDelay = 500;
	scope.filterText = '';
	scope.availableDuplexes = {
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
			scope.gridApi = gridApi;
			scope.gridApi.core.on.sortChanged(scope, scope.sortChanged);
			scope.gridApi.core.on.columnVisibilityChanged(scope, scope.handleColumnVisibilityChanged);
			scope.gridApi.colMovable.on.columnPositionChanged(scope, scope.handleColumnPositionChanged);
			gridApi.pagination.on.paginationChanged(scope,
				function (newPage, pageSize) {
					scope.paginationOptions.pageNumber = newPage;
					scope.GetDuplexes();

					var userSettings = scope.userSettingsAPI.get({});
					userSettings.$promise.then(function (settings) {
						settings.duplexsearch.pageSize = pageSize;
						settings.$save();
					});
				});
			gridApi.selection.on.rowSelectionChanged(scope, function (row) {
				window.location.pathname = '/Duplex/Edit/' + row.entity.Id;
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
						scope.GetDuplexes();
					},
						scope.searchDelay);
				});
		}
	};
	scope.availableDuplexes.columnDefs = [
		{
			name: 'ArrowheadDuplexId',
			field: 'ArrowheadDuplexId',
			displayName: 'Duplex ID',
			visible: true
		},
		{
			name: 'Target',
			field: 'Target.Name',
			displayName: "Target",
			visible: true
		},
		{
			name: 'SenseStrandId',
			field: 'SenseStrand.ArrowheadStrandId',
			displayName: "Sense Strand ID",
			visible: true
		},
		{
			name: 'AntisenseStrandID',
			field: 'AntiSenseStrand.ArrowheadStrandId',
			displayName: "Antisense Strand ID",
			visible: true
		},
		{
			name: 'MW',
			field: 'MW',
			visible: true
		}

	];

	scope.getFilterParams = angular.bind(this, this.getFilterParams);
	scope.GetDuplexes = angular.bind(this, this.GetDuplexes);
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

ListDuplexesController.prototype.getFilterParams = function () {
	var paramValue = this.$location.search().search;
	if (paramValue) {
		this.scope.filterText = this.scope.filterValue = paramValue;
		this.scope.singleFilter();
		this.$location.search('search', null);
	} else {
		this.scope.GetDuplexes();
	}
}

ListDuplexesController.prototype.handleColumnVisibilityChanged = function (column) {
	var that = this;
	var userSettings = this.scope.userSettingsAPI.get({});
	userSettings.$promise.then(function (settings) {
		var newColumnDisplayOrder = settings.duplexsearch.columnDisplayOrder.slice();
		var columns = that.scope.gridApi.grid.columns;
		if (column.visible) {
			var index = columns.filter(function (col) { return col.visible; }).indexOf(column);
			newColumnDisplayOrder.splice(index, 0, column.field);
		} else {
			var index = newColumnDisplayOrder.indexOf(column.field);
			newColumnDisplayOrder.splice(index, 1);
		}
		settings.duplexsearch.columnDisplayOrder = newColumnDisplayOrder;
		settings.$save();
	});
}

ListDuplexesController.prototype.handleColumnPositionChanged = function (colDef, originalPosition, newPosition) {
	var userSettings = this.scope.userSettingsAPI.get({})
		.$promise
		.then(function (settings) {
			var newColumnDisplayOrder = settings.duplexsearch.columnDisplayOrder.slice();
			var index = newColumnDisplayOrder.indexOf(colDef.field);
			var oldCol = newColumnDisplayOrder.splice(index, 1);
			newColumnDisplayOrder.splice(newPosition, 0, oldCol[0]);
			settings.duplexsearch.columnDisplayOrder = newColumnDisplayOrder;
			settings.$save();
		});
};

ListDuplexesController.prototype.sortChanged = function (grid, sortColumn) {
	if (sortColumn.length > 0) {
		this.scope.sortOptions.sortBy = sortColumn[0].field;
		this.scope.sortOptions.sortOrder = sortColumn[0].sort.direction;
	}
	else {
		this.scope.sortOptions.sortBy = '';
		this.scope.sortOptions.sortOrder = 'none';
	}
	this.scope.GetDuplexes();
}

ListDuplexesController.prototype.GetDuplexes = function () {
	this.scope.loading = true;
	this.duplexSvc.GetDuplexes(this.scope.paginationOptions, this.scope.sortOptions, this.scope.filterText, angular.bind(this, function (data) {
		this.scope.loading = false;
		if (data) {
			this.scope.availableDuplexes.totalItems = data.TotalItems;
			this.scope.availableDuplexes.data = data.ItemList;
		}
	}));
}

ListDuplexesController.prototype.getExportAsCsvLink = function () {
	this.scope.exportAsCSV = 'filterText=' +
		this.scope.filterText +
		'&sortBy=' +
		this.scope.sortOptions.sortBy +
		'&sortOrder=' +
		this.scope.sortOptions.sortOrder;
	return '/api/duplexes?' + this.scope.exportAsCSV;
}


ListDuplexesController.prototype.singleFilter = function () {
	if (angular.isDefined(this.scope.filterTimeout)) {
		this.scope.timeout.cancel(this.scope.filterTimeout);
	}
	this.scope.filterTimeout = this.scope.timeout(angular.bind(this, function () {
		this.scope.filterText = this.scope.buildFilterQuery();
		this.scope.GetDuplexes();
	}),
	this.scope.searchDelay);
};

ListDuplexesController.prototype.buildFilterQuery = function () {
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

ListDuplexesController.prototype.toggleFiltering = function () {
	this.scope.availableDuplexes.enableFiltering = !this.scope.availableDuplexes.enableFiltering;
	this.scope.gridApi.core.notifyDataChange('column');
	this.scope.advancedFiltering = !this.scope.advancedFiltering;
	this.scope.clearFilter();
};

ListDuplexesController.prototype.clearFilter = function () {
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
	this.scope.GetDuplexes();
};

ListDuplexesController.prototype.loadUserSettings = function () {
	var userSettings = this.scope.userSettingsAPI.get({});
	return userSettings.$promise.then(angular.bind(this, function (data) {

		//
		// Re-order the columnDefs to match the saved preferences 
		//
		var newColDefs = [];
		var currentLocations = [];
		var pageSize = data.duplexsearch.pageSize || 50;
		this.scope.availableDuplexes.paginationPageSize = pageSize;
		angular.forEach(this.scope.availableDuplexes.columnDefs, function (item) {
			currentLocations.push(item.field);
		});
		angular.forEach(data.duplexsearch.columnDisplayOrder, angular.bind(this, function (columnName) {
			var colDef = this.scope.availableDuplexes.columnDefs[currentLocations.indexOf(columnName)];
			if (colDef) {
				colDef.visible = true;
				newColDefs.push(colDef);
			}
		}));

		if (newColDefs.length > 0) {
			angular.forEach(this.scope.availableDuplexes.columnDefs,
				function (item) {
					var index = newColDefs.indexOf(item);
					if (index === -1) {
						item.visible = false;
						newColDefs.push(item);
					}
				});
			this.scope.availableDuplexes.columnDefs = newColDefs;
		}
	}));
};

app.service('duplexService', ['duplexResource', DuplexService]);
app.controller('listDuplexesController', ['$scope', '$timeout', '$location', 'duplexService', 'userSettingsAPI', ListDuplexesController]);