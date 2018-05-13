namespace App.Strands.Controllers {
    import IStrandsService = App.Strands.Services.IStrandsService;

    class SplitStrandBatchCtrl {
        public strand: any;
        public sourceStrandBatch: any;
        public splittedBatches: Array<any>;
        public isFormSubmitted: boolean;

        static $inject = ['$scope', '$window', '$state', '$stateParams', 'strandsService'];
        constructor(
            private $scope,
            private $window,
            private $state,
            $stateParams,
            private strandsService: IStrandsService) {
           
            this.strand = $stateParams.model.strand;
            this.sourceStrandBatch = $stateParams.model.sourceStrandBatch;
           
            this.$scope.registerFormScope = (form, id) =>{
                this.$scope.parentForm['form' + id] = form;
            };

            this.initialize();
        }

        initialize(): void {
            this.splittedBatches = [
                {
                    InitiatedDate: new Date(),
                    Position: '',
                    RunId: '',
                    Unavailable: false,
                    SynthesisScale: '',
                    Purity: '',
                    AmountPrepared: '',
                    PreparedVolume: '',
                    MiscVolumeUsed: 0,
                    Notes: ''
                },
                {
                    InitiatedDate: new Date(),
                    Position: '',
                    RunId: '',
                    Unavailable: false,
                    SynthesisScale: '',
                    Purity: '',
                    AmountPrepared: '',
                    PreparedVolume: '',
                    MiscVolumeUsed: 0,
                    Notes: ''
                }
            ];
            this.isFormSubmitted = false;
        }

        saveSplittedBatches() {
            let strandId = this.strand.Id;
            let sourceBatchId = this.sourceStrandBatch.Id;
            this.strandsService.splitStrandBatch(strandId, sourceBatchId, this.splittedBatches)
                .then((data) => {
                    let hasErrors = false;
                    for (let i = 0; i < data.length; i++) {
                        let batch = data[i];
                        this.splittedBatches[i].Error = batch.Errors;
                        if (batch.HasErrors) {
                            hasErrors = true;
                        }
                    }
                    if (!hasErrors) {
                        this.$window.location.href = '/Strand/Batches';
                    }
                })
                .catch((exception) => {

                });
        }

        onSubmit() {
            this.isFormSubmitted = true;
            this.$scope.parentForm.$setPristine();
        }

        submitForm() {
            if (this.$scope.parentForm.$valid) {
                this.saveSplittedBatches();
            }
        }

        cancelChanges() {
            this.$state.go('createStrandBatch');
        }
    }

    App.getAppContainer()
        .getSection('app.strands')
        .getInstance()
        .controller('SplitStrandBatchCtrl', SplitStrandBatchCtrl);
}