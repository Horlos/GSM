var app = angular.module('multipleDuplexesApp', ['ngResource', 'ui.bootstrap.contextMenu', 'ui.bootstrap', 'ui.grid', 'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.grid.selection']);

app.factory('lookupResource', ['$resource', function (resource) {
    return resource('/api/lookup',
        {
            'table': ['Targets']
        }
    );
}]);

app.factory('strandResource', ['$resource', function (resource) {
    return resource('/api/strands/:orientation/:target', { orientation: '@orientation', target: '@target' }, {
        'query': { isArray: false }
    });
}]);

app.factory('validateDuplexResource', ['$resource', function (resource) {
    return resource('/api/duplexes/validate', null, {
        'query': { isArray: false }
    });
}]);

app.factory('duplexResource', ['$resource', function (resource) {
    return resource('/api/duplexes/multiple', null, {
        'save': { method: 'POST', isArray: true }
    });
}]);

var removeTemplate = '<input type="image" src="../../Content/Images/delete_icon.png" style="margin: 5px; width: 60%; height: 60%;" ng-click="grid.appScope.removeRow(row.entity)"/>';
var mergeItemTemplate = '<div title="{{row.entity.Errors.Duplex}}" ng-class="row.entity.HasErrors ? \'ui-grid-cell-contents-error\' : \'ui-grid-cell-contents\'">{{COL_FIELD}}</div>';

function MultipleDuplexesController(scope, window, uibModal, lookupResource, strandResource, validateDuplexResource, duplexResource) {
    this.scope = scope;
    this.window = window;
    this.uibModal = uibModal;
    this.validateDuplexResource = validateDuplexResource;
    this.duplexResource = duplexResource;
    this.lookupResource = lookupResource;
    this.strandResource = strandResource;
    scope.availableTargets = [];
    scope.selectedTarget = {};
    scope.selectedAntisenseStrands = [];
    scope.queuedMergedItems = [];
    scope.mergeResults = {
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        enableColumnMenus: false,
        enableHorizontalScrollbar: 0,
        multiSelect: false,
        columnDefs: [
            {
                name: 'SenseStrand.ArrowheadStrandId',
                displayName: 'SS',
                cellTemplate: mergeItemTemplate,
                field: "SenseStrand.ArrowheadStrandId"
            },
            {
                name: 'AntiSenseStrand.ArrowheadStrandId',
                displayName: 'AS',
                cellTemplate: mergeItemTemplate,
                field: "AntiSenseStrand.ArrowheadStrandId"
            },
            {
                name: 'Target.Name',
                displayName: 'Target',
                field: "Target.Name"
            },
            {
                displayName: '',
                name: 'Delete',
                cellTemplate: removeTemplate,
                width: 30,
                resizable: false
            }
        ]
    };
    scope.selectedSenseStrand = {};
    scope.selectedSenseStrands = {
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        enableColumnMenus: false,
        enableHorizontalScrollbar: 0,
        multiSelect: false,
        columnDefs: [
          {
              name: 'ArrowheadStrandId',
              displayName: 'Strand ID',
              field: 'ArrowheadStrandId'
          },
          {
              name: 'Target.Name',
              displayName: 'Target',
              field: 'Target.Name'
          }
        ],
        onRegisterApi: function (gridApi) {
            scope.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged(scope, function (row) {
                if (row.isSelected) {
                    scope.selectedSenseStrand = row.entity;
                } else {
                    scope.selectedSenseStrand = {};
                }
            });
        }
    };
    scope.selectedAntisenseStrand = {};
    scope.selectedAntisenseStrands = {
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        enableColumnMenus: false,
        enableHorizontalScrollbar: 0,
        multiSelect: false,
        columnDefs: [
          {
              name: 'ArrowheadStrandID',
              displayName: 'Strand ID',
              field: 'ArrowheadStrandId'
          },
          {
              name: 'Target.Name',
              displayName: 'Target',
              field: 'Target.Name'
          }
        ],
        onRegisterApi: function (gridApi) {
            scope.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged(scope, function (row) {
                if (row.isSelected) {
                    scope.selectedAntisenseStrand = row.entity;
                } else {
                    scope.selectedAntisenseStrand = {};
                }
            });
        }
    };
    scope.addSenseStrandModal = angular.bind(this, this.addSenseStrandModal);
    scope.addAntisenseStrandModal = angular.bind(this, this.addAntisenseStrandModal);
    scope.removeSelectedSenseStrand = angular.bind(this, this.removeSelectedSenseStrand);
    scope.removeSelectedAntisenseStrand = angular.bind(this, this.removeSelectedAntisenseStrand);
    scope.queueMergeedItems = angular.bind(this, this.queueMergeedItems);
    scope.verifyMerge = angular.bind(this, this.verifyMerge);
    scope.onVerifyMergeCompleted = angular.bind(this, this.onVerifyMergeCompleted);
    scope.removeRow = angular.bind(this, this.removeRow);
    scope.permitImport = angular.bind(this, this.permitImport);
    scope.importMergedItems = angular.bind(this, this.importMergedItems);
    scope.onImportMergedItemsCompleted = angular.bind(this, this.onImportMergedItemsCompleted);

    this.loadLookupData();
}

MultipleDuplexesController.prototype.removeRow = function (entity) {
    var index = this.scope.mergeResults.data.indexOf(entity);
    this.scope.mergeResults.data.splice(index, 1);
};

MultipleDuplexesController.prototype.loadLookupData = function () {
    var proxy = this.lookupResource.get({});
    proxy.$promise.then(angular.bind(this, this.onLoadLookupCompleted));
}

