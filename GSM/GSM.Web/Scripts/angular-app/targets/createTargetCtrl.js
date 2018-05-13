var App;
(function (App) {
    var Targets;
    (function (Targets) {
        var Controllers;
        (function (Controllers) {
            var CreateTargetCtrl = (function () {
                function CreateTargetCtrl($scope, $window, targetsService) {
                    this.$scope = $scope;
                    this.$window = $window;
                    this.targetsService = targetsService;
                    this.initialize();
                }
                CreateTargetCtrl.prototype.initialize = function () {
                    this.target = {
                        Name: '',
                        IsActive: true,
                        Error: {}
                    };
                };
                CreateTargetCtrl.prototype.permitSubmit = function () {
                    return this.$scope.form.$dirty;
                };
                CreateTargetCtrl.prototype.submit = function () {
                    var _this = this;
                    if (this.permitSubmit()) {
                        this.targetsService.createTarget(this.target)
                            .then(function (data) {
                            if (!data.HasErrors) {
                                _this.$window.location.href = '/Target/Edit/' + data.Id;
                            }
                            _this.target.Error = data.Errors;
                            _this.$scope.form.$setPristine();
                        });
                    }
                };
                CreateTargetCtrl.prototype.cancelChanges = function () {
                    this.$window.location.href = '/Target';
                };
                CreateTargetCtrl.$inject = ['$scope', '$window', 'targetsService'];
                return CreateTargetCtrl;
            }());
            App.getAppContainer()
                .getSection('app.targets')
                .getInstance()
                .controller('CreateTargetCtrl', CreateTargetCtrl);
        })(Controllers = Targets.Controllers || (Targets.Controllers = {}));
    })(Targets = App.Targets || (App.Targets = {}));
})(App || (App = {}));
//# sourceMappingURL=createTargetCtrl.js.map