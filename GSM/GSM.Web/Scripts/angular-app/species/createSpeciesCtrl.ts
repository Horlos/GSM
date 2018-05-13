namespace App.Species.Controllers {

    interface ICreateSpeciesScope extends ng.IScope {
        form: ng.IFormController;
    }

    class CreateSpeciesCtrl {
        public species: any;

        static $inject = ['$scope', '$window', 'speciesService'];
        constructor(
            private $scope: ICreateSpeciesScope,
            private $window: ng.IWindowService,
            private speciesService: App.Species.Services.ISpeciesService) {
            this.initialize();
        }

        initialize(): void {
            this.species = {
                Name: '',
                IsActive: true,
                Error: {}
            };
        }

        permitSubmit(): boolean {
            return this.$scope.form.$valid && this.$scope.form.$dirty;
        }

        submit(): void {
            this.speciesService.createSpecies(this.species)
                .then((response) => {
                    if (!response.HasErrors) {
                        this.$window.location.href = '/Species/Edit/' + response.Id;
                    }
                    this.species.Error = response.Errors;
                    this.$scope.form.$setPristine();
                });
        }

        cancelChanges(): void {
            this.$window.location.href = '/Species';
        }
    }

    App.getAppContainer()
        .getSection('app.species')
        .getInstance()
        .controller('CreateSpeciesCtrl', CreateSpeciesCtrl);
}