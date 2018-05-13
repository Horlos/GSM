namespace App.Strands.Controllers {

    class EditStrandBatchCtrl {
        public strandBatch: any;

        public editMode: boolean;
        public isFormSubmitted: boolean;
        public isDatePickerOpened: boolean;

        static $inject = ['$scope', '$window','$location', '$uibModal', 'strandsService'];
        constructor(
            private $scope,
            private $window: ng.IWindowService,
            private $location: ng.ILocationService,
            private $uibModal: ng.ui.bootstrap.IModalService,
            private strandsService: App.Strands.Services.IStrandsService) {
            this.initialize();
            this.loadStrandBatch();
        }

        initialize() {
            this.isFormSubmitted = false;
        }

        loadStrandBatch() {
            let strandId = 0;
            let strandBatchId: number = +App.Common.Utils.lastUrlParam(this.$location.absUrl());
            this.strandsService.getStrandBatch(strandId, strandBatchId)
                .then((data) => {
                    this.strandBatch = data;
                    this.strandBatch.InitiatedDate = new Date(data.InitiatedDate);
                });
        }

        pageMode(mode) {
            if (mode) {
                return "View";
            } else {
                return "Edit";
            }
        }

        permitSave() {
            if (this.$scope.form.$valid && this.isStrandSelected()) {
                return true;
            }
            return false;
        }

        isStrandSelected(): boolean {
            if (this.strandBatch.StrandId)
                return true;

            return false;
        }

        saveStrandBatch() {
            if (this.permitSave()) {
                let strandId = this.strandBatch.StrandId;
                let strandBatchId = this.strandBatch.Id;
                this.strandsService.updateStrandBatch(strandId, strandBatchId, this.strandBatch)
                    .then((data) => {
                        this.strandBatch.Error = data.Errors;
                        this.$scope.form.$setPristine();
                        if (!data.HasErrors) {
                            this.$window.location.href = '/Strand/EditStrandBatch/' + data.Id;
                        }
                    });
            }
        }

        viewModeChange() {
            this.editMode = !this.editMode;
        }

        selectDate() {
            this.onSelectDate();
        }

        onSelectDate() {
            this.isDatePickerOpened = !this.isDatePickerOpened;
        }

        cancelChanges() {
            this.$window.location.href = '/Strand';
        }

        onSubmit() {
            this.isFormSubmitted = true;
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
                        Target: result.Target.Name
                    };
                    this.strandBatch.StrandId = result.Id;
                };
            });
        }
    }

    App.getAppContainer()
        .getSection('app.strands')
        .getInstance()
        .controller('EditStrandBatchCtrl', EditStrandBatchCtrl)
        .controller("SelectModalCtrl", Widgets.SelectModalCtrl);
}