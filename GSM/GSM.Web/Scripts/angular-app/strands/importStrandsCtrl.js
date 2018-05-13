var App;
(function (App) {
    var Strands;
    (function (Strands) {
        var Controllers;
        (function (Controllers) {
            var ImportStrandsCtrl = (function () {
                function ImportStrandsCtrl($window, $state, $stateParams, localStorage, deleteModalService, uploader, strandsServcie, toastService) {
                    this.$window = $window;
                    this.$state = $state;
                    this.localStorage = localStorage;
                    this.deleteModalService = deleteModalService;
                    this.uploader = uploader;
                    this.strandsServcie = strandsServcie;
                    this.toastService = toastService;
                    this.toastr = this.toastService.getToastServiceInstance();
                    this.importedStrandsKey = "importedStrands";
                    this.initializeGrid();
                    this.initialize($stateParams);
                }
                ImportStrandsCtrl.prototype.initialize = function (stateParams) {
                    if (stateParams["strand"] != null) {
                        var modifiedStrand = stateParams["strand"];
                        this.strands = this.localStorage.get(this.importedStrandsKey) || [];
                        var strand = App.Common.Utils.searchFor(this.strands, 'Id', modifiedStrand.Id);
                        var index = this.strands.indexOf(strand);
                        this.strands[index] = modifiedStrand;
                        this.gridOptions.data = this.strands;
                    }
                };
                ImportStrandsCtrl.prototype.initializeGrid = function () {
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
                                width: '20%',
                                cellTemplate: '<span ng-repeat="structure in row.entity.StrandModStructures track by $index" ng-class="{\'red-highlighting\': grid.appScope.hasErrors(structure.ModStructure)}">{{structure.ModStructure.Name}}</span>'
                            },
                            {
                                name: 'Target',
                                field: 'Target',
                                visible: true,
                                cellClass: 'table-cell',
                                cellTemplate: '<span ng-class="{\'red-highlighting\':grid.appScope.hasErrors(row.entity.Target)}">{{row.entity.Target.Name}}</span>'
                            },
                            {
                                name: 'Orientation',
                                field: 'Orientation',
                                visible: true,
                                cellClass: 'table-cell',
                                cellTemplate: '<span ng-class="{\'red-highlighting\':grid.appScope.hasErrors(row.entity.Orientation)}">{{row.entity.Orientation.Name}}</span>'
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
                                cellTemplate: '<a class="delete-strand" ng-click="grid.appScope.deleteStrandModal(row.entity)">Delete</a>'
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
                        onRegisterApi: function (gridApi) {
                        }
                    };
                };
                ImportStrandsCtrl.prototype.hasErrors = function (target) {
                    return target.HasErrors;
                };
                ImportStrandsCtrl.prototype.uploadFile = function (file, errFiles) {
                    if (file) {
                        this.uploadedFile = file;
                    }
                    else if (errFiles.length > 0) {
                        this.toastr.showToast("File was not uploaded. Try to choose another file.", App.Common.Ui.Toaster.ToastType.Error, App.Common.Ui.Toaster.ToastPosition.BottomRight);
                    }
                };
                ImportStrandsCtrl.prototype.permitImport = function () {
                    if (angular.isDefined(this.strands)) {
                        return this.strands.every(function (strand) {
                            return strand.StrandModStructures.every(function (structure) {
                                return !structure.ModStructure.HasErrors;
                            }) &&
                                !strand.Orientation.HasErrors &&
                                !strand.Target.HasErrors;
                        });
                    }
                    return false;
                };
                ImportStrandsCtrl.prototype.importStrands = function () {
                    var _this = this;
                    if (this.permitImport()) {
                        this.localStorage.remove(this.importedStrandsKey);
                        this.strandsServcie.createStrands(this.strands)
                            .then(function (data) {
                            _this.gridOptions.data = data;
                            var errorsCount = 0;
                            for (var i = 0; i < data.length; i++) {
                                if (data[i].HasErrors) {
                                    errorsCount++;
                                }
                            }
                            if (errorsCount < 1) {
                                _this.strands = [];
                                _this.gridOptions.data = _this.strands;
                                _this.uploadedFile = {};
                                _this.toastr.showToast("Strands was successfully created", App.Common.Ui.Toaster.ToastType.Success, App.Common.Ui.Toaster.ToastPosition.BottomRight);
                            }
                            else {
                                var message = 'Duplicate strand';
                                if (errorsCount > 1)
                                    message = "Duplicate " + errorsCount + " strands";
                                _this.toastr.showToast(message, App.Common.Ui.Toaster.ToastType.Error, App.Common.Ui.Toaster.ToastPosition.BottomRight);
                            }
                        })
                            .catch(function (error) {
                            _this.toastr.showToast('Error has occurred during processing request', App.Common.Ui.Toaster.ToastType.Error, App.Common.Ui.Toaster.ToastPosition.BottomRight);
                        });
                    }
                };
                ImportStrandsCtrl.prototype.permitProcessFile = function () {
                    return this.uploadedFile != null;
                };
                ImportStrandsCtrl.prototype.processFile = function () {
                    var _this = this;
                    var url = '/api/strands/import';
                    var data = { file: this.uploadedFile };
                    var config = {
                        data: data,
                        url: url,
                        method: 'POST'
                    };
                    this.uploader.upload(config)
                        .then(function (response) {
                        _this.strands = [];
                        for (var i = 0; i < response.data.length; i++) {
                            var strand = response.data[i];
                            strand.Id = i;
                            _this.strands.push(strand);
                        }
                        _this.gridOptions.data = _this.strands;
                    })
                        .catch(function (exception) {
                        if (exception.status === 400) {
                            _this.toastr
                                .showToast("Uploaded file has incorrect format. Please check the data or upload another one.", App.Common.Ui.Toaster.ToastType.Error, App.Common.Ui.Toaster.ToastPosition.BottomRight);
                        }
                        else {
                            _this.toastr.showToast('Error has occurred during processing request', App.Common.Ui.Toaster.ToastType.Error, App.Common.Ui.Toaster.ToastPosition.BottomRight);
                        }
                    });
                };
                ImportStrandsCtrl.prototype.deleteStrandModal = function (strand) {
                    var _this = this;
                    var confirmation = 'Do you wish to remove this strand?';
                    this.deleteModalService.deleteConfirmation(confirmation)
                        .then(function (response) {
                        if (response === 'ok') {
                            _this.deleteStrand(strand);
                            var notification = 'Strand was deleted.';
                            _this.deleteModalService.deleteCompleted(notification);
                        }
                    });
                };
                ImportStrandsCtrl.prototype.editStrand = function (strand) {
                    this.localStorage.set(this.importedStrandsKey, this.strands);
                    this.$state.go('createStrand', { strand: strand });
                };
                ImportStrandsCtrl.prototype.deleteStrand = function (strand) {
                    var index = this.strands.indexOf(strand);
                    this.strands.splice(index, 1);
                };
                ImportStrandsCtrl.$inject = [
                    '$window', '$state', '$stateParams', 'localStorageService', 'deleteModalService', 'Upload', 'strandsService', 'toastService'
                ];
                return ImportStrandsCtrl;
            }());
            App.getAppContainer()
                .getSection('app.strands')
                .getInstance()
                .controller('ImportStrandsCtrl', ImportStrandsCtrl);
        })(Controllers = Strands.Controllers || (Strands.Controllers = {}));
    })(Strands = App.Strands || (App.Strands = {}));
})(App || (App = {}));
//# sourceMappingURL=importStrandsCtrl.js.map