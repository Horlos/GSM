namespace App.Strands.Controllers {

    class CreateStrandbatchCtrl {
        public strandBatch: any;
        public isCombined: boolean;
        public combinedBatches: Array<any>;

        public isFormSubmitted: boolean;
        public isDatePickerOpened: boolean;

        static $inject = ['$scope', '$window', '$state', '$uibModal', 'strandsService'];
        constructor(
            private $scope,
            private $window: ng.IWindowService,
            private $state: ng.ui.IStateService,
            private $uibModal: ng.ui.bootstrap.IModalService,
            private strandsService: App.Strands.Services.IStrandsService) {
            this.initialize();
            this.registerHandlers();
        }

        initialize(): void {
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
        }

        registerHandlers() {
            $("#create-strand-batch").on("keyup", "input[name='amountPrepared']", function () {
                let element = $(this);
                let value = element.val();
                let length = 4;
                let decimal = (value.split('.'));
                if (decimal[1] && decimal[1].length > length) {
                    let number = parseFloat(value) - 0.00004;
                    element.val(number.toFixed(length));
                }
            });
        }

        permitSave(): boolean {
            if (this.$scope.form.$valid && this.isStrandSelected()) {
                if (!this.isCombined) {
                    return true;
                } else if (this.combinedBatches.length > 1) {
                    return true;
                }
            }

            return false;
        }

        createStrandBatch(): void {
            let strandId = this.strandBatch.StrandId;
            this.strandsService.createStrandBatch(strandId, this.strandBatch)
                .then((response) => {
                    this.onSuccess(response);
                });
        }

        combineStrandBatches(): void {
            let strandId = this.strandBatch.StrandId;
            let combinedBatches = this.combinedBatches.map((item) => {
                return item.Id;
            });
            this.strandsService.combineStrandBatches(strandId, this.strandBatch, combinedBatches)
                .then((response) => {
                    this.onSuccess(response);
                });
        }

        onSuccess(response) {
            this.strandBatch.Error = response.Errors;
            this.$scope.form.$setPristine();
            if (!response.HasErrors) {
                this.$window.location.href = `/Strand/EditStrandBatch/${response.Id}`;
            }
        }

        submitForm() {
            if (this.permitSave()) {
                if (this.isCombined)
                    this.combineStrandBatches();
                else {
                    this.createStrandBatch();
                }
            }
        }

        isStrandSelected(): boolean {
            if (this.strandBatch.StrandId)
                return true;

            return false;
        }

        selectDate(): void {
            this.onSelectDate();
        }

        onSelectDate(): void {
            this.isDatePickerOpened = !this.isDatePickerOpened;
        }

        onIsCombinedChecked(): void {
            if (!this.isCombined)
                this.combinedBatches = [];
            this.isFormSubmitted = false;
        }

        onSubmit(): void {
            this.isFormSubmitted = true;
        }

        cancelChanges(): void {
            this.$window.location.href = '/Strand/Batches';
        }

        selectStrand(): void {
            let modalSettings: ng.ui.bootstrap.IModalSettings = {
                templateUrl: '/Scripts/angular-app/widgets/selectModalTemplate.html',
                controller: 'SelectModalCtrl',
                controllerAs: 'vm',
                size: 'lg',
                resolve: {
                    selectModalConfig: (): App.Widgets.ISelectModalConfig => {
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
                        }
                    },
                    searchResource: (): App.Widgets.ISearchResource => {
                        return {
                            getData: (query): ng.IPromise<any> => {
                                return this.strandsService.getStrands(query);
                            }
                        }
                    }
                }
            };
            let modalInstance = this.$uibModal.open(modalSettings);
            modalInstance.result.then((result) => {
                if (result != null && result !== 'cancel') {
                    this.strandBatch.Strand = {
                        Id: result.Id,
                        ArrowheadStrandId: result.ArrowheadStrandId,
                        MW: result.MW,
                        Sequence: result.Sequence,
                        Target: result.Target
                    };
                    this.strandBatch.StrandId = result.Id;
                    this.combinedBatches = [];
                };
            });
        }

        selectBatches(): void {
            let modalSettings: ng.ui.bootstrap.IModalSettings = {
                templateUrl: '/Scripts/angular-app/widgets/selectModalTemplate.html',
                controller: 'SelectModalCtrl',
                controllerAs: 'vm',
                size: 'lg',
                resolve: {
                    selectModalConfig: (): App.Widgets.ISelectModalConfig => {
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
                            okEnabledCondition: (selection) => {
                                return selection.length > 1;
                            }
                        }
                    },
                    searchResource: (): App.Widgets.ISearchResource => {
                        return {
                            getData: (query): ng.IPromise<any> => {
                                return this.strandsService.getStrandBatches(this.strandBatch.StrandId, query);
                            }
                        }
                    }
                }
            };
            let modalInstance = this.$uibModal.open(modalSettings);
            modalInstance.result.then((result) => {
                if (result != null && result !== 'cancel') {
                    this.combinedBatches = result;
                };
            });
        }

        selectSourceBatch(): void {
            let modalSettings: ng.ui.bootstrap.IModalSettings = {
                templateUrl: '/Scripts/angular-app/widgets/selectModalTemplate.html',
                controller: 'SelectModalCtrl',
                controllerAs: 'vm',
                size: 'lg',
                resolve: {
                    selectModalConfig: (): App.Widgets.ISelectModalConfig => {
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
                        }
                    },
                    searchResource: (): App.Widgets.ISearchResource => {
                        return {
                            getData: (query): ng.IPromise<any> => {
                                return this.strandsService.getStrandBatches(this.strandBatch.StrandId, query);
                            }
                        }
                    }
                }
            };
            let modalInstance = this.$uibModal.open(modalSettings);
            modalInstance.result.then((result) => {
                if (result != null && result !== 'cancel') {
                    var model = {
                        strand: this.strandBatch.Strand,
                        sourceStrandBatch: result
                    };
                    this.$state.go('split', { model: model });
                };
            });
        }
    }

    App.getAppContainer()
        .getSection('app.strands')
        .getInstance()
        .controller('CreateStrandBatchCtrl', CreateStrandbatchCtrl)
        .controller('SelectModalCtrl', App.Widgets.SelectModalCtrl);
}