namespace App.ModStructures.Controllers {

    interface IEditModStructureScope {
        form: ng.IFormController;
    }

    class EditModStructureCtrl {
        private maxFileUploadSize = 28.6; // IIS7 default max file upload size is 28.6MB
        private uploadedFiles: Array<File>;
        private toastr: App.Common.Ui.Toaster.IToastServiceInstance;

        public modStructure: any;
        public editMode: boolean;
        public availableModStructureTypes: Array<any>;
        public availableInstruments: Array<any>;

        static $inject = [
            '$scope', '$window', '$location', '$q', '$uibModal', 'deleteModalService', 'Upload', 'modStructuresService',
            'lookupService', 'toastService'
        ];

        constructor(
            private $scope: IEditModStructureScope,
            private $window: ng.IWindowService,
            private $location: ng.ILocationService,
            private $q: ng.IQService,
            private $uibModal: ng.ui.bootstrap.IModalService,
            private deleteModalService: App.Widgets.IDeleteModalService,
            private uploader: angular.angularFileUpload.IUploadService,
            private modStructuresService: App.ModStructures.Services.IModStructuresService,
            private lookupService: App.Services.ILookupService,
            private toastService: App.Common.Ui.Toaster.IToastService) {
            this.initialize();
            let modStructureId = +App.Common.Utils.lastUrlParam(this.$location.absUrl());
            this.loadModStructureData(modStructureId);
        }

        initialize(): void {
            this.editMode = false;
            this.availableModStructureTypes = [];
            this.availableInstruments = [];
            this.uploadedFiles = [];
            this.toastr = this.toastService.getToastServiceInstance();
        }

        loadModStructureData(modStructureId: number): void {
            this.modStructuresService.getModStructureById(modStructureId)
                .then((data) => {
                    this.modStructure = data;
                    this.modStructure.Attachments = data.Attachments || [];
                    this.modStructure.InstrumentModStructures = data.InstrumentModStructures || [];
                    this.loadLookupData();
                });
        }

        permitSubmit(): boolean {
            return this.$scope.form.$valid;
        }

        submit() {
            if (this.permitSubmit()) {
                if (this.modStructure.HasAssociations && this.isModStructureChanged()) {
                    this.showUpdateModal();
                } else {
                    this.updateModStructure();
                }
            }
        }

        cancelChanges() {
            let modStructureId = this.modStructure.Id;
            this.loadModStructureData(modStructureId);
            this.$scope.form.$setPristine();
            this.editMode = false;
        }

        pageMode() {
            if (this.editMode) {
                return "View";
            } else {
                return "Edit";
            }
        }

        permitView(): boolean {
            return this.$scope.form.$dirty;
        }

        viewModeChange() {
            this.editMode = !this.editMode;
        }

        showDeleteModal(): void {
            let confirmation = 'Do you wish to remove this mod structure ' + this.modStructure.Name + '?';
            this.deleteModalService.deleteConfirmation(confirmation)
                .then((response) => {
                    if (response === 'ok') {
                        this.deleteModStructure();
                    }
                });
        }

        showUpdateModal(): void {
            let config: ng.ui.bootstrap.IModalSettings = {
                templateUrl: '/Scripts/angular-app/widgets/confirmationModal.html',
                controller: 'ConfirmModalCtrl',
                controllerAs: 'vm',
                size: 'md',
                resolve: {
                    confirmModalConfig: (): App.Widgets.IConfirmModalConfig => {
                        return {
                            confirmationMessage:
                            '<div>' +
                            ' <p> Changes to any of the following fields requires manually updating any strands that contain this Mod Structure:</p>' +
                            '<ul><li>Starting Material MW</li>' +
                            '<li> Incorporated MW </li>' +
                            '<li> Mod Structure Name</li>' +
                            '<li> Base </li>' +
                            '</ul><p> Continue save? </p></div>',
                            title: `Update Mod Structure`
                        }
                    }
                }
            };
            let modalInstance = this.$uibModal.open(config);
            modalInstance.result.then((result) => {
                if (result === 'ok') {
                    this.updateModStructure();
                }
            });
        }

        permitDeletion(): boolean {
            if (this.modStructure) {
                return !this.modStructure.HasAssociations;
            }

            return false;
        }

        deleteModStructure() {
            this.modStructuresService.deleteModStructure(this.modStructure.Id)
                .then(() => {
                    let notification = 'Mod structure ' + this.modStructure.Name + ' was deleted.';
                    this.deleteModalService.deleteCompleted(notification)
                        .then(() =>
                            this.$window.location.href = '/ModStructure/');
                });
        }

