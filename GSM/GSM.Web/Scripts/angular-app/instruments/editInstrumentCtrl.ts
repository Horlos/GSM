namespace App.Instruments.Controllers {

    interface IEditInstrumentScope extends ng.IScope {
        form: ng.IFormController;
    }

    class EditInstrumentsCtrl {
        public instrument: any;
        public editMode: boolean;

        static $inject = ['$scope', '$window', '$location', 'deleteModalService', 'instrumentsService'];
        constructor(
            private $scope: IEditInstrumentScope,
            private $window: ng.IWindowService,
            private $location: ng.ILocationService,
            private deleteModalService: App.Widgets.IDeleteModalService,
            private instrumentsService: App.Instruments.Services.IInstrumentsService) {
            this.initialize();
            let instrumentId = +App.Common.Utils.lastUrlParam(this.$location.absUrl());
            this.loadInstrumentsData(instrumentId);
        }

        initialize(): void {
            this.editMode = false;
        }

        loadInstrumentsData(instrumentId): void {
            this.instrumentsService.getInstrumentById(instrumentId)
                .then((data) => {
                    this.instrument = data;
                });
        }

        permitSubmit(): boolean {
            return this.$scope.form.$valid && this.$scope.form.$dirty;
        }

        submit(): void {
            let instrumentId = this.instrument.Id;
            this.instrumentsService.updateInstrument(instrumentId, this.instrument)
                .then((data) => {
                    if (!data.HasErrors) {
                        this.$window.location.href = '/Instrument/Edit/' + data.Id;
                    } else {
                        this.instrument.Error = data.Errors;
                    }
                });
        }

        cancelChanges(): void {
            let instrumentId = this.instrument.Id;
            this.loadInstrumentsData(instrumentId);
            this.$scope.form.$setPristine();
            this.editMode = false;
        }

        pageMode() {
            if (this.editMode) {
                return "View";
            } else {
                return "Edit";
            }
        }

        permitView(): boolean {
            return this.$scope.form.$dirty;
        }

        viewModeChange(): void {
            this.editMode = !this.editMode;
        }

        showDeleteModal(response): void {
            let confirmation = 'Do you wish to remove this instrument ' + this.instrument.Name + '?';
            this.deleteModalService.deleteConfirmation(confirmation)
                .then((response) => {
                    if (response === 'ok') {
                        this.deleteInstrument();
                    }
                });
        }

        deleteInstrument() {
            let instrumentId = this.instrument.Id;
            this.instrumentsService.deleteInstrument(instrumentId)
                .then(() => {
                    let notification = 'Instrument was deleted.';
                    this.deleteModalService.deleteCompleted(notification)
                        .then(() =>
                            this.$window.location.href = '/Instrument/');
                });
        }
    }

    App.getAppContainer()
        .getSection('app.instruments')
        .getInstance()
        .controller('EditInstrumentsCtrl', EditInstrumentsCtrl);
}