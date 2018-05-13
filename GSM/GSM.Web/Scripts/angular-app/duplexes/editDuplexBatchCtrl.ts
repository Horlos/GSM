namespace App.Duplexes.Controllers {

    class EditDuplexBatchCtrl {
        public duplexBatch: any;
        public strandbatches: Array<any>;

        public editMode: boolean;
        public isFormSubmitted: boolean;
        public isDatePickerOpened: boolean;

        static $inject = ['$scope', '$window', '$location', '$uibModal', 'duplexesService'];
        constructor(
            private $scope,
            private $window,
            private $location,
            private $uibModal,
            private duplexesService: App.Duplexes.Services.IDuplexesService) {
            this.isFormSubmitted = false;
            this.isDatePickerOpened = false;
            this.duplexBatch = { StrandBatches: [] };
            this.initialize();
        }

        initialize() {
            this.loadDuplexBatch();
        }

        loadDuplexBatch() {
            let duplexId = 0;
            let duplexBatchId = this.lastUrlParam(this.$location.absUrl());
            this.duplexesService.getDuplexBatch(duplexId, duplexBatchId)
                .then((data) => {
                    this.duplexBatch = data;
                    this.duplexBatch.PreparedDate = new Date(data.PreparedDate);
                });
        }

        lastUrlParam(url) {
            var urlAsArray = url.split('/');
            return urlAsArray[urlAsArray.length - 1];
        }

        permitSave(): boolean {
            if (this.$scope.form.$valid &&
                this.isDuplexSelected() &&
                this.isAntiSenseStrandBatchSelected() &&
                this.isSenseStrandBatchSelected()) {
                return true;
            }

            return false;
        }

        onSubmit(): void {
            this.isFormSubmitted = true;
        }

        submitForm(): void {
            if (this.permitSave()) {
                this.updateDuplexBatch();
            }
        }

        updateDuplexBatch(): void {
            let duplexId = this.duplexBatch.DuplexId;
            let duplexBatchId = this.duplexBatch.Id;
            this.duplexesService.updateDuplexBatch(duplexId, duplexBatchId, this.duplexBatch)
                .then((data) => {
                    this.$window.location.href = '/Duplex/EditDuplexBatch/' + data.Id;
                });
        }

        cancelChanges(): void {
            this.$window.location.href = '/Duplex/Batches';
        }

        pageMode(mode) {
            if (mode) {
                return "View";
            } else {
                return "Edit";
            }
        }

        viewModeChange() {
            this.editMode = !this.editMode;
        }

        isDuplexSelected(): boolean {
            if (this.duplexBatch.DuplexId)
                return true;

            return false;
        }

        isAntiSenseStrandBatchSelected(): boolean {
            if (this.getAntiSenseStrandBatches().length >= 1)
                return true;

            return false;
        }

        isSenseStrandBatchSelected(): boolean {
            if (this.getSenseStrandBatches().length >= 1)
                return true;

            return false;
        }

        selectDate(): void {
            this.onSelectDate();
        }

        onSelectDate(): void {
            this.isDatePickerOpened = !this.isDatePickerOpened;
        }

        getSenseStrandBatches(): Array<any> {
            return this.duplexBatch.StrandBatches.filter((value) => {
                return value.StrandBatch.Orientation.Name === "Sense";
            });
        }

        getAntiSenseStrandBatches(): Array<any> {
            return this.duplexBatch.StrandBatches.filter((value) => {
                return value.StrandBatch.Orientation.Name === "Antisense";
            });
        }

		isStrandBatchTotalUsedDefined(strandBatch: any): boolean {
			var fieldName = "strand-batch-" + strandBatch.StrandBatch.ArrowHeadBatchNumber;
			return angular.isDefined(strandBatch.TotalUsed) && strandBatch.TotalUsed != null && this.$scope.form[fieldName].$untouched;
        }

        removeStrandBatch(strandBatch: any): void {
            let index = this.duplexBatch.StrandBatches.indexOf(strandBatch);
            this.duplexBatch.StrandBatches.splice(index, 1);
        }

        containsStrandBatch(id: number): boolean {
            return this.duplexBatch.SenseStrandBatches.some((item) => { return item.Id === id; });
        }

        selectSenseStrandBatches(): void {
            var orientation = "Sense";
            let prompt = 'Select Sense Strand Batches';
            var searchResource: App.Widgets.ISearchResource = {
                getData: (query): ng.IPromise<any> => {
                    let strandId = this.duplexBatch.Duplex.SenseStrand.Id;
                    return this.duplexesService.getStrandBatches(strandId, query);
                }
            };
            this.selectStrandBatches(prompt, searchResource).then((result) => {
                if (result != null && result !== 'cancel') {
                    for (let i = 0; i < result.length; i++) {
                        if (!this.containsStrandBatch(result[0].Id)) {
                            this.duplexBatch.StrandBatches.push({
                                StrandBatch: {
                                    Id: result[i].Id,
                                    ArrowHeadBatchNumber: result[i].ArrowHeadBatchNumber
                                }
                            });

                        }
                    }
                };
            });
        }

        selectAntiSenseStrandBatches(): void {
            var orientation = "Antisense";
            let prompt = 'Select Anti Sense Strand Batches';
            var searchResource: App.Widgets.ISearchResource = {
                getData: (query): ng.IPromise<any> => {
                    let strandId = this.duplexBatch.Duplex.AntiSenseStrand.Id;
                    return this.duplexesService.getStrandBatches(strandId, query);
                }
            };
            this.selectStrandBatches(prompt, searchResource).then((result) => {
                if (result != null && result !== 'cancel') {
                    for (let i = 0; i < result.length; i++) {
                        if (!this.containsStrandBatch(result[0].Id)) {
                            this.duplexBatch.StrandBatches.push({
                                StrandBatch: {
                                    Id: result[i].Id,
                                    ArrowHeadBatchNumber: result[i].ArrowHeadBatchNumber
                                }
                            });
                        }
                    }
                };
            });
        }

        selectStrandBatches(promt: string, searchResource: App.Widgets.ISearchResource) {
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
                        }
                    },
                    searchResource: searchResource
                }
            };
            let modalInstance = this.$uibModal.open(modalSettings);
            return modalInstance.result;
        }
    }

    App.getAppContainer()
        .getSection('app.duplexes')
        .getInstance()
        .controller('EditDuplexBatchCtrl', EditDuplexBatchCtrl)
        .controller('SelectModalCtrl', App.Widgets.SelectModalCtrl);
}