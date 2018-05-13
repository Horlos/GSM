namespace App.Instruments.Controllers {

    interface ICreateInstrumentScope extends ng.IScope {
        form: ng.IFormController;
    }

    class CreateInstrumentCtrl {
        public instrument: any;

        static $inject = ['$scope', '$window', 'instrumentsService'];
        constructor(
            private $scope: ICreateInstrumentScope,
            private $window: ng.IWindowService,
            private instrumentsService: App.Instruments.Services.IInstrumentsService) {
            this.initialize();
        }

        initialize(): void {
            this.instrument = {
                Name: '',
                IsActive: true,
                MasAmidities: 0,
                Error: {}
            };
        }

        permitSubmit(): boolean {
            return this.$scope.form.$valid && this.$scope.form.$dirty;
        }

        submit(): void {
            if (this.permitSubmit()) {
                this.instrumentsService.createInstrument(this.instrument)
                    .then((response) => {
                        if (!response.HasErrors) {
                            this.$window.location.href = '/Instrument/Edit/' + response.Id;
                        }
                        this.instrument.Error = response.Errors;
                        this.$scope.form.$setPristine();
                    });
            }
        }

        cancelChanges(): void {
            this.$window.location.href = '/Instruments';
        }
    }

    App.getAppContainer()
        .getSection('app.instruments')
        .getInstance()
        .controller('CreateInstrumentCtrl', CreateInstrumentCtrl);
}