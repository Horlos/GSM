var App;
(function (App) {
    var Targets;
    (function (Targets) {
        var Controllers;
        (function (Controllers) {
            var EditTargetCtrl = (function () {
                function EditTargetCtrl($scope, $window, $location, deleteModalService, targetsService) {
                    this.$scope = $scope;
                    this.$window = $window;
                    this.$location = $location;
                    this.deleteModalService = deleteModalService;
                    this.targetsService = targetsService;
                    this.initialize();
                    this.loadTargets();
                }
                EditTargetCtrl.prototype.initialize = function () {
                    this.editMode = false;
                };
                EditTargetCtrl.prototype.loadTargets = function () {
                    var _this = this;
                    var targetId = +App.Common.Utils.lastUrlParam(this.$location.absUrl());
                    this.targetsService.getTargetById(targetId)
                        .then(function (data) {
                        _this.target = data;
                    });
                };
                EditTargetCtrl.prototype.permitSubmit = function () {
                    return this.$scope.form.$valid && this.$scope.form.$dirty;
                };
                EditTargetCtrl.prototype.submit = function () {
                    var _this = this;
                    if (this.permitSubmit()) {
                        var targetId = +App.Common.Utils.lastUrlParam(this.$location.absUrl());
                        this.targetsService.updateTarget(targetId, this.target)
                            .then(function (data) {
                            if (!data.HasErrors) {
                                _this.$window.location.href = '/Target/Edit/' + data.Id;
                            }
                            else {
                                _this.target.Error = data.Errors;
                            }
                        });
                    }
                };
                EditTargetCtrl.prototype.cancelChanges = function () {
                    this.loadTargets();
                    this.$scope.form.$setPristine();
                };
                EditTargetCtrl.prototype.pageMode = function () {
                    if (this.editMode) {
                        return "View";
                    }
                    else {
                        return "Edit";
                    }
                };
                EditTargetCtrl.prototype.permitView = function () {
                    return this.$scope.form.$dirty;
                };
                EditTargetCtrl.prototype.viewModeChange = function () {
                    this.editMode = !this.editMode;
                };
                EditTargetCtrl.prototype.showDeleteModal = function (response) {
                    var _this = this;
                    var confirmation = 'Do you wish to remove this target ' + this.target.Name + '?';
                    this.deleteModalService.deleteConfirmation(confirmation)
                        .then(function (response) {
                        if (response === 'ok') {
                            _this.deleteTargets();
                        }
                    });
                };
                EditTargetCtrl.prototype.permitDeletion = function () {
                    if (this.target) {
                        return !this.target.HasAssociations;
                    }
                    return false;
                };
                EditTargetCtrl.prototype.deleteTargets = function () {
                    var _this = this;
                    this.targetsService.deleteTarget(this.target.Id)
                        .then(function () {
                        var notification = 'Target ' + _this.target.Name + ' was deleted.';
                        _this.deleteModalService.deleteCompleted(notification)
                            .then(function () {
                            return _this.$window.location.href = '/Target/';
                        });
                    });
                };
                EditTargetCtrl.$inject = ['$scope', '$window', '$location', 'deleteModalService', 'targetsService'];
                return EditTargetCtrl;
            }());
            App.getAppContainer()
                .getSection('app.targets')
                .getInstance()
                .controller('EditTargetCtrl', EditTargetCtrl);
        })(Controllers = Targets.Controllers || (Targets.Controllers = {}));
    })(Targets = App.Targets || (App.Targets = {}));
})(App || (App = {}));
//# sourceMappingURL=editTargetCtrl.js.map