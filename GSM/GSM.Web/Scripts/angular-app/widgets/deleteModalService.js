var App;
(function (App) {
    var Widgets;
    (function (Widgets) {
        var DeleteModalService = (function () {
            function DeleteModalService($uibModal) {
                this.$uibModal = $uibModal;
            }
            DeleteModalService.prototype.deleteConfirmation = function (confirmationQuestion) {
                var config = {
                    templateUrl: '/Scripts/angular-app/widgets/confirmationModal.html',
                    controller: 'ConfirmModalCtrl',
                    controllerAs: 'vm',
                    size: 'sm',
                    resolve: {
                        confirmModalConfig: function () {
                            return {
                                confirmationMessage: confirmationQuestion
                            };
                        }
                    }
                };
                var modalInstance = this.$uibModal.open(config);
                return modalInstance.result;
            };
            ;
            DeleteModalService.prototype.deleteCompleted = function (completionNotification) {
                var config = {
                    templateUrl: '/Scripts/angular-app/widgets/deleteCompleted.html',
                    controller: 'ConfirmModalCtrl',
                    controllerAs: 'vm',
                    size: 'sm',
                    resolve: {
                        confirmModalConfig: function () {
                            return {
                                confirmationMessage: completionNotification
                            };
                        }
                    }
                };
                var modalInstance = this.$uibModal.open(config);
                return modalInstance.result;
            };
            ;
            DeleteModalService.$inject = ['$uibModal'];
            return DeleteModalService;
        }());
        App.getAppContainer()
            .getSection('app.widgets')
            .getInstance()
            .service('deleteModalService', DeleteModalService);
    })(Widgets = App.Widgets || (App.Widgets = {}));
})(App || (App = {}));
//# sourceMappingURL=deleteModalService.js.map