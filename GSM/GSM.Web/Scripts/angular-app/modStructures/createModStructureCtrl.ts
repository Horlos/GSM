namespace App.ModStructures.Controllers {

    interface ICreateModStructureScope {
        form: ng.IFormController;
    }

    class CreateModStructureCtrl {
        private maxFileUploadSize = 28.6; // IIS7 default max file upload size is 28.6MB
        private uploadedFiles: Array<File>;

        public modStructure: any;
        public availableModStructureTypes: Array<any>;
        public availableInstruments: Array<any>;
        private toastr: App.Common.Ui.Toaster.IToastServiceInstance;

        static $inject = ['$scope', '$window', '$q', 'Upload', 'modStructuresService', 'lookupService', 'toastService'];
        constructor(
            private $scope: ICreateModStructureScope,
            private $window: ng.IWindowService,
            private $q: ng.IQService,
            private uploader: angular.angularFileUpload.IUploadService,
            private modStructuresService: App.ModStructures.Services.IModStructuresService,
            private lookupService: App.Services.ILookupService,
            private toastService: App.Common.Ui.Toaster.IToastService) {
            this.initialize();
            this.loadModStructuresTypes();
            this.loadInstruments();
        }

        initialize(): void {
            this.modStructure = {
                Name: '',
                ModStructureType: {},
                Base: '',
                VendorName: '',
                VendorCatalogNumber: '',
                Coupling: '',
                Deprotection: '',
                Formula: '',
                DisplayColor: '',
                StartingMaterialMW: 0,
                IncorporatedMW: 0,
                Notes: '',
                InstrumentModStructures: [],
                Attachments: [],
                IsActive: true,
                Error: {}
            };
            this.uploadedFiles = [];
            this.availableInstruments = [];
            this.availableModStructureTypes = [];
            this.toastr = this.toastService.getToastServiceInstance();
        }

        loadModStructuresTypes(): void {
            this.lookupService.getTable("ModStructureTypes")
                .then((data) => {
                    this.availableModStructureTypes = data.ModStructureTypes;
                });
        }

        loadInstruments(): void {
            this.lookupService.getTable("Instruments")
                .then((data) => {
                    let instrumentModStructures = [];
                    angular.forEach(data.Instruments,
                        (item) => {
                            this.availableInstruments.push({
                                Id: item.Id,
                                Name: item.Name
                            });
                            instrumentModStructures.push({
                                InstrumentId: item.Id,
                                Code: ''
                            });
                        });
                    this.modStructure.InstrumentModStructures = instrumentModStructures;
                });
        }

        getInstrumentName(instrumentId: number) {
            let instrument = this.availableInstruments.filter((instrument) => {
                return instrument.Id === instrumentId;
            });
            if (instrument.length > 0)
                return instrument[0].Name;

            return "";
        }

        permitSubmit() {
            return this.$scope.form.$valid;
        }

        submit() {
            if (this.permitSubmit()) {
                this.modStructure.ModStructureTypeId = this.modStructure.ModStructureType.Id;
                this.modStructuresService.createModStructure(this.modStructure)
                    .then((response) => {
                        if (response.HasErrors) {
                            this.modStructure.Error = response.Errors;
                            this.$scope.form.$setPristine();
                        } else {
                            let modStructureId = response.Id;
                            if (this.uploadedFiles.length > 0) {
                                this.modStructure.Id = modStructureId;
                                this.saveAttachments();
                            } else {
                                this.$window.location.href = '/ModStructure/Edit/' + modStructureId;
                            }
                        }
                    });
            }
        }

        cancelChanges() {
            this.$window.location.href = '/ModStructures';
        }

        uploadFiles(files, errFiles) {
            angular.forEach(files,
                (file: File) => {
                    if (file.size < this.maxFileUploadSize * 1024 * 1024) {
                        this.modStructure.Attachments.push({ FileName: file.name });
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
        }

        deleleAttachment(item): void {
            let index = this.modStructure.Attachments.indexOf(item);
            if (index > -1) {
                this.modStructure.Attachments.splice(index, 1);
            };
        }
    }

    App.getAppContainer()
        .getSection('app.modStructures')
        .getInstance()
        .controller('CreateModStructureCtrl', CreateModStructureCtrl);
}