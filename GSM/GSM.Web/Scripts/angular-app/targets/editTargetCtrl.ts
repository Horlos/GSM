namespace App.Targets.Controllers {

    interface IEditTargetScope extends ng.IScope {
        form: ng.IFormController;
    }

    class EditTargetCtrl {
        public target: any;
        public editMode: boolean;

        static $inject = ['$scope', '$window', '$location', 'deleteModalService', 'targetsService'];

        constructor(
            private $scope: IEditTargetScope,
            private $window: ng.IWindowService,
            private $location: ng.ILocationService,
            private deleteModalService: App.Widgets.IDeleteModalService,
            private targetsService: App.Targets.Services.ITargetsService) {
            this.initialize();
            this.loadTargets();
        }

        initialize(): void {
            this.editMode = false;
        }

        loadTargets(): void {
            let targetId: number = +App.Common.Utils.lastUrlParam(this.$location.absUrl());
            this.targetsService.getTargetById(targetId)
                .then((data) => {
                    this.target = data;
                });
        }

        permitSubmit(): boolean {
            return this.$scope.form.$valid && this.$scope.form.$dirty;
        }

        submit(): void {
            if (this.permitSubmit()) {
                let targetId: number = +App.Common.Utils.lastUrlParam(this.$location.absUrl());
                this.targetsService.updateTarget(targetId, this.target)
                    .then((data) => {
                        if (!data.HasErrors) {
                            this.$window.location.href = '/Target/Edit/' + data.Id;

                        } else {
                            this.target.Error = data.Errors;
                        }
                    });
            }
        }

        cancelChanges(): void {
            this.loadTargets();
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
            let confirmation = 'Do you wish to remove this target ' + this.target.Name + '?';
            this.deleteModalService.deleteConfirmation(confirmation)
                .then((response) => {
                    if (response === 'ok') {
                        this.deleteTargets();
                    }
                });
        }

        permitDeletion(): boolean {
            if (this.target) {
                return !this.target.HasAssociations;
            }

            return false;
        }

        deleteTargets() {
            this.targetsService.deleteTarget(this.target.Id)
                .then(() => {
                    let notification = 'Target ' + this.target.Name + ' was deleted.';
                    this.deleteModalService.deleteCompleted(notification)
                        .then(() =>
                            this.$window.location.href = '/Target/');
                });
        }
    }

    App.getAppContainer()
        .getSection('app.targets')
        .getInstance()
        .controller('EditTargetCtrl', EditTargetCtrl);
}