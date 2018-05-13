namespace App.Widgets {

    export interface IDeleteModalService {
        deleteConfirmation(confirmationQuestion: string): ng.IPromise<any>;
        deleteCompleted(completionNotification: string): ng.IPromise<any>;
    }

    class DeleteModalService implements IDeleteModalService {
        static $inject = ['$uibModal'];
        constructor(private $uibModal: ng.ui.bootstrap.IModalService) {
        }

        deleteConfirmation(confirmationQuestion): ng.IPromise<any> {
            let config: ng.ui.bootstrap.IModalSettings = {
                templateUrl: '/Scripts/angular-app/widgets/confirmationModal.html',
                controller: 'ConfirmModalCtrl',
                controllerAs: 'vm',
                size: 'sm',
                resolve: {
                    confirmModalConfig: (): App.Widgets.IConfirmModalConfig => {
                        return {
                            confirmationMessage: confirmationQuestion
                        }
                    }
                }
            };
            let modalInstance = this.$uibModal.open(config);
            return modalInstance.result;
        };

        deleteCompleted(completionNotification) {
            let config: ng.ui.bootstrap.IModalSettings = {
                templateUrl: '/Scripts/angular-app/widgets/deleteCompleted.html',
                controller: 'ConfirmModalCtrl',
                controllerAs: 'vm',
                size: 'sm',
                resolve: {
                    confirmModalConfig: (): App.Widgets.IConfirmModalConfig => {
                        return {
                            confirmationMessage: completionNotification
                        }
                    }
                }
            };
            let modalInstance = this.$uibModal.open(config);
            return modalInstance.result;
        };
    }

    App.getAppContainer()
        .getSection('app.widgets')
        .getInstance()
        .service('deleteModalService', DeleteModalService);
}