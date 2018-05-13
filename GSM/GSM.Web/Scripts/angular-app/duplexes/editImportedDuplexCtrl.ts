namespace App.Duplexes.Controllers {
    interface IEditImportedDuplexScope {
        form: ng.IFormController;
    }

    class EditImportedDuplexCtrl {
        public duplex: App.Duplexes.Models.DuplexModel;
        public availableTargets: Array<any>;
        public availableSenseStrands: Array<any>;
        public availableAntisenseStrands: Array<any>;
        public selectedSenseStrands: any;

        static $inject = ['$scope', '$window', '$uibModal', '$state', '$stateParams', 'duplexesService'];
        constructor(private $scope: IEditImportedDuplexScope,
            private $window: ng.IWindowService,
            private $uibModal: angular.ui.bootstrap.IModalService,
            private $state: angular.ui.IStateService,
            private $stateParams: angular.ui.IStateParamsService,
            private duplexesService: App.Duplexes.Services.IDuplexesService) {
            this.availableSenseStrands = [];
            this.availableAntisenseStrands = [];
            this.availableTargets = [];
            this.selectedSenseStrands = null;
            let importedDuplex = $stateParams["duplex"];
            this.duplex = importedDuplex;
            this.loadTargets();
        }

        loadTargets() {
            this.duplexesService.getTargets()
                .then((data) => {
                    this.availableTargets = data.Targets;
                });
        }

        resetForm() {
            this.duplex = {
                Id: 0,
                Target: {},
                SenseStrand: {},
                AntiSenseStrand: {}
            };
        }

        returnDuplex(): void {
            if (this.permitSave()) {
                this.duplex.Target.HasErrors = this.duplex.SenseStrand.TargetId !==
                    this.duplex.AntiSenseStrand.TargetId;

                if (this.duplex.SenseStrand.MW && this.duplex.AntiSenseStrand.MW )
                    this.duplex.MW = this.duplex.SenseStrand.MW + this.duplex.AntiSenseStrand.MW;

                this.$state.go('importDuplexes', { duplex: this.duplex });
            }
        }

        permitSave() {
            return this.duplex.Target != null &&
                this.duplex.SenseStrand != null &&
                this.duplex.AntiSenseStrand != null &&
                this.duplex.SenseStrand.TargetId === this.duplex.AntiSenseStrand.TargetId;
        }

        selectStrand(orientation: string) {
            if (this.duplex.Target != null) {
                let config: angular.ui.bootstrap.IModalSettings = {
                    templateUrl: '/Scripts/angular-app/widgets/selectModalTemplate.html',
                    controller: 'SelectModalCtrl',
                    controllerAs: 'vm',
                    size: 'lg',
                    resolve: {
                        selectModalConfig: (): App.Widgets.ISelectModalConfig => {
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
                            }
                        },
                        searchResource: (): App.Widgets.ISearchResource => {
                            return {
                                getData: (query): ng.IPromise<any> => {
                                    return this.duplexesService.getStrands(orientation, this.duplex.Target.Id, query);
                                }
                            }
                        }
                    }
                };
                let modalInstance = this.$uibModal.open(config);
                modalInstance.result.then((result) => {
                    if (result !== 'cancel') {
                        if (result != null) {
                            if (orientation === "Sense") {
                                this.duplex.SenseStrand = result;
                            } else {
                                this.duplex.AntiSenseStrand = result;
                            }
                        }

                    };
                });
            }
        }
    }

    App.getAppContainer()
        .getSection('app.duplexes')
        .getInstance()
        .controller('EditImportedDuplexCtrl', EditImportedDuplexCtrl)
        .controller('SelectModalCtrl', App.Widgets.SelectModalCtrl);
}