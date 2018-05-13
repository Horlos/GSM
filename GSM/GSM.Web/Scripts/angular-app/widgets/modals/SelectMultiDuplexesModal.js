function SelectItemController(scope, timeout, uibModalInstance, searchResource, columnDefs, collectionName, prompt, multiSelect, orientation, target) {
    this.scope = scope;
    this.uibModalInstance = uibModalInstance;
    this.searchResource = searchResource;
    this.orientation = orientation;
    this.target = target;
    scope.timeout = timeout;
    scope.multiSelect = multiSelect;
    scope.paginationOptions = {
        pageNumber: 1,
        pageSize: 10,
        sort: null
    };
    scope.sortOptions = {
        sortBy: "",
        sortOrder: "none"
    };
    scope.searchDelay = 500;
    scope.filterText = '';
    scope.prompt = prompt;
    scope.collectionName = collectionName;
    scope.availableItems = {
    	paginationPageSizes: [50, 100, 500],
        enableColumnMenus: false,
        useExternalSorting: true,
        useExternalPagination: true,
        useExternalFiltering: true,

        enableRowSelection: true,
        enableRowHeaderSelection: true,
        enableFullRowSelection: false,
        enableSelectAll: true,

        multiSelect: multiSelect,
        onRegisterApi: function (gridApi) {
            scope.gridApi = gridApi;
            scope.gridApi.core.on.sortChanged(scope, scope.sortChanged);
            gridApi.pagination.on.paginationChanged(scope, function (newPage, pageSize) {
                scope.paginationOptions.pageNumber = newPage;
                scope.paginationOptions.pageSize = pageSize;
                scope.GetItems();
            });
            scope.gridApi.core.on.filterChanged(scope, function () {
                if (angular.isDefined(scope.filterTimeout)) {
                    scope.timeout.cancel(scope.filterTimeout);
                }
                scope.filterTimeout = scope.timeout(function () {
                    scope.filterText = "";
                    $.each(scope.gridApi.grid.columns, function () {
                        var column = this;
                        if (column.filters[0].term != null) {
                            scope.filterText = scope.filterText + column.field + "=" + column.filters[0].term + ":";
                        }
                    });
                    scope.GetItems();
                }, scope.searchDelay);
            });
        }
    };
    scope.availableItems.columnDefs = columnDefs;
    scope.ok = function () {
        if (this.multiSelect) {
            uibModalInstance.close(this.gridApi.selection.getSelectedRows());
        } else {
            uibModalInstance.close(this.gridApi.selection.getSelectedRows()[0]);
        }
    };
    scope.cancel = function () {
        uibModalInstance.close('cancel');
    };
    scope.GetItems = angular.bind(this, this.GetItems);
    scope.onGetItemsCompleted = angular.bind(this, this.onGetItemsCompleted);
    scope.sortChanged = angular.bind(this, this.sortChanged);
    scope.toggleFiltering = angular.bind(this, this.toggleFiltering);
    scope.isOkEnabled = angular.bind(this, this.isOkEnabled);
    scope.clearFilter = angular.bind(this, this.clearFilter);
    scope.singleFilter = angular.bind(this, this.singleFilter);
    this.scope.GetItems();
};

SelectItemController.prototype.isOkEnabled = function () {
    return true;
}


SelectItemController.prototype.GetItems = function () {
    var proxy = this.searchResource.query({
        orientation: this.orientation,
        target: this.target,
        filterText: this.scope.filterText,
        pageNo: this.scope.paginationOptions.pageNumber,
        pageSize: this.scope.paginationOptions.pageSize,
        sortBy: this.scope.sortOptions.sortBy,
        sortOrder: this.scope.sortOptions.sortOrder
    });
    proxy.$promise.then(angular.bind(this, this.onGetItemsCompleted));
}

SelectItemController.prototype.onGetItemsCompleted = function (data) {
    this.scope.availableItems.totalItems = data.TotalItems;
    this.scope.availableItems.data = data[this.scope.collectionName];
}

SelectItemController.prototype.sortChanged = function (grid, sortColumn) {
    if (sortColumn.length > 0) {
        this.scope.sortOptions.sortBy = sortColumn[0].field;
        this.scope.sortOptions.sortOrder = sortColumn[0].sort.direction;
    }
    else {
        this.scope.sortOptions.sortBy = '';
        this.scope.sortOptions.sortOrder = 'none';
    }
    this.scope.GetItems();
}

SelectItemController.prototype.toggleFiltering = function () {
    this.scope.availableItems.enableFiltering = !this.scope.availableItems.enableFiltering;
    this.scope.gridApi.core.notifyDataChange('column');
    this.scope.advancedFiltering = !this.scope.advancedFiltering;
    this.scope.clearFilter();
};

SelectItemController.prototype.clearFilter = function () {
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
    this.scope.GetItems();
};

SelectItemController.prototype.singleFilter = function () {
    if (angular.isDefined(this.scope.filterTimeout)) {
        this.scope.timeout.cancel(this.scope.filterTimeout);
    }
    this.scope.filterTimeout = this.scope.timeout(angular.bind(this, function () {
        this.scope.filterText = this.scope.filterValue;
        this.scope.GetItems();
    }),
    this.scope.searchDelay);
};