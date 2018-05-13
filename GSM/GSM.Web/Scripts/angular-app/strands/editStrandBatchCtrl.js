var App;
(function (App) {
    var Strands;
    (function (Strands) {
        var Controllers;
        (function (Controllers) {
            var EditStrandBatchCtrl = (function () {
                function EditStrandBatchCtrl($scope, $window, $location, $uibModal, strandsService) {
                    this.$scope = $scope;
                    this.$window = $window;
                    this.$location = $location;
                    this.$uibModal = $uibModal;
                    this.strandsService = strandsService;
                    this.initialize();
                    this.loadStrandBatch();
                }
                EditStrandBatchCtrl.prototype.initialize = function () {
                    this.isFormSubmitted = false;
                };
                EditStrandBatchCtrl.prototype.loadStrandBatch = function () {
                    var _this = this;
                    var strandId = 0;
                    var strandBatchId = +App.Common.Utils.lastUrlParam(this.$location.absUrl());
                    this.strandsService.getStrandBatch(strandId, strandBatchId)
                        .then(function (data) {
                        _this.strandBatch = data;
                        _this.strandBatch.InitiatedDate = new Date(data.InitiatedDate);
                    });
                };
                EditStrandBatchCtrl.prototype.pageMode = function (mode) {
                    if (mode) {
                        return "View";
                    }
                    else {
                        return "Edit";
                    }
                };
                EditStrandBatchCtrl.prototype.permitSave = function () {
                    if (this.$scope.form.$valid && this.isStrandSelected()) {
                        return true;
                    }
                    return false;
                };
                EditStrandBatchCtrl.prototype.isStrandSelected = function () {
                    if (this.strandBatch.StrandId)
                        return true;
                    return false;
                };
                EditStrandBatchCtrl.prototype.saveStrandBatch = function () {
                    var _this = this;
                    if (this.permitSave()) {
                        var strandId = this.strandBatch.StrandId;
                        var strandBatchId = this.strandBatch.Id;
                        this.strandsService.updateStrandBatch(strandId, strandBatchId, this.strandBatch)
                            .then(function (data) {
                            _this.strandBatch.Error = data.Errors;
                            _this.$scope.form.$setPristine();
                            if (!data.HasErrors) {
                                _this.$window.location.href = '/Strand/EditStrandBatch/' + data.Id;
                            }
                        });
                    }
                };
                EditStrandBatchCtrl.prototype.viewModeChange = function () {
                    this.editMode = !this.editMode;
                };
                EditStrandBatchCtrl.prototype.selectDate = function () {
                    this.onSelectDate();
                };
                EditStrandBatchCtrl.prototype.onSelectDate = function () {
                    this.isDatePickerOpened = !this.isDatePickerOpened;
                };
                EditStrandBatchCtrl.prototype.cancelChanges = function () {
                    this.$window.location.href = '/Strand';
                };
                EditStrandBatchCtrl.prototype.onSubmit = function () {
                    this.isFormSubmitted = true;
                };
                EditStrandBatchCtrl.prototype.selectStrand = function () {
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
                                Target: result.Target.Name
                            };
                            _this.strandBatch.StrandId = result.Id;
                        }
                        ;
                    });
                };
                EditStrandBatchCtrl.$inject = ['$scope', '$window', '$location', '$uibModal', 'strandsService'];
                return EditStrandBatchCtrl;
            }());
            App.getAppContainer()
                .getSection('app.strands')
                .getInstance()
                .controller('EditStrandBatchCtrl', EditStrandBatchCtrl)
                .controller("SelectModalCtrl", App.Widgets.SelectModalCtrl);
        })(Controllers = Strands.Controllers || (Strands.Controllers = {}));
    })(Strands = App.Strands || (App.Strands = {}));
})(App || (App = {}));
//# sourceMappingURL=editStrandBatchCtrl.js.map