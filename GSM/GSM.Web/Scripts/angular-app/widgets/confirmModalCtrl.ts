namespace App.Widgets {

    export interface IConfirmModalConfig {
        title?: string;
        confirmationMessage?: string;
        confirmOption?: string;
        cancelOption?: string;
    }

    class ConfirmModalCtrl {
        public confirmationMessage: string;
        public title: string;
        public confirmOption: string;
        public cancelOption:string;

        static $inject = ['$uibModalInstance','confirmModalConfig'];
        constructor(
            private $uibModalInstance:ng.ui.bootstrap.IModalServiceInstance,
            private modalConfig: IConfirmModalConfig) {
            this.title = modalConfig.title || 'Confirmation';
            this.confirmationMessage = modalConfig.confirmationMessage || '';
            this.confirmOption = modalConfig.confirmOption || 'Yes';
            this.cancelOption = modalConfig.cancelOption || 'No';
        }

        ok() {
            this.$uibModalInstance.close('ok');
        }

        cancel() {
            this.$uibModalInstance.close('cancel');
        }
    }

    App.getAppContainer()
        .getSection('app.widgets')
        .getInstance()
        .controller('ConfirmModalCtrl', ConfirmModalCtrl);
}