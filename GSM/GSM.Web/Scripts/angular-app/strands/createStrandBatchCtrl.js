var App;
(function (App) {
    var Strands;
    (function (Strands) {
        var Controllers;
        (function (Controllers) {
            var CreateStrandbatchCtrl = (function () {
                function CreateStrandbatchCtrl($scope, $window, $state, $uibModal, strandsService) {
                    this.$scope = $scope;
                    this.$window = $window;
                    this.$state = $state;
                    this.$uibModal = $uibModal;
                    this.strandsService = strandsService;
                    this.initialize();
                    this.registerHandlers();
                }
                CreateStrandbatchCtrl.prototype.initialize = function () {
                    this.strandBatch = {
                        InitiatedDate: new Date(),
                        Position: '',
                        RunId: '',
                        Unavailable: false,
                        SynthesisScale: '',
                        Purity: '',
                        AmountPrepared: '',
                        PreparedVolume: '',
                        MiscVolumeUsed: 0,
                        Notes: '',
                        Strand: {}
                    };
                    this.combinedBatches = [];
                    this.isCombined = false;
                    this.isDatePickerOpened = false;
                    this.isFormSubmitted = false;
                };
                CreateStrandbatchCtrl.prototype.registerHandlers = function () {
                    $("#create-strand-batch").on("keyup", "input[name='amountPrepared']", function () {
                        var element = $(this);
                        var value = element.val();
                        var length = 4;
                        var decimal = (value.split('.'));
                        if (decimal[1] && decimal[1].length > length) {
                            var number = parseFloat(value) - 0.00004;
                            element.val(number.toFixed(length));
                        }
                    });
                };
                CreateStrandbatchCtrl.prototype.permitSave = function () {
                    if (this.$scope.form.$valid && this.isStrandSelected()) {
                        if (!this.isCombined) {
                            return true;
                        }
                        else if (this.combinedBatches.length > 1) {
                            return true;
                        }
                    }
                    return false;
                };
                CreateStrandbatchCtrl.prototype.createStrandBatch = function () {
                    var _this = this;
                    var strandId = this.strandBatch.StrandId;
                    this.strandsService.createStrandBatch(strandId, this.strandBatch)
                        .then(function (response) {
                        _this.onSuccess(response);
                    });
                };
                CreateStrandbatchCtrl.prototype.combineStrandBatches = function () {
                    var _this = this;
                    var strandId = this.strandBatch.StrandId;
                    var combinedBatches = this.combinedBatches.map(function (item) {
                        return item.Id;
                    });
                    this.strandsService.combineStrandBatches(strandId, this.strandBatch, combinedBatches)
                        .then(function (response) {
                        _this.onSuccess(response);
                    });
                };
                CreateStrandbatchCtrl.prototype.onSuccess = function (response) {
                    this.strandBatch.Error = response.Errors;
                    this.$scope.form.$setPristine();
                    if (!response.HasErrors) {
                        this.$window.location.href = "/Strand/EditStrandBatch/" + response.Id;
                    }
                };
                CreateStrandbatchCtrl.prototype.submitForm = function () {
                    if (this.permitSave()) {
                        if (this.isCombined)
                            this.combineStrandBatches();
                        else {
                            this.createStrandBatch();
                        }
                    }
                };
                CreateStrandbatchCtrl.prototype.isStrandSelected = function () {
                    if (this.strandBatch.StrandId)
                        return true;
                    return false;
                };
                CreateStrandbatchCtrl.prototype.selectDate = function () {
                    this.onSelectDate();
                };
                CreateStrandbatchCtrl.prototype.onSelectDate = function () {
                    this.isDatePickerOpened = !this.isDatePickerOpened;
                };
                CreateStrandbatchCtrl.prototype.onIsCombinedChecked = function () {
                    if (!this.isCombined)
                        this.combinedBatches = [];
                    this.isFormSubmitted = false;
                };
                CreateStrandbatchCtrl.prototype.onSubmit = function () {
                    this.isFormSubmitted = true;
                };
                CreateStrandbatchCtrl.prototype.cancelChanges = function () {
                    this.$window.location.href = '/Strand/Batches';
                };
                CreateStrandbatchCtrl.prototype.selectStrand = function () {
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
                                                displayName: 'MW',
                                                field: 'MW'
                                            }
                                        ]
                                    },
                                    collectionName: 'ItemList',
                                    prompt: 'Select Strand'
                                };
                            },
                            searchResource: function () {
                                return {
                                    getData: function (query) {
                                        return _this.strandsService.getStrands(query);
                                    }
                                };
                            }
                        }
                    };
                    var modalInstance = this.$uibModal.open(modalSettings);
                    modalInstance.result.then(function (result) {
                        if (result != null && result !== 'cancel') {
                            _this.strandBatch.Strand = {
                                Id: result.Id,
                                ArrowheadStrandId: result.ArrowheadStrandId,
                                MW: result.MW,
                                Sequence: result.Sequence,
                                Target: result.Target
                            };
                            _this.strandBatch.StrandId = result.Id;
                            _this.combinedBatches = [];
                        }
                        ;
                    });
                };
                CreateStrandbatchCtrl.prototype.selectBatches = function () {
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
                                        multiSelect: true,
                                        columnDefs: [
                                            {
                                                name: 'ArrowHeadBatchNumber',
                                                displayName: 'Batch Number',
                                                visible: true,
                                                field: 'ArrowHeadBatchNumber'
                                            },
                                            {
                                                name: 'InitiatedDate',
                                                visible: true,
                                                cellFilter: 'date:\'yyyy-MM-dd\'',
                                                field: 'InitiatedDate'
                                            }
                                        ]
                                    },
                                    collectionName: 'ItemList',
                                    prompt: 'Select Batches',
                                    okEnabledCondition: function (selection) {
                                        return selection.length > 1;
                                    }
                                };
                            },
                            searchResource: function () {
                                return {
                                    getData: function (query) {
                                        return _this.strandsService.getStrandBatches(_this.strandBatch.StrandId, query);
                                    }
                                };
                            }
                        }
                    };
                    var modalInstance = this.$uibModal.open(modalSettings);
                    modalInstance.result.then(function (result) {
                        if (result != null && result !== 'cancel') {
                            _this.combinedBatches = result;
                        }
                        ;
                    });
                };
                CreateStrandbatchCtrl.prototype.selectSourceBatch = function () {
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
                                                name: 'ArrowHeadBatchNumber',
                                                displayName: 'Batch Number',
                                                visible: true,
                                                field: 'ArrowHeadBatchNumber'
                                            },
                                            {
                                                name: 'InitiatedDate',
                                                visible: true,
                                                cellFilter: 'date:\'yyyy-MM-dd\'',
                                                field: 'InitiatedDate'
                                            }
                                        ]
                                    },
                                    collectionName: 'ItemList',
                                    prompt: 'Select Batch'
                                };
                            },
                            searchResource: function () {
                                return {
                                    getData: function (query) {
                                        return _this.strandsService.getStrandBatches(_this.strandBatch.StrandId, query);
                                    }
                                };
                            }
                        }
                    };
                    var modalInstance = this.$uibModal.open(modalSettings);
                    modalInstance.result.then(function (result) {
                        if (result != null && result !== 'cancel') {
                            var model = {
                                strand: _this.strandBatch.Strand,
                                sourceStrandBatch: result
                            };
                            _this.$state.go('split', { model: model });
                        }
                        ;
                    });
                };
                CreateStrandbatchCtrl.$inject = ['$scope', '$window', '$state', '$uibModal', 'strandsService'];
                return CreateStrandbatchCtrl;
            }());
            App.getAppContainer()
                .getSection('app.strands')
                .getInstance()
                .controller('CreateStrandBatchCtrl', CreateStrandbatchCtrl)
                .controller('SelectModalCtrl', App.Widgets.SelectModalCtrl);
        })(Controllers = Strands.Controllers || (Strands.Controllers = {}));
    })(Strands = App.Strands || (App.Strands = {}));
})(App || (App = {}));
//# sourceMappingURL=createStrandBatchCtrl.js.map