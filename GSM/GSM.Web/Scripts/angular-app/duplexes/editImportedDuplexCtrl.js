var App;
(function (App) {
    var Duplexes;
    (function (Duplexes) {
        var Controllers;
        (function (Controllers) {
            var EditImportedDuplexCtrl = (function () {
                function EditImportedDuplexCtrl($scope, $window, $uibModal, $state, $stateParams, duplexesService) {
                    this.$scope = $scope;
                    this.$window = $window;
                    this.$uibModal = $uibModal;
                    this.$state = $state;
                    this.$stateParams = $stateParams;
                    this.duplexesService = duplexesService;
                    this.availableSenseStrands = [];
                    this.availableAntisenseStrands = [];
                    this.availableTargets = [];
                    this.selectedSenseStrands = null;
                    var importedDuplex = $stateParams["duplex"];
                    this.duplex = importedDuplex;
                    this.loadTargets();
                }
                EditImportedDuplexCtrl.prototype.loadTargets = function () {
                    var _this = this;
                    this.duplexesService.getTargets()
                        .then(function (data) {
                        _this.availableTargets = data.Targets;
                    });
                };
                EditImportedDuplexCtrl.prototype.resetForm = function () {
                    this.duplex = {
                        Id: 0,
                        Target: {},
                        SenseStrand: {},
                        AntiSenseStrand: {}
                    };
                };
                EditImportedDuplexCtrl.prototype.returnDuplex = function () {
                    if (this.permitSave()) {
                        this.duplex.Target.HasErrors = this.duplex.SenseStrand.TargetId !==
                            this.duplex.AntiSenseStrand.TargetId;
                        if (this.duplex.SenseStrand.MW && this.duplex.AntiSenseStrand.MW)
                            this.duplex.MW = this.duplex.SenseStrand.MW + this.duplex.AntiSenseStrand.MW;
                        this.$state.go('importDuplexes', { duplex: this.duplex });
                    }
                };
                EditImportedDuplexCtrl.prototype.permitSave = function () {
                    return this.duplex.Target != null &&
                        this.duplex.SenseStrand != null &&
                        this.duplex.AntiSenseStrand != null &&
                        this.duplex.SenseStrand.TargetId === this.duplex.AntiSenseStrand.TargetId;
                };
                EditImportedDuplexCtrl.prototype.selectStrand = function (orientation) {
                    var _this = this;
                    if (this.duplex.Target != null) {
                        var config = {
                            templateUrl: '/Scripts/angular-app/widgets/selectModalTemplate.html',
                            controller: 'SelectModalCtrl',
                            controllerAs: 'vm',
                            size: 'lg',
                            resolve: {
                                selectModalConfig: function () {
                                    return {
                                        gridOptions: {
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
                                                    name: 'Orientation.Name',
                                                    displayName: 'Orientation',
                                                    field: 'Orientation.Name'
                                                }
                                            ],
                                            multiSelect: false
                                        },
                                        collectionName: 'ItemList',
                                        prompt: 'Select Sense Strand'
                                    };
                                },
                                searchResource: function () {
                                    return {
                                        getData: function (query) {
                                            return _this.duplexesService.getStrands(orientation, _this.duplex.Target.Id, query);
                                        }
                                    };
                                }
                            }
                        };
                        var modalInstance = this.$uibModal.open(config);
                        modalInstance.result.then(function (result) {
                            if (result !== 'cancel') {
                                if (result != null) {
                                    if (orientation === "Sense") {
                                        _this.duplex.SenseStrand = result;
                                    }
                                    else {
                                        _this.duplex.AntiSenseStrand = result;
                                    }
                                }
                            }
                            ;
                        });
                    }
                };
                EditImportedDuplexCtrl.$inject = ['$scope', '$window', '$uibModal', '$state', '$stateParams', 'duplexesService'];
                return EditImportedDuplexCtrl;
            }());
            App.getAppContainer()
                .getSection('app.duplexes')
                .getInstance()
                .controller('EditImportedDuplexCtrl', EditImportedDuplexCtrl)
                .controller('SelectModalCtrl', App.Widgets.SelectModalCtrl);
        })(Controllers = Duplexes.Controllers || (Duplexes.Controllers = {}));
    })(Duplexes = App.Duplexes || (App.Duplexes = {}));
})(App || (App = {}));
//# sourceMappingURL=editImportedDuplexCtrl.js.map