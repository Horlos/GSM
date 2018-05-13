namespace App.Strands.Controllers {

    class ImportStrandsCtrl {
        public gridOptions: uiGrid.IGridOptionsOf<App.Strands.Models.StrandModel>;
        public strands: Array<App.Strands.Models.StrandModel>;
        private uploadedFile: any;
        private importedStrandsKey: string;
        private uploadedFileKey: string;
        private toastr: App.Common.Ui.Toaster.IToastServiceInstance;

        static $inject = [
            '$window', '$state', '$stateParams', 'localStorageService', 'deleteModalService', 'Upload', 'strandsService', 'toastService'
        ];

        constructor(
            private $window: ng.IWindowService,
            private $state: angular.ui.IStateService,
            $stateParams: angular.ui.IStateParamsService,
            private localStorage: angular.local.storage.ILocalStorageService,
            private deleteModalService: App.Widgets.IDeleteModalService,
            private uploader: angular.angularFileUpload.IUploadService,
            private strandsServcie: App.Strands.Services.IStrandsService,
            private toastService: App.Common.Ui.Toaster.IToastService) {
            this.toastr = this.toastService.getToastServiceInstance();
            this.importedStrandsKey = "importedStrands";
            this.initializeGrid();
            this.initialize($stateParams);
        }

        initialize(stateParams: angular.ui.IStateParamsService): void {
            if (stateParams["strand"] != null) {
                let modifiedStrand: App.Strands.Models.StrandModel = stateParams["strand"];
                this.strands = this.localStorage.get<Array<App.Strands.Models.StrandModel>>(this.importedStrandsKey) || [];
                let strand = App.Common.Utils.searchFor(this.strands, 'Id', modifiedStrand.Id);
                let index = this.strands.indexOf(strand);
                this.strands[index] = modifiedStrand;
                this.gridOptions.data = this.strands;
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
                'ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'duplicated-strand\': grid.appScope.hasErrors( row.entity ) }" ui-grid-cell></div>' +
                '</div>',
                columnDefs: [
                    {
                        name: 'Sequence',
                        field: 'StrandModStructures',
                        visible: true,
                        cellClass: 'table-cell',
                        width:'20%',
                        cellTemplate:
                        '<span ng-repeat="structure in row.entity.StrandModStructures track by $index" ng-class="{\'red-highlighting\': grid.appScope.hasErrors(structure.ModStructure)}">{{structure.ModStructure.Name}}</span>'
                    },
                    {
                        name: 'Target',
                        field: 'Target',
                        visible: true,
                        cellClass: 'table-cell',
                        cellTemplate:
                        '<span ng-class="{\'red-highlighting\':grid.appScope.hasErrors(row.entity.Target)}">{{row.entity.Target.Name}}</span>'
                    },
                    {
                        name: 'Orientation',
                        field: 'Orientation',
                        visible: true,
                        cellClass: 'table-cell',
                        cellTemplate:
                        '<span ng-class="{\'red-highlighting\':grid.appScope.hasErrors(row.entity.Orientation)}">{{row.entity.Orientation.Name}}</span>'
                    },
                    {
                        name: 'Genome#',
                        field: 'GenomeNumber',
                        visible: true,
                        cellClass: 'table-cell'
                    },
                    {
                        name: 'Genome Position',
                        field: 'GenomePosition',
                        visible: true,
                        cellClass: 'table-cell'
                    },
                    {
                        name: 'Parent Sequence',
                        field: 'ParentSequence',
                        visible: true,
                        cellClass: 'table-cell'
                    },
                    {
                        name: 'Delete',
                        field: '',
                        displayName: '',
                        visible: true,
                        cellClass: 'table-cell',
                        cellTemplate:
                        '<a class="delete-strand" ng-click="grid.appScope.deleteStrandModal(row.entity)">Delete</a>'
                    },
                    {
                        name: 'Edit',
                        field: '',
                        displayName: '',
                        visible: true,
                        cellClass: 'table-cell',
                        cellTemplate: '<a class="edit-strand" ng-click="grid.appScope.editStrand(row.entity)">Edit</a>'
                    }
                ],

                onRegisterApi: (gridApi: uiGrid.IGridApiOf<App.Strands.Models.StrandModel>) => {

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

        permitImport(): boolean {
            if (angular.isDefined(this.strands)) {
                return this.strands.every((strand) => {
                    return strand.StrandModStructures.every((structure) => {
                            return !structure.ModStructure.HasErrors;
                        }) &&
                        !strand.Orientation.HasErrors &&
                        !strand.Target.HasErrors;
                });
            }

            return false;
        }

        importStrands(): void {
            if (this.permitImport()) {
                this.localStorage.remove(this.importedStrandsKey);
                this.strandsServcie.createStrands(this.strands)
                    .then((data: any) => {
                        this.gridOptions.data = data;
                        var errorsCount = 0;
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].HasErrors) {
                                errorsCount++;
                            }
                        }
                        if (errorsCount < 1) {
                            this.strands = [];
                            this.gridOptions.data = this.strands;
                            this.uploadedFile = {};
                            this.toastr.showToast("Strands was successfully created",
                                App.Common.Ui.Toaster.ToastType.Success,
                                App.Common.Ui.Toaster.ToastPosition.BottomRight);
                        } else {
                            let message = 'Duplicate strand';
                            if (errorsCount > 1)
                                message = `Duplicate ${errorsCount} strands`;

                            this.toastr.showToast(message,
                                App.Common.Ui.Toaster.ToastType.Error,
                                App.Common.Ui.Toaster.ToastPosition.BottomRight);
                        }
                    })
                    .catch((error) => {
                        this.toastr.showToast('Error has occurred during processing request',
                            App.Common.Ui.Toaster.ToastType.Error,
                            App.Common.Ui.Toaster.ToastPosition.BottomRight);
                    });
            }
        }

        permitProcessFile(): boolean {
            return this.uploadedFile != null;
        }

        processFile(): void {
            let url = '/api/strands/import';
            let data = { file: this.uploadedFile };
            let config: angular.angularFileUpload.IFileUploadConfigFile = {
                data: data,
                url: url,
                method: 'POST'
            };
            this.uploader.upload<Array<App.Strands.Models.StrandModel>>(config)
                .then((response) => {
                    this.strands = [];
                    for (let i = 0; i < response.data.length; i++) {
                        let strand = response.data[i];
                        strand.Id = i;
                        this.strands.push(strand);
                    }

                    this.gridOptions.data = this.strands;
                })
                .catch((exception) => {
                    if (exception.status === 400) {
                        this.toastr
                            .showToast("Uploaded file has incorrect format. Please check the data or upload another one.",
                            App.Common.Ui.Toaster.ToastType.Error,
                            App.Common.Ui.Toaster.ToastPosition.BottomRight);
                    } else {
                        this.toastr.showToast('Error has occurred during processing request',
                            App.Common.Ui.Toaster.ToastType.Error,
                            App.Common.Ui.Toaster.ToastPosition.BottomRight);
                    }
                });
        }

        deleteStrandModal(strand: App.Strands.Models.StrandModel): void {
            let confirmation = 'Do you wish to remove this strand?';
            this.deleteModalService.deleteConfirmation(confirmation)
                .then((response) => {
                    if (response === 'ok') {
                        this.deleteStrand(strand);
                        let notification = 'Strand was deleted.';
                        this.deleteModalService.deleteCompleted(notification);
                    }
                });
        }

        editStrand(strand): void {
            this.localStorage.set(this.importedStrandsKey, this.strands);
            this.$state.go('createStrand', { strand: strand });
        }

        private deleteStrand(strand: App.Strands.Models.StrandModel): void {
            let index = this.strands.indexOf(strand);
            this.strands.splice(index, 1);
        }
    }

    App.getAppContainer()
        .getSection('app.strands')
        .getInstance()
        .controller('ImportStrandsCtrl', ImportStrandsCtrl);
}