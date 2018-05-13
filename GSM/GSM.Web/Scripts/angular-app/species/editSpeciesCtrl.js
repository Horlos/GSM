var App;
(function (App) {
    var Species;
    (function (Species) {
        var Controllers;
        (function (Controllers) {
            var EditSpeciesCtrl = (function () {
                function EditSpeciesCtrl($scope, $window, $location, deleteModalService, speciesService, toastService) {
                    this.$scope = $scope;
                    this.$window = $window;
                    this.$location = $location;
                    this.deleteModalService = deleteModalService;
                    this.speciesService = speciesService;
                    this.toastService = toastService;
                    this.toastr = this.toastService.getToastServiceInstance();
                    this.initialize();
                    this.loadSpecies();
                }
                EditSpeciesCtrl.prototype.initialize = function () {
                    this.editMode = false;
                };
                EditSpeciesCtrl.prototype.loadSpecies = function () {
                    var _this = this;
                    var speciesId = +App.Common.Utils.lastUrlParam(this.$location.absUrl());
                    this.speciesService.getSpeciesById(speciesId)
                        .then(function (data) {
                        _this.species = data;
                    });
                };
                EditSpeciesCtrl.prototype.permitSubmit = function () {
                    return this.$scope.form.$valid && this.$scope.form.$dirty;
                };
                EditSpeciesCtrl.prototype.submit = function () {
                    var _this = this;
                    if (this.permitSubmit()) {
                        var speciesId = +App.Common.Utils.lastUrlParam(this.$location.absUrl());
                        this.speciesService.updateSpecies(speciesId, this.species)
                            .then(function (data) {
                            if (!data.HasErrors) {
                                _this.$window.location.href = '/Species/Edit/' + data.Id;
                            }
                            else {
                                _this.species.Error = data.Errors;
                            }
                        });
                    }
                };
                EditSpeciesCtrl.prototype.cancelChanges = function () {
                    this.loadSpecies();
                    this.$scope.form.$setPristine();
                };
                EditSpeciesCtrl.prototype.pageMode = function () {
                    if (this.editMode) {
                        return "View";
                    }
                    else {
                        return "Edit";
                    }
                };
                EditSpeciesCtrl.prototype.permitView = function () {
                    return this.$scope.form.$dirty;
                };
                EditSpeciesCtrl.prototype.viewModeChange = function () {
                    this.editMode = !this.editMode;
                };
                EditSpeciesCtrl.prototype.showDeleteModal = function (response) {
                    var _this = this;
                    var confirmation = 'Do you wish to remove this species ' + this.species.Name + '?';
                    this.deleteModalService.deleteConfirmation(confirmation)
                        .then(function (response) {
                        if (response === 'ok') {
                            _this.deleteSpecies();
                        }
                    });
                };
                EditSpeciesCtrl.prototype.permitDeletion = function () {
                    if (this.species) {
                        return !this.species.HasAssociations;
                    }
                    return false;
                };
                EditSpeciesCtrl.prototype.deleteSpecies = function () {
                    var _this = this;
                    if (this.permitDeletion()) {
                        this.speciesService.deleteSpecies(this.species.Id)
                            .then(function () {
                            var notification = 'Species was deleted.';
                            _this.deleteModalService.deleteCompleted(notification)
                                .then(function () {
                                return _this.$window.location.href = '/Species/';
                            });
                        })
                            .catch(function (error) {
                            console.log(error);
                            _this.toastr.showToast('This species can not be removed. Check if this species is not used in associations and try again.', App.Common.Ui.Toaster.ToastType.Error, App.Common.Ui.Toaster.ToastPosition.BottomRight);
                        });
                    }
                };
                EditSpeciesCtrl.$inject = ['$scope', '$window', '$location', 'deleteModalService', 'speciesService', 'toastService'];
                return EditSpeciesCtrl;
            }());
            App.getAppContainer()
                .getSection('app.species')
                .getInstance()
                .controller('EditSpeciesCtrl', EditSpeciesCtrl);
        })(Controllers = Species.Controllers || (Species.Controllers = {}));
    })(Species = App.Species || (App.Species = {}));
})(App || (App = {}));
//# sourceMappingURL=editSpeciesCtrl.js.map