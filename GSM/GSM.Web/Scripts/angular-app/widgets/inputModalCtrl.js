var App;
(function (App) {
    var Widgets;
    (function (Widgets) {
        var InputModalCtrl = (function () {
            function InputModalCtrl($scope, $q, $modalInstance, modalConfig) {
                var _this = this;
                this.$scope = $scope;
                this.$q = $q;
                this.$modalInstance = $modalInstance;
                this.modalConfig = modalConfig;
                this.title = modalConfig.title || '';
                this.modalBody = modalConfig.modalBody || '';
                this.validationMessage = '';
                this.confirmOption = modalConfig.confirmOption || 'OK';
                this.cancelOption = modalConfig.cancelOption || 'Cancel';
                this.$scope.$watch('model', function () {
                    _this.validationMessage = '';
                }, true);
            }
            InputModalCtrl.prototype.permitOk = function () {
                if (this.modalConfig.confirmEnabledCondition) {
                    return this.modalConfig.confirmEnabledCondition(this.model);
                }
                else {
                    return this.$q(function (resolve) {
                        resolve(true);
                    });
                }
            };
            InputModalCtrl.prototype.ok = function () {
                var _this = this;
                this.permitOk()
                    .then(function (result) {
                    if (result) {
                        _this.$modalInstance.close(_this.model);
                    }
                    else {
                        _this.validationMessage = _this.modalConfig.validationMessage(_this.model);
                    }
                }, function (reason) {
                    console.log(reason);
                });
            };
            InputModalCtrl.prototype.permitCancel = function () {
                if (this.modalConfig.cancelEnabledCondition) {
                    return this.modalConfig.cancelEnabledCondition(this.model);
                }
                else {
                    return this.$q(function (resolve) {
                        resolve(true);
                    });
                }
            };
            InputModalCtrl.prototype.cancel = function () {
                var _this = this;
                this.permitCancel()
                    .then(function (result) {
                    if (result)
                        _this.$modalInstance.dismiss();
                });
            };
            InputModalCtrl.$inject = ['$scope', '$q', '$uibModalInstance', 'inputModalConfig'];
            return InputModalCtrl;
        }());
        App.getAppContainer()
            .getSection('app.widgets')
            .getInstance()
            .controller('InputModalCtrl', InputModalCtrl);
    })(Widgets = App.Widgets || (App.Widgets = {}));
})(App || (App = {}));
//# sourceMappingURL=inputModalCtrl.js.map