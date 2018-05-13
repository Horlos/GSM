namespace App.Targets.Controllers {

    interface ICreateTargetScope extends ng.IScope {
        form: ng.IFormController;
    }

    class CreateTargetCtrl {
        public target: any;

        static $inject = ['$scope', '$window', 'targetsService'];
        constructor(
            private $scope: ICreateTargetScope,
            private $window: ng.IWindowService,
            private targetsService: App.Targets.Services.ITargetsService) {
            this.initialize();
        }

        initialize(): void {
            this.target = {
                Name: '',
                IsActive: true,
                Error: {}
            };
        }

        permitSubmit(): boolean {
            return this.$scope.form.$dirty;
        }

        submit(): void {
            if (this.permitSubmit()) {
                this.targetsService.createTarget(this.target)
                    .then((data) => {
                        if (!data.HasErrors) {
                            this.$window.location.href = '/Target/Edit/' + data.Id;
                        }
                        this.target.Error = data.Errors;
                        this.$scope.form.$setPristine();
                    });
            }
        }

        cancelChanges(): void {
            this.$window.location.href = '/Target';
        }
    }

    App.getAppContainer()
        .getSection('app.targets')
        .getInstance()
        .controller('CreateTargetCtrl', CreateTargetCtrl);
}