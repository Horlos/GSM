namespace App.Species.Controllers {

    interface IEditSpeciesScope extends ng.IScope {
        form: ng.IFormController;
    }

    class EditSpeciesCtrl {
        public species: any;
        public editMode: boolean;
        private toastr: App.Common.Ui.Toaster.IToastServiceInstance;

        static $inject = ['$scope', '$window', '$location', 'deleteModalService', 'speciesService', 'toastService'];
        constructor(
            private $scope: IEditSpeciesScope,
            private $window: ng.IWindowService,
            private $location: ng.ILocationService,
            private deleteModalService: App.Widgets.IDeleteModalService,
            private speciesService: App.Species.Services.ISpeciesService,
            private toastService: App.Common.Ui.Toaster.IToastService) {
            this.toastr = this.toastService.getToastServiceInstance();
            this.initialize();
            this.loadSpecies();
        }

        initialize(): void {
            this.editMode = false;
        }

        loadSpecies(): void {
            let speciesId: number = +App.Common.Utils.lastUrlParam(this.$location.absUrl());
            this.speciesService.getSpeciesById(speciesId)
                .then((data) => {
                    this.species = data;
                });
        }

        permitSubmit(): boolean {
            return this.$scope.form.$valid && this.$scope.form.$dirty;
        }

        submit() {
            if (this.permitSubmit()) {
                let speciesId: number = +App.Common.Utils.lastUrlParam(this.$location.absUrl());
                this.speciesService.updateSpecies(speciesId, this.species)
                    .then((data) => {
                        if (!data.HasErrors) {
                            this.$window.location.href = '/Species/Edit/' + data.Id;

                        } else {
                            this.species.Error = data.Errors;
                        }
                    });
            }
        }

        cancelChanges(): void {
            this.loadSpecies();
            this.$scope.form.$setPristine();
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
            let confirmation = 'Do you wish to remove this species ' + this.species.Name + '?';
            this.deleteModalService.deleteConfirmation(confirmation)
                .then((response) => {
                    if (response === 'ok') {
                        this.deleteSpecies();
                    }
                });
        }

        permitDeletion(): boolean {
            if (this.species) {
                return !this.species.HasAssociations;
            }

            return false;
        }

        deleteSpecies(): void {
            if (this.permitDeletion()) {
                this.speciesService.deleteSpecies(this.species.Id)
                    .then(() => {
                        let notification = 'Species was deleted.';
                        this.deleteModalService.deleteCompleted(notification)
                            .then(() =>
                                this.$window.location.href = '/Species/');
                    })
                    .catch((error) => {
                        console.log(error);
                        this.toastr.showToast('This species can not be removed. Check if this species is not used in associations and try again.',
                            App.Common.Ui.Toaster.ToastType.Error,
                            App.Common.Ui.Toaster.ToastPosition.BottomRight);
                    });
            }
        }
    }

    App.getAppContainer()
        .getSection('app.species')
        .getInstance()
        .controller('EditSpeciesCtrl', EditSpeciesCtrl);
}