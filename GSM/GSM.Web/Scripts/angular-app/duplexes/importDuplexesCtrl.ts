namespace App.Duplexes.Controllers {
    class ImportDuplexesCtrl {
        public gridOptions: uiGrid.IGridOptionsOf<App.Duplexes.Models.DuplexModel>;
        public duplexes: Array<App.Duplexes.Models.DuplexModel>;
        private uploadedFile: any;
        private importedDuplexesKey: string;
        private uploadedFileKey: string;
        private toastr: App.Common.Ui.Toaster.IToastServiceInstance;

        static $inject = ['$window', '$state', '$stateParams', 'localStorageService', 'deleteModalService', 'Upload', 'duplexesService', 'toastService'];
        constructor(private $window: ng.IWindowService,
            private $state: angular.ui.IStateService,
            $stateParams: angular.ui.IStateParamsService,
            private localStorage: angular.local.storage.ILocalStorageService,
            private deleteModalService: App.Widgets.IDeleteModalService,
            private uploader: angular.angularFileUpload.IUploadService,
            private duplexesService: App.Duplexes.Services.IDuplexesService,
            private toastService: App.Common.Ui.Toaster.IToastService) {
            this.toastr = this.toastService.getToastServiceInstance();
            this.importedDuplexesKey = "importedDuplexes";
            this.initializeGrid();
            this.initialize($stateParams);
        }

        initialize(stateParams: angular.ui.IStateParamsService): void {
            if (stateParams["duplex"] != null) {
                let modifiedDuplex: App.Duplexes.Models.DuplexModel = stateParams["duplex"];
                this.duplexes = this.localStorage.get<Array<App.Duplexes.Models.DuplexModel>>(this.importedDuplexesKey) || [];
                let duplex = App.Common.Utils.searchFor(this.duplexes, 'Id', modifiedDuplex.Id);
                let index = this.duplexes.indexOf(duplex);
                this.duplexes[index] = modifiedDuplex;
                this.gridOptions.data = this.duplexes;
            }
        }

        initializeGrid(): void {
            this.gridOptions = {
                enableRowHeaderSelection: false,
                enablePaginationControls: false,
                enableHorizontalScrollbar: 0,
                enableVerticalScrollbar: 0,
                enableRowSelection: true,
                multiSelect: false,
                enableColumnMenus: false,
                appScopeProvider: this,
                rowTemplate: '<div>' +
                '  <div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"' +
                'ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'duplicated-duplex\': grid.appScope.hasErrors( row.entity ) }" ui-grid-cell></div>' +
                '</div>',
                columnDefs: [
                    {
                        name: 'Target',
                        field: 'Target',
                        visible: true,
                        cellClass: 'table-cell',
                        cellTemplate:
                        '<span ng-class="{\'red-highlighting\':grid.appScope.hasErrors(row.entity.Target)}">{{row.entity.Target.Name}}</span>'
                    },
                    {
                        name: 'DuplexMW',
                        field: 'MW',
                        displayName: 'Duplex MW',
                        cellFilter: 'number: 2',
                        visible: true
                    },
                    {
                        name: 'AntisenseStrandId',
                        field: 'AntiSenseStrand',
                        displayName: 'Antisense Strand ID',
                        visible: true,
                        cellClass: 'table-cell',
                        cellTemplate:
                        '<span ng-class="{\'red-highlighting\':grid.appScope.hasErrors(row.entity.AntiSenseStrand)}">{{row.entity.AntiSenseStrand.ArrowheadStrandId}}</span>'
                    },
                    {
                        name: 'AntisenseStrandMW',
                        field: 'AntiSenseStrand.MW',
                        displayName: 'Antisense Strand MW',
                        cellFilter: 'number: 2',
                        visible: true
                    },
                    {
                        name: 'SenseStrandId',
                        field: 'SenseStrand',
                        displayName: 'Sense Strand ID',
                        visible: true,
                        cellClass: 'table-cell',
                        cellTemplate:
                        '<span ng-class="{\'red-highlighting\':grid.appScope.hasErrors(row.entity.SenseStrand)}">{{row.entity.SenseStrand.ArrowheadStrandId}}</span>'
                    },
                    {
                        name: 'SenseStrandMW',
                        field: 'SenseStrand.MW',
                        displayName: 'Sense Strand MW',
                        cellFilter: 'number: 2',
                        visible: true
                    },
                    {
                        name: 'Delete',
                        field: '',
                        displayName: '',
                        visible: true,
                        cellClass: 'table-cell',
                        cellTemplate:
                        '<a class="delete-duplex" ng-click="grid.appScope.deleteDuplexModal(row.entity)">Delete</a>'
                    },
                    {
                        name: 'Edit',
                        field: '',
                        displayName: '',
                        visible: true,
                        cellClass: 'table-cell',
                        cellTemplate: '<a class="edit-duplex" ng-click="grid.appScope.editDuplex(row.entity)">Edit</a>'
                    }
                ],

                onRegisterApi: (gridApi: uiGrid.IGridApiOf<App.Duplexes.Models.DuplexModel>) => {

                }
            };
        }

        hasErrors(target): boolean {
            return target.HasErrors;
        }

        uploadFile(file, errFiles): void {
            if (file) {
                this.uploadedFile = file;
            } else if (errFiles.length > 0) {
                this.toastr.showToast("File was not uploaded. Try to choose another file.",
                    App.Common.Ui.Toaster.ToastType.Error,
                    App.Common.Ui.Toaster.ToastPosition.BottomRight);
            }
        }

        permitProcessFile(): boolean {
            return this.uploadedFile != null;
        }

        permitImport(): boolean {
            if (angular.isDefined(this.duplexes)) {
                return this.duplexes.every((duplex) => {
                    return !duplex.Target.HasErrors &&
                        !duplex.SenseStrand.HasErrors &&
                        !duplex.AntiSenseStrand.HasErrors;
                });
            }

            return false;
        }

        importDuplexes(): void {
            if (this.permitImport()) {
                this.localStorage.remove(this.importedDuplexesKey);
                this.duplexesService.createDuplexes(this.duplexes)
                    .then((data) => {
                        this.gridOptions.data = data;
                        var errorsCount = 0;
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].HasErrors) {
                                errorsCount++;
                            }
                        }
                        if (errorsCount < 1) {
                            this.duplexes = [];
                            this.gridOptions.data = this.duplexes;
                            this.uploadedFile = {};
                            this.toastr.showToast("Duplexes was successfully created",
                                App.Common.Ui.Toaster.ToastType.Success,
                                App.Common.Ui.Toaster.ToastPosition.BottomRight);
                        } else {
                            let message = 'Duplicate duplex';
                            if (errorsCount > 1)
                                message = `Duplicate ${errorsCount} duplexes`;

                            this.toastr.showToast(message,
                                App.Common.Ui.Toaster.ToastType.Error,
                                App.Common.Ui.Toaster.ToastPosition.BottomRight);
                        }
                    })
                    .catch((error) => {
                        this.toastr.showToast("Error has occurred during processing request",
                            App.Common.Ui.Toaster.ToastType.Error,
                            App.Common.Ui.Toaster.ToastPosition.BottomRight);
                    });
            }
        }

        processFile(): void {
            let url = '/api/duplexes/import';
            let data = { file: this.uploadedFile };
            let config: angular.angularFileUpload.IFileUploadConfigFile = {
                data: data,
                url: url,
                method: 'POST'
            };
            this.uploader.upload<Array<App.Duplexes.Models.DuplexModel>>(config)
                .then((response) => {
                    this.duplexes = [];
                    for (let i = 0; i < response.data.length; i++) {
                        let duplex = response.data[i];
                        duplex.Id = i;
                        this.duplexes.push(duplex);
                    }

                    this.gridOptions.data = this.duplexes;
                })
                .catch((exception) => {
                    if (exception.status === 400) {
                        this.toastr
                            .showToast("Uploaded file has incorrect format. Please check the data or upload another one.",
                            App.Common.Ui.Toaster.ToastType.Error,
                            App.Common.Ui.Toaster.ToastPosition.BottomRight);
                    } else {
                        this.toastr.showToast("Error has occurred during processing request",
                            App.Common.Ui.Toaster.ToastType.Error,
                            App.Common.Ui.Toaster.ToastPosition.BottomRight);
                    }
                });
        }

        deleteDuplexModal(duplex: App.Duplexes.Models.DuplexModel): void {
            let confirmation = 'Do you wish to remove this duplex?';
            this.deleteModalService.deleteConfirmation(confirmation)
                .then((response) => {
                    if (response === 'ok') {
                        this.deleteDuplex(duplex);
                        let notification = 'Duplex was deleted.';
                        this.deleteModalService.deleteCompleted(notification);
                    }
                });
        }

        editDuplex(duplex): void {
            this.localStorage.set(this.importedDuplexesKey, this.duplexes);
            this.$state.go('editImportedDuplex', { duplex: duplex });
        }


        private deleteDuplex(duplex: App.Duplexes.Models.DuplexModel): void {
            let index = this.duplexes.indexOf(duplex);
            this.duplexes.splice(index, 1);
        }
    }

    App.getAppContainer()
        .getSection('app.duplexes')
        .getInstance()
        .controller('ImportDuplexesCtrl', ImportDuplexesCtrl);
}