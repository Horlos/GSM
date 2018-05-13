var App;
(function (App) {
    var Species;
    (function (Species) {
        var Controllers;
        (function (Controllers) {
            var CreateSpeciesCtrl = (function () {
                function CreateSpeciesCtrl($scope, $window, speciesService) {
                    this.$scope = $scope;
                    this.$window = $window;
                    this.speciesService = speciesService;
                    this.initialize();
                }
                CreateSpeciesCtrl.prototype.initialize = function () {
                    this.species = {
                        Name: '',
                        IsActive: true,
                        Error: {}
                    };
                };
                CreateSpeciesCtrl.prototype.permitSubmit = function () {
                    return this.$scope.form.$valid && this.$scope.form.$dirty;
                };
                CreateSpeciesCtrl.prototype.submit = function () {
                    var _this = this;
                    this.speciesService.createSpecies(this.species)
                        .then(function (response) {
                        if (!response.HasErrors) {
                            _this.$window.location.href = '/Species/Edit/' + response.Id;
                        }
                        _this.species.Error = response.Errors;
                        _this.$scope.form.$setPristine();
                    });
                };
                CreateSpeciesCtrl.prototype.cancelChanges = function () {
                    this.$window.location.href = '/Species';
                };
                CreateSpeciesCtrl.$inject = ['$scope', '$window', 'speciesService'];
                return CreateSpeciesCtrl;
            }());
            App.getAppContainer()
                .getSection('app.species')
                .getInstance()
                .controller('CreateSpeciesCtrl', CreateSpeciesCtrl);
        })(Controllers = Species.Controllers || (Species.Controllers = {}));
    })(Species = App.Species || (App.Species = {}));
})(App || (App = {}));
//# sourceMappingURL=createSpeciesCtrl.js.map