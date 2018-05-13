var app = angular.module('createDuplexApp', ['ngResource', 'ui.bootstrap', 'ui.grid', 'ui.grid.moveColumns', 'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.grid.selection'
]);

app.factory('lookupResource', ['$resource', function (resource) {
    return resource('/api/lookup',
        {
            'table': ['Targets']
        }
    );
}]);

app.factory('strandResource', ['$resource', function (resource) {
    return resource('/api/strands/:targetId/target', { targetID: '@TargetId' }, { 'query': { isArray: false } });
}]);


app.factory('strandGridResource', ['$resource', function (resource) {
    //return resource('/api/strands/:targetId/target', { targetID: '@TargetId' }, { 'query': { isArray: false } });
    return resource('/api/strandsGrid', null, {
        'query': { isArray: false }
    });
}]);




app.factory('duplexResource', ['$resource', function (resource) {
    return resource('/api/duplexes', null, {
        'query': { isArray: false }
    });
}]);

app.controller('SelectModalCtrl', App.Widgets.SelectModalCtrl);
app.controller('createDuplexController', CreateDuplexController);

CreateDuplexController.$inject = [
    '$scope', '$window', 'lookupResource', 'duplexResource', 'strandResource', 'strandGridResource', '$uibModal'
];

function CreateDuplexController($scope, window, lookupResource, duplexResource, strandResource, strandGridResource, $uibModal) {

    var createDuplex = this;

    this.lookupResource = lookupResource;
    this.duplexResource = duplexResource;
    this.strandResource = strandResource;

    this.scope = $scope;
    createDuplex.window = window;
    createDuplex.MvcController = MvcController(this.window.location.pathname);
    createDuplex.$uibModal = $uibModal;

    createDuplex.strandGridResource = strandGridResource;
    createDuplex.availableTargets = [];
    createDuplex.duplex = {
        Target: null,
        SenseStrand: null,
        AntiSenseStrand: null,
        Error: {}
    };

    function LoadStrands() {

        createDuplex.duplex.SenseStrand = null;
        createDuplex.duplex.AntiSenseStrand = null;
        createDuplex.duplex.Error = null;

        //var proxy = this.strandResource.query({ targetId: this.scope.duplex.Target.TargetId });
        //proxy.$promise.then(angular.bind(this, this.onLoadStrandsCompleted));  
    }

    function onLoadStrandsCompleted(data) {
        //this.scope.availableSenseStrands = data.SenseStrands;
        //this.scope.availableAntisenseStrands = data.AntisenseStrands;
    }

    function saveDuplex() {
        var proxy = this.duplexResource.save(createDuplex.duplex);
        proxy.$promise.then(angular.bind(this, onSaveCompleted));
    }

    function resetForm() {

        createDuplex.duplex = {
            Target: {},
            SenseStrand: {},
            AntiSenseStrand: {},
            Error: {}
        };
    }

    function onSaveCompleted(newDuplex) {
        if (newDuplex.HasErrors) {
            createDuplex.duplex.Error = newDuplex.Errors;
        } else {
            //this.window.location.href('/' + this.MvcController + '/Edit/' + newDuplex.DuplexId);
            //this.window.location.href('/' + this.MvcController);
            window.location.pathname = '/' + this.MvcController;

        }
    }

    function cancelChanges() {
        //this.window.location.href('/' + this.MvcController);
        window.location.pathname = '/' + this.MvcController;
    }

    function loadLookupData() {
        var proxy = this.lookupResource.get({});
        proxy.$promise.then(onLoadLookupCompleted);
    }

    function onLoadLookupCompleted(data) {
        createDuplex.availableTargets = data.Targets;
    }

    function permitSave() {
        return this.scope.createDuplexForm.$dirty &&
            createDuplex.duplex.Target != null &&
            createDuplex.duplex.SenseStrand != null &&
            createDuplex.duplex.AntiSenseStrand != null;
    }

    function selectStrand(orientation) {
        var _this = this;
        if (createDuplex.duplex.Target != null) {
            var promt = orientation === "Sense" ? 'Select Sense Strand' : 'Select Antisense Strand';
            var settings = {
                templateUrl: '/Scripts/angular-app/widgets/selectModalTemplate.html',
                controller: 'SelectModalCtrl',
                controllerAs: "vm",
                size: 'lg',
                resolve: {
                    selectModalConfig: function () {
                        return {
                            gridOptions: {
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
                                        field: "Target.Name"
                                    },
                                    {
                                        name: 'Orientation.Name',
                                        displayName: 'Orientation',
                                        field: "Orientation.Name"
                                    }
                                ]
                            },
                            collectionName: 'ItemList',
                            prompt: promt
                        }
                    },
                    searchResource: function () {
                        return {
                            getData: function (query) {
                                query.target = _this.duplex.Target.Id;
                                query.orientation = orientation;
                                return _this.strandGridResource.get(query).$promise;
                            }
                        }

                    }
                }
            };
            var modalInstance = angular.bind(this, createDuplex.$uibModal.open(settings));
            modalInstance.result.then(angular.bind(this, function (result) {
                if (result !== 'cancel') {
                    //if there are selected records

                    if (result != null) {
                        if (orientation === "Sense") {
                            createDuplex.duplex.SenseStrand = result;
                        } else {
                            createDuplex.duplex.AntiSenseStrand = result;
                        }
                    }

                };
            }), function () { });
        }
    }

    createDuplex.cancelChanges = cancelChanges;
    createDuplex.resetForm = resetForm;

    createDuplex.availableSenseStrands = [];
    createDuplex.availableAntisenseStrands = [];
    createDuplex.selectedSenseStrands = null;

    createDuplex.saveDuplex = saveDuplex;
    createDuplex.permitSave = permitSave;
    createDuplex.selectStrand = selectStrand;
    createDuplex.loadLookupData = loadLookupData;

    //scope.LoadStrands = angular.bind(this, this.LoadStrands);
    //scope.onLoadStrandsCompleted = angular.bind(this, this.onLoadStrandsCompleted);
    createDuplex.loadLookupData();

}
