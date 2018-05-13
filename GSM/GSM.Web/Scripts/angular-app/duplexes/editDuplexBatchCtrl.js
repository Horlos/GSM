var App;
(function (App) {
    var Duplexes;
    (function (Duplexes) {
        var Controllers;
        (function (Controllers) {
            var EditDuplexBatchCtrl = (function () {
                function EditDuplexBatchCtrl($scope, $window, $location, $uibModal, duplexesService) {
                    this.$scope = $scope;
                    this.$window = $window;
                    this.$location = $location;
                    this.$uibModal = $uibModal;
                    this.duplexesService = duplexesService;
                    this.isFormSubmitted = false;
                    this.isDatePickerOpened = false;
                    this.duplexBatch = { StrandBatches: [] };
                    this.initialize();
                }
                EditDuplexBatchCtrl.prototype.initialize = function () {
                    this.loadDuplexBatch();
                };
                EditDuplexBatchCtrl.prototype.loadDuplexBatch = function () {
                    var _this = this;
                    var duplexId = 0;
                    var duplexBatchId = this.lastUrlParam(this.$location.absUrl());
                    this.duplexesService.getDuplexBatch(duplexId, duplexBatchId)
                        .then(function (data) {
                        _this.duplexBatch = data;
                        _this.duplexBatch.PreparedDate = new Date(data.PreparedDate);
                    });
                };
                EditDuplexBatchCtrl.prototype.lastUrlParam = function (url) {
                    var urlAsArray = url.split('/');
                    return urlAsArray[urlAsArray.length - 1];
                };
                EditDuplexBatchCtrl.prototype.permitSave = function () {
                    if (this.$scope.form.$valid &&
                        this.isDuplexSelected() &&
                        this.isAntiSenseStrandBatchSelected() &&
                        this.isSenseStrandBatchSelected()) {
                        return true;
                    }
                    return false;
                };
                EditDuplexBatchCtrl.prototype.onSubmit = function () {
                    this.isFormSubmitted = true;
                };
                EditDuplexBatchCtrl.prototype.submitForm = function () {
                    if (this.permitSave()) {
                        this.updateDuplexBatch();
                    }
                };
                EditDuplexBatchCtrl.prototype.updateDuplexBatch = function () {
                    var _this = this;
                    var duplexId = this.duplexBatch.DuplexId;
                    var duplexBatchId = this.duplexBatch.Id;
                    this.duplexesService.updateDuplexBatch(duplexId, duplexBatchId, this.duplexBatch)
                        .then(function (data) {
                        _this.$window.location.href = '/Duplex/EditDuplexBatch/' + data.Id;
                    });
                };
                EditDuplexBatchCtrl.prototype.cancelChanges = function () {
                    this.$window.location.href = '/Duplex/Batches';
                };
                EditDuplexBatchCtrl.prototype.pageMode = function (mode) {
                    if (mode) {
                        return "View";
                    }
                    else {
                        return "Edit";
                    }
                };
                EditDuplexBatchCtrl.prototype.viewModeChange = function () {
                    this.editMode = !this.editMode;
                };
                EditDuplexBatchCtrl.prototype.isDuplexSelected = function () {
                    if (this.duplexBatch.DuplexId)
                        return true;
                    return false;
                };
                EditDuplexBatchCtrl.prototype.isAntiSenseStrandBatchSelected = function () {
                    if (this.getAntiSenseStrandBatches().length >= 1)
                        return true;
                    return false;
                };
                EditDuplexBatchCtrl.prototype.isSenseStrandBatchSelected = function () {
                    if (this.getSenseStrandBatches().length >= 1)
                        return true;
                    return false;
                };
                EditDuplexBatchCtrl.prototype.selectDate = function () {
                    this.onSelectDate();
                };
                EditDuplexBatchCtrl.prototype.onSelectDate = function () {
                    this.isDatePickerOpened = !this.isDatePickerOpened;
                };
                EditDuplexBatchCtrl.prototype.getSenseStrandBatches = function () {
                    return this.duplexBatch.StrandBatches.filter(function (value) {
                        return value.StrandBatch.Orientation.Name === "Sense";
                    });
                };
                EditDuplexBatchCtrl.prototype.getAntiSenseStrandBatches = function () {
                    return this.duplexBatch.StrandBatches.filter(function (value) {
                        return value.StrandBatch.Orientation.Name === "Antisense";
                    });
                };
                EditDuplexBatchCtrl.prototype.isStrandBatchTotalUsedDefined = function (strandBatch) {
                    var fieldName = "strand-batch-" + strandBatch.StrandBatch.ArrowHeadBatchNumber;
                    return angular.isDefined(strandBatch.TotalUsed) && strandBatch.TotalUsed != null && this.$scope.form[fieldName].$untouched;
                };
                EditDuplexBatchCtrl.prototype.removeStrandBatch = function (strandBatch) {
                    var index = this.duplexBatch.StrandBatches.indexOf(strandBatch);
                    this.duplexBatch.StrandBatches.splice(index, 1);
                };
                EditDuplexBatchCtrl.prototype.containsStrandBatch = function (id) {
                    return this.duplexBatch.SenseStrandBatches.some(function (item) { return item.Id === id; });
                };
                EditDuplexBatchCtrl.prototype.selectSenseStrandBatches = function () {
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
                                    _this.duplexBatch.StrandBatches.push({
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
                EditDuplexBatchCtrl.prototype.selectAntiSenseStrandBatches = function () {
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
                                    _this.duplexBatch.StrandBatches.push({
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
                EditDuplexBatchCtrl.prototype.selectStrandBatches = function (promt, searchResource) {
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
                                            }
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
                EditDuplexBatchCtrl.$inject = ['$scope', '$window', '$location', '$uibModal', 'duplexesService'];
                return EditDuplexBatchCtrl;
            }());
            App.getAppContainer()
                .getSection('app.duplexes')
                .getInstance()
                .controller('EditDuplexBatchCtrl', EditDuplexBatchCtrl)
                .controller('SelectModalCtrl', App.Widgets.SelectModalCtrl);
        })(Controllers = Duplexes.Controllers || (Duplexes.Controllers = {}));
    })(Duplexes = App.Duplexes || (App.Duplexes = {}));
})(App || (App = {}));
//# sourceMappingURL=editDuplexBatchCtrl.js.map