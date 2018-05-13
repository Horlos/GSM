namespace App.Widgets {

    export interface IInputModalConfig {
        title: string;
        modalBody?: string;
        confirmOption?: string;
        cancelOption?: string;
        validationMessage?: (model: any) => string;
        confirmEnabledCondition?: (params: any) => ng.IPromise<boolean>;
        cancelEnabledCondition?: (params: any) => ng.IPromise<boolean>;
    }

    class InputModalCtrl {
        public modalBody: string;
        public validationMessage: string;
        public title: string;
        public confirmOption: string;
        public cancelOption: string;
        public model: any;

        static $inject = ['$scope', '$q', '$uibModalInstance', 'inputModalConfig'];
        constructor(
            private $scope,
            private $q: ng.IQService,
            private $modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private modalConfig: IInputModalConfig) {
            this.title = modalConfig.title || '';
            this.modalBody = modalConfig.modalBody || '';
            this.validationMessage =  '';
            this.confirmOption = modalConfig.confirmOption || 'OK';
            this.cancelOption = modalConfig.cancelOption || 'Cancel';

            this.$scope.$watch('model', () => {
                this.validationMessage = '';
            }, true);
        }

        permitOk(): ng.IPromise<boolean> {
            if (this.modalConfig.confirmEnabledCondition) {
                return this.modalConfig.confirmEnabledCondition(this.model);
            } else {
                return this.$q((resolve) => {
                    resolve(true);
                });
            }
        }

        ok() {
            this.permitOk()
                .then((result) => {
                    if (result) {
                        this.$modalInstance.close(this.model);
                    } else {
                        this.validationMessage = this.modalConfig.validationMessage(this.model);
                    }
                }, (reason) => {
                    console.log(reason);
                });
        }

        permitCancel(): ng.IPromise<boolean> {
            if (this.modalConfig.cancelEnabledCondition) {
                return this.modalConfig.cancelEnabledCondition(this.model);
            } else {
                return this.$q((resolve) => {
                    resolve(true);
                });
            }
        }

        cancel() {
            this.permitCancel()
                .then((result) => {
                    if (result)
                        this.$modalInstance.dismiss();
                });
        }
    }

    App.getAppContainer()
        .getSection('app.widgets')
        .getInstance()
        .controller('InputModalCtrl', InputModalCtrl);
}