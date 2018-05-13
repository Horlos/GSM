var App;
(function (App) {
    var Duplexes;
    (function (Duplexes) {
        var Controllers;
        (function (Controllers) {
            var CreateDuplexBatchCtrl = (function () {
                function CreateDuplexBatchCtrl($scope, $window, $uibModal, duplexesService) {
                    this.$scope = $scope;
                    this.$window = $window;
                    this.$uibModal = $uibModal;
                    this.duplexesService = duplexesService;
                    this.isFormSubmitted = false;
                    this.isDatePickerOpened = false;
                    this.duplexBatch = {
                        PreparedDate: new Date(),
                        Duplex: {},
                        SenseStrandBatches: [],
                        AntiSenseStrandBatches: []
                    };
                }
                CreateDuplexBatchCtrl.prototype.permitSave = function () {
                    if (this.$scope.form.$valid &&
                        this.isDuplexSelected() &&
                        this.isAntiSenseStrandBatchSelected() &&
                        this.isSenseStrandBatchSelected()) {
                        return true;
                    }
                    return false;
                };
                CreateDuplexBatchCtrl.prototype.onSubmit = function () {
                    this.isFormSubmitted = true;
                };
                CreateDuplexBatchCtrl.prototype.submitForm = function () {
                    if (this.permitSave()) {
                        this.createDuplexBatch();
                    }
                };
                CreateDuplexBatchCtrl.prototype.createDuplexBatch = function () {
                    var _this = this;
                    var duplexId = this.duplexBatch.DuplexId;
                    var strandBatches = [];
                    for (var i = 0; i < this.duplexBatch.SenseStrandBatches.length; i++) {
                        strandBatches.push(this.duplexBatch.SenseStrandBatches[i]);
                    }
                    for (var i = 0; i < this.duplexBatch.AntiSenseStrandBatches.length; i++) {
                        strandBatches.push(this.duplexBatch.AntiSenseStrandBatches[i]);
                    }
                    this.duplexBatch.StrandBatches = strandBatches;
                    this.duplexesService.createDuplexBatch(duplexId, this.duplexBatch)
                        .then(function (response) {
                        _this.duplexBatch.Error = response.Errors;
                        _this.$scope.form.$setPristine();
                        if (!response.HasErrors) {
                            _this.$window.location.href = "/Duplex/EditDuplexBatch/" + response.Id;
                        }
                    });
                };
                CreateDuplexBatchCtrl.prototype.cancelChanges = function () {
                    this.$window.location.href = '/Duplex/Batches';
                };
                CreateDuplexBatchCtrl.prototype.isDuplexSelected = function () {
                    if (this.duplexBatch.DuplexId)
                        return true;
                    return false;
                };
                CreateDuplexBatchCtrl.prototype.isAntiSenseStrandBatchSelected = function () {
                    if (this.duplexBatch.AntiSenseStrandBatches.length >= 1)
                        return true;
                    return false;
                };
                CreateDuplexBatchCtrl.prototype.isSenseStrandBatchSelected = function () {
                    if (this.duplexBatch.SenseStrandBatches.length >= 1)
                        return true;
                    return false;
                };
                CreateDuplexBatchCtrl.prototype.selectDate = function () {
                    this.onSelectDate();
                };
                CreateDuplexBatchCtrl.prototype.onSelectDate = function () {
                    this.isDatePickerOpened = !this.isDatePickerOpened;
                };
                CreateDuplexBatchCtrl.prototype.getSenseStrandBatches = function (strandBatches) {
                    return strandBatches.filter(function (value) {
                        return value.Orientation === "Sense";
                    });
                };
                CreateDuplexBatchCtrl.prototype.getAntiSenseStrandBatches = function (strandBatches) {
                    return strandBatches.filter(function (value) {
                        return value.Orientation === "Antisense";
                    });
                };
                CreateDuplexBatchCtrl.prototype.removeSenseStrandBatch = function (index) {
                    this.duplexBatch.SenseStrandBatches.splice(index, 1);
                };
                CreateDuplexBatchCtrl.prototype.removeAntiSenseStrandBatch = function (index) {
                    this.duplexBatch.AntiSenseStrandBatches.splice(index, 1);
                };
                CreateDuplexBatchCtrl.prototype.clearStrandBatches = function () {
                    this.duplexBatch.SenseStrandBatches = [];
                    this.duplexBatch.AntiSenseStrandBatches = [];
                };
                CreateDuplexBatchCtrl.prototype.containsStrandBatch = function (id) {
                    return this.duplexBatch.SenseStrandBatches.some(function (item) { return item.Id === id; });
                };
                CreateDuplexBatchCtrl.prototype.selectDuplex = function () {
                    var _this = this;
                    var modalSettings = {
                        templateUrl: '/Scripts/angular-app/widgets/selectModalTemplate.html',
                        controller: 'SelectModalCtrl',
                        controllerAs: 'vm',
                        size: 'lg',
                        resolve: {
                            selectModalConfig: function () {
                                return {
                                    gridOptions: {
                                        multiSelect: false,
                                        columnDefs: [
                                            {
                                                name: 'ArrowheadDuplexId',
                                                displayName: ' Duplex ID',
                                                field: 'ArrowheadDuplexId'
                                            },
                                            {
                                                name: 'SenseStrandId',
                                                displayName: 'Sense Strand ID',
                                                field: 'SenseStrand.ArrowheadStrandId'
                                            },
                                            {
                                                name: 'SenseStrandSequence',
                                                displayName: 'Sense Sequence 5 -> 3 ',
                                                field: 'SenseStrand.Sequence'
                                            },
                                            {
                                                name: 'AntiSenseStrandId',
                                                displayName: 'Anti Sense Strand ID',
                                                field: 'AntiSenseStrand.ArrowheadStrandId'
                                            },
                                            {
                                                name: 'AntiSenseStrandSequence',
                                                displayName: 'Anti Sense Sequence 5',
                                                field: 'AntiSenseStrand.Sequence'
                                            },
                                            {
                                                name: 'Target',
                                                displayName: 'Target',
                                                field: 'Target.Name'
                                            }
                                        ]
                                    },
                                    collectionName: 'ItemList',
                                    prompt: 'Select Duplex'
                                };
                            },
                            searchResource: function () {
                                return {
                                    getData: function (query) {
                                        return _this.duplexesService.getDuplexes(query);
                                    }
                                };
                            }
                        }
                    };
                    var modalInstance = this.$uibModal.open(modalSettings);
                    modalInstance.result.then(function (result) {
                        if (result != null && result !== 'cancel') {
                            _this.clearStrandBatches();
                            _this.duplexBatch.Duplex = {
                                ArrowheadDuplexId: result.ArrowheadDuplexId,
                                AntiSenseStrand: {
                                    Id: result.AntiSenseStrand.Id,
                                    ArrowheadStrandId: result.AntiSenseStrand.ArrowheadStrandId,
                                    Sequence: result.AntiSenseStrand.Sequence
                                },
                                SenseStrand: {
                                    Id: result.SenseStrand.Id,
                                    ArrowheadStrandId: result.SenseStrand.ArrowheadStrandId,
                                    Sequence: result.SenseStrand.Sequence
                                },
                                Target: {
                                    Id: result.Target.Id,
                                    Name: result.Target.Name
                                }
                            };
                            _this.duplexBatch.DuplexId = result.Id;
                        }
                        ;
                    });
                };
                CreateDuplexBatchCtrl.prototype.selectSenseStrandBatches = function () {
                    var _this = this;
                    var orientation = "Sense";
                    var prompt = 'Select Sense Strand Batches';
                    var searchResource = {
                        getData: function (query) {
                            var strandId = _this.duplexBatch.Duplex.SenseStrand.Id;
                            return _this.duplexesService.getStrandBatches(strandId, query);
                        }
                    };
                    this.selectStrandBatches(prompt, searchResource).then(function (result) {
                        if (result != null && result !== 'cancel') {
                            for (var i = 0; i < result.length; i++) {
                                if (!_this.containsStrandBatch(result[0].Id)) {
                                    _this.duplexBatch.SenseStrandBatches.push({
                                        StrandBatch: {
                                            Id: result[i].Id,
                                            ArrowHeadBatchNumber: result[i].ArrowHeadBatchNumber
                                        }
                                    });
                                }
                            }
                        }
                        ;
                    });
                };
                CreateDuplexBatchCtrl.prototype.selectAntiSenseStrandBatches = function () {
                    var _this = this;
                    var orientation = "Antisense";
                    var prompt = 'Select Anti Sense Strand Batches';
                    var searchResource = {
                        getData: function (query) {
                            var strandId = _this.duplexBatch.Duplex.AntiSenseStrand.Id;
                            return _this.duplexesService.getStrandBatches(strandId, query);
                        }
                    };
                    this.selectStrandBatches(prompt, searchResource).then(function (result) {
                        if (result != null && result !== 'cancel') {
                            for (var i = 0; i < result.length; i++) {
                                if (!_this.containsStrandBatch(result[0].Id)) {
                                    _this.duplexBatch.AntiSenseStrandBatches.push({
                                        StrandBatch: {
                                            Id: result[i].Id,
                                            ArrowHeadBatchNumber: result[i].ArrowHeadBatchNumber
                                        }
                                    });
                                }
                            }
                        }
                        ;
                    });
                };
                CreateDuplexBatchCtrl.prototype.selectStrandBatches = function (promt, searchResource) {
                    var modalSettings = {
                        templateUrl: '/Scripts/angular-app/widgets/selectModalTemplate.html',
                        controller: 'SelectModalCtrl',
                        controllerAs: 'vm',
                        size: 'lg',
                        resolve: {
                            selectModalConfig: function () {
                                return {
                                    gridOptions: {
                                        multiSelect: true,
                                        columnDefs: [
                                            {
                                                name: 'ArrowheadBatchNumber',
                                                displayName: 'Batch Number',
                                                field: 'ArrowHeadBatchNumber'
                                            },
                                            {
                                                name: 'RemainingVolume',
                                                displayName: 'Remaining Volume (ul)',
                                                field: 'RemainingVolume',
                                                cellFilter: 'number: 1'
                                            },
                                            {
                                                name: 'AmountRemaining',
                                                displayName: 'Amount Remaining (mg)',
                                                field: 'AmountRemaining',
                                                cellFilter: 'number: 1'
                                            },
                                            {
                                                name: 'Purity',
                                                displayName: '% FLP',
                                                field: 'Purity',
                                                cellFilter: 'number: 2'
                                            },
                                            {
                                                name: 'Unavailable',
                                                displayName: 'Unavailable',
                                                field: 'Unavailable',
                                                visible: true,
                                                type: 'boolean',
                                                cellTemplate: '<input type="checkbox" ng-model="row.entity.Unavailable" disabled>'
                                            },
                                        ]
                                    },
                                    collectionName: 'ItemList',
                                    prompt: promt
                                };
                            },
                            searchResource: searchResource
                        }
                    };
                    var modalInstance = this.$uibModal.open(modalSettings);
                    return modalInstance.result;
                };
                CreateDuplexBatchCtrl.$inject = ['$scope', '$window', '$uibModal', 'duplexesService'];
                return CreateDuplexBatchCtrl;
            }());
            App.getAppContainer()
                .getSection('app.duplexes')
                .getInstance()
                .controller('CreateDuplexBatchCtrl', CreateDuplexBatchCtrl)
                .controller('SelectModalCtrl', App.Widgets.SelectModalCtrl);
        })(Controllers = Duplexes.Controllers || (Duplexes.Controllers = {}));
    })(Duplexes = App.Duplexes || (App.Duplexes = {}));
})(App || (App = {}));
//# sourceMappingURL=createDuplexBatchCtrl.js.map