        loadLookupData(): void {
            this.getModStructuresTypes()
                .then((data) => {
                    this.availableModStructureTypes = data.ModStructureTypes;
                });

            this.getInstruments()
                .then((data) => {
                    this.availableInstruments = data.Instruments.map((item) => {
                        return {
                            Id: item.Id,
                            Name: item.Name
                        }
                    });

                    for (var i = 0; i < data.Instruments.length; i++) {
                        let existingInstrument = App.Common.Utils
                            .searchFor(this.modStructure.InstrumentModStructures,
                            'InstrumentId',
                            data.Instruments[i].Id);

                        if (existingInstrument == null) {
                            this.modStructure.InstrumentModStructures.push({
                                InstrumentId: data.Instruments[i].Id,
                                ModStructureId: this.modStructure.Id,
                                Code: ''
                            });
                        }
                    }
                });
        }

        getModStructuresTypes(): ng.IPromise<any> {
            return this.lookupService.getTable("ModStructureTypes");
        }

        getInstruments(): ng.IPromise<any> {
            return this.lookupService.getTable("Instruments");
        }

        getInstrumentName(instrumentId: number) {
            let instrument = this.availableInstruments.filter((instrument) => {
                return instrument.Id === instrumentId;
            });
            if (instrument.length > 0)
                return instrument[0].Name;

            return "";
        }

        uploadFiles(files, errFiles) {
            angular.forEach(files,
                (file: File) => {
                    if (file.size < this.maxFileUploadSize * 1024 * 1024) {
                        this.modStructure.Attachments.push({
                            FileName: file.name,
                            ModStructureId: this.modStructure.Id
                        });
                        this.uploadedFiles.push(file);
                    } else {
                        this.toastr.showToast('Max file upload size of ' + this.maxFileUploadSize + 'MB exceeded.',
                            App.Common.Ui.Toaster.ToastType.Error,
                            App.Common.Ui.Toaster.ToastPosition.BottomRight);
                    }
                });
        }

        saveAttachments(): void {
            let promises: Array<angular.angularFileUpload.IUploadPromise<any>> = [];
            angular.forEach(this.uploadedFiles,
                (file) => {
                    let uploadConfig: angular.angularFileUpload.IFileUploadConfigFile = {
                        method: 'POST',
                        url: '/api/modstructures/attachment/' + this.modStructure.Id,
                        data: { file: file }
                    };
                    let promise = this.uploader.upload(uploadConfig);
                    promise.then((response) => {
                        //$timeout(() => {
                        //    file.result = response.data;
                        //});
                    },
                        response => {
                            if (response.status > 0) {
                                this.toastr.showToast('Error has occurred during processing request',
                                    App.Common.Ui.Toaster.ToastType.Error,
                                    App.Common.Ui.Toaster.ToastPosition.BottomRight);
                            }
                        });
                    promises.push(promise);
                });

            this.$q.all(promises)
                .then(() => {
                    this.$window.location.href = '/ModStructure/Edit/' + this.modStructure.Id;
                });
        };

        deleleAttachment(item): void {
            let index = this.modStructure.Attachments.indexOf(item);
            if (index > -1) {
                this.modStructure.Attachments.splice(index, 1);
            };
        };

        private isModStructureChanged(): boolean {
            return this.$scope.form['starting-material-weight'].$dirty ||
                this.$scope.form['incorporated-weight'].$dirty ||
                this.$scope.form['mod-structure-name'].$dirty ||
                this.$scope.form['base'].$dirty;
        }

        private updateModStructure(): void {
            let modStructureId = this.modStructure.Id;
            this.modStructure.ModStructureTypeId = this.modStructure.ModStructureType.Id;
            this.modStructuresService.updateModStructure(modStructureId, this.modStructure)
                .then((data) => {
                    if (data.HasErrors) {
                        this.modStructure.Error = data.Errors;
                    } else {
                        if (this.uploadedFiles.length > 0) {
                            this.saveAttachments();
                        } else {
                            this.$window.location.href = '/ModStructure/Edit/' + data.Id;
                        }
                    }
                });
        }
    }

    App.getAppContainer()
        .getSection('app.modStructures')
        .getInstance()
        .controller('EditModStructureCtrl', EditModStructureCtrl);
}