MultipleDuplexesController.prototype.onLoadLookupCompleted = function (data) {
    this.scope.availableTargets = data.Targets;
}

MultipleDuplexesController.prototype.removeSelectedSenseStrand = function () {
    FindAndRemove(this.scope.selectedSenseStrands.data, this.scope.selectedSenseStrand);
    this.scope.selectedSenseStrand = {};
}

MultipleDuplexesController.prototype.removeSelectedAntisenseStrand = function () {
    FindAndRemove(this.scope.selectedAntisenseStrands.data, this.scope.selectedAntisenseStrand);
    this.scope.selectedAntisenseStrand = {};
}

MultipleDuplexesController.prototype.queueMergeedItems = function () {
    for (var j = 0; j < this.scope.selectedSenseStrands.data.length; j++) {
        for (var i = 0; i < this.scope.selectedAntisenseStrands.data.length; i++) {
            this.scope.queuedMergedItems.push({
                Target: this.scope.selectedTarget,
                SenseStrand: this.scope.selectedSenseStrands.data[j],
                AntiSenseStrand: this.scope.selectedAntisenseStrands.data[i],
            });
        }
    }
    this.scope.queuedMergedItems.reverse();
    this.scope.mergeResults.data = [];
    this.scope.verifyMerge();
}

MultipleDuplexesController.prototype.verifyMerge = function () {
    if (this.scope.queuedMergedItems.length > 0) {
        var target = this.scope.queuedMergedItems.pop();
        var proxy = this.validateDuplexResource.save(target);
        proxy.$promise.then(angular.bind(this, this.onVerifyMergeCompleted));
    }
}

MultipleDuplexesController.prototype.onVerifyMergeCompleted = function (verifiedItem) {
    this.scope.mergeResults.data.push(verifiedItem);
    this.scope.verifyMerge();
}

MultipleDuplexesController.prototype.importMergedItems = function () {
    var proxy = this.duplexResource.save(this.scope.mergeResults.data);
    proxy.$promise.then(angular.bind(this, this.onImportMergedItemsCompleted));
};

MultipleDuplexesController.prototype.onImportMergedItemsCompleted = function (data) {
    this.window.location.href = '/Duplex';
};

MultipleDuplexesController.prototype.permitImport = function () {
    if (this.scope.mergeResults.data.length == 0) return false;
    for (var i = 0; i < this.scope.mergeResults.data.length; i++) {
        if (this.scope.mergeResults.data[i].HasErrors) {
            return false;
        }
    }
    return true;
}

MultipleDuplexesController.prototype.addSenseStrandModal = function () {
 var _this = this;
    var settings = {
        templateUrl: '/Scripts/angular-app/widgets/selectModalTemplate.html',
        controller: 'SelectModalCtrl',
        controllerAs: "vm",
        size: 'lg',
        resolve: {
            selectModalConfig: function () {
                return {
                    gridOptions: {
                        multiSelect: true,
                        columnDefs: [
                            {
                                name: 'ArrowheadStrandID',
                                displayName: 'Strand ID',
                                field: 'ArrowheadStrandId'
                            },
                            {
                                name: 'Target.Name',
                                displayName: 'Target',
                                field: 'Target.Name'
                            },
                            {
                                name: 'MW',
                                field: 'MW'
                            }
                        ]
                    },
                    prompt: 'Select sense strands'
                }
            },
            searchResource: function() {
                return {
                    getData: function(query) {
                        query.target = _this.scope.selectedTarget.Id;
                        query.orientation = 'Sense';
                        return _this.strandResource.get(query).$promise;
                    }
                }

            }
        }
    };
    var modalInstance = this.uibModal.open(settings);
    modalInstance.result.then(angular.bind(this, function (result) {
        if (result != 'cancel') {
            this.scope.selectedSenseStrands.data = result;
        };
    }), function () { });
};

MultipleDuplexesController.prototype.addAntisenseStrandModal = function () {
    var _this = this;
    var settings = {
        templateUrl: '/Scripts/angular-app/widgets/selectModalTemplate.html',
        controller: 'SelectModalCtrl',
        controllerAs: "vm",
        size: 'lg',
        resolve: {
            selectModalConfig: function() {
                return {
                    gridOptions: {
                        multiSelect: true,
                        columnDefs: [
                            {
                                name: 'ArrowheadStrandID',
                                displayName: 'Strand ID',
                                field: 'ArrowheadStrandId'
                            },
                            {
                                name: 'Target.Name',
                                displayName: 'Target',
                                field: 'Target.Name'
                            },
                            {
                                name: 'MW',
                                field: 'MW'
                            }
                        ]
                    },
                    prompt: 'Select antisense strands'
                }
            },
            searchResource: function () {
                return {
                    getData: function (query) {
                        query.target = _this.scope.selectedTarget.Id;
                        query.orientation = 'Antisense';
                        return _this.strandResource.get(query).$promise;
                    }
                }

            }
        }
    };
    var modalInstance = this.uibModal.open(settings);
    modalInstance.result.then(angular.bind(this, function (result) {
        if (result != 'cancel') {
            this.scope.selectedAntisenseStrands.data = result;
        };
    }), function () { });
};

app.controller('SelectModalCtrl', App.Widgets.SelectModalCtrl);
app.controller('multipleDuplexesController', ['$scope', '$window', '$uibModal', 'lookupResource','strandResource', 'validateDuplexResource', 'duplexResource', MultipleDuplexesController]);