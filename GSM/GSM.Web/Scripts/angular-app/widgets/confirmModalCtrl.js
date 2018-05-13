var App;
(function (App) {
    var Widgets;
    (function (Widgets) {
        var ConfirmModalCtrl = (function () {
            function ConfirmModalCtrl($uibModalInstance, modalConfig) {
                this.$uibModalInstance = $uibModalInstance;
                this.modalConfig = modalConfig;
                this.title = modalConfig.title || 'Confirmation';
                this.confirmationMessage = modalConfig.confirmationMessage || '';
                this.confirmOption = modalConfig.confirmOption || 'Yes';
                this.cancelOption = modalConfig.cancelOption || 'No';
            }
            ConfirmModalCtrl.prototype.ok = function () {
                this.$uibModalInstance.close('ok');
            };
            ConfirmModalCtrl.prototype.cancel = function () {
                this.$uibModalInstance.close('cancel');
            };
            ConfirmModalCtrl.$inject = ['$uibModalInstance', 'confirmModalConfig'];
            return ConfirmModalCtrl;
        }());
        App.getAppContainer()
            .getSection('app.widgets')
            .getInstance()
            .controller('ConfirmModalCtrl', ConfirmModalCtrl);
    })(Widgets = App.Widgets || (App.Widgets = {}));
})(App || (App = {}));
//# sourceMappingURL=confirmModalCtrl.js.map