var App;
(function (App) {
    var Strands;
    (function (Strands) {
        var Directives;
        (function (Directives) {
            var CreateStrandBatchCtrl = (function () {
                function CreateStrandBatchCtrl($scope, $timeout) {
                    var _this = this;
                    this.$scope = $scope;
                    this.$timeout = $timeout;
                    this.isDatePickerOpened = false;
                    this.$timeout(function () {
                        _this.$scope.registerFormScope(_this.$scope.form, _this.$scope.$id);
                    });
                }
                CreateStrandBatchCtrl.prototype.selectDate = function () {
                    this.onSelectDate();
                };
                CreateStrandBatchCtrl.prototype.onSelectDate = function () {
                    this.isDatePickerOpened = !this.isDatePickerOpened;
                };
                CreateStrandBatchCtrl.$inject = ['$scope', '$timeout'];
                return CreateStrandBatchCtrl;
            }());
            var CreateStrandBatchDirective = (function () {
                function CreateStrandBatchDirective() {
                    this.scope = {
                        model: "=ngModel",
                        registerFormScope: "=",
                        isFormSubmitted: "="
                    };
                    this.templateUrl = "/Scripts/angular-app/strands/createStrandBatchForm.html";
                    this.restrict = "E";
                    this.require = ['ngModel'];
                    this.controller = CreateStrandBatchCtrl;
                    this.controllerAs = "vm";
                }
                CreateStrandBatchDirective.instance = function () {
                    return new CreateStrandBatchDirective();
                };
                return CreateStrandBatchDirective;
            }());
            App.getAppContainer()
                .getSection('app.strands')
                .getInstance()
                .directive('createBatchForm', CreateStrandBatchDirective.instance);
        })(Directives = Strands.Directives || (Strands.Directives = {}));
    })(Strands = App.Strands || (App.Strands = {}));
})(App || (App = {}));
//# sourceMappingURL=createStrandBatchDirective.js.map