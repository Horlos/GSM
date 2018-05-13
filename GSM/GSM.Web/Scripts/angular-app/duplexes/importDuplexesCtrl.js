var App;
(function (App) {
    var Duplexes;
    (function (Duplexes) {
        var Controllers;
        (function (Controllers) {
            var ImportDuplexesCtrl = (function () {
                function ImportDuplexesCtrl($window, $state, $stateParams, localStorage, deleteModalService, uploader, duplexesService, toastService) {
                    this.$window = $window;
                    this.$state = $state;
                    this.localStorage = localStorage;
                    this.deleteModalService = deleteModalService;
                    this.uploader = uploader;
                    this.duplexesService = duplexesService;
                    this.toastService = toastService;
                    this.toastr = this.toastService.getToastServiceInstance();
                    this.importedDuplexesKey = "importedDuplexes";
                    this.initializeGrid();
                    this.initialize($stateParams);
                }
                ImportDuplexesCtrl.prototype.initialize = function (stateParams) {
                    if (stateParams["duplex"] != null) {
                        var modifiedDuplex = stateParams["duplex"];
                        this.duplexes = this.localStorage.get(this.importedDuplexesKey) || [];
                        var duplex = App.Common.Utils.searchFor(this.duplexes, 'Id', modifiedDuplex.Id);
                        var index = this.duplexes.indexOf(duplex);
                        this.duplexes[index] = modifiedDuplex;
                        this.gridOptions.data = this.duplexes;
                    }
                };
                ImportDuplexesCtrl.prototype.initializeGrid = function () {
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
                                cellTemplate: '<span ng-class="{\'red-highlighting\':grid.appScope.hasErrors(row.entity.Target)}">{{row.entity.Target.Name}}</span>'
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
                                cellTemplate: '<span ng-class="{\'red-highlighting\':grid.appScope.hasErrors(row.entity.AntiSenseStrand)}">{{row.entity.AntiSenseStrand.ArrowheadStrandId}}</span>'
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
                                cellTemplate: '<span ng-class="{\'red-highlighting\':grid.appScope.hasErrors(row.entity.SenseStrand)}">{{row.entity.SenseStrand.ArrowheadStrandId}}</span>'
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
                                cellTemplate: '<a class="delete-duplex" ng-click="grid.appScope.deleteDuplexModal(row.entity)">Delete</a>'
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
                        onRegisterApi: function (gridApi) {
                        }
                    };
                };
                ImportDuplexesCtrl.prototype.hasErrors = function (target) {
                    return target.HasErrors;
                };
                ImportDuplexesCtrl.prototype.uploadFile = function (file, errFiles) {
                    if (file) {
                        this.uploadedFile = file;
                    }
                    else if (errFiles.length > 0) {
                        this.toastr.showToast("File was not uploaded. Try to choose another file.", App.Common.Ui.Toaster.ToastType.Error, App.Common.Ui.Toaster.ToastPosition.BottomRight);
                    }
                };
                ImportDuplexesCtrl.prototype.permitProcessFile = function () {
                    return this.uploadedFile != null;
                };
                ImportDuplexesCtrl.prototype.permitImport = function () {
                    if (angular.isDefined(this.duplexes)) {
                        return this.duplexes.every(function (duplex) {
                            return !duplex.Target.HasErrors &&
                                !duplex.SenseStrand.HasErrors &&
                                !duplex.AntiSenseStrand.HasErrors;
                        });
                    }
                    return false;
                };
                ImportDuplexesCtrl.prototype.importDuplexes = function () {
                    var _this = this;
                    if (this.permitImport()) {
                        this.localStorage.remove(this.importedDuplexesKey);
                        this.duplexesService.createDuplexes(this.duplexes)
                            .then(function (data) {
                            _this.gridOptions.data = data;
                            var errorsCount = 0;
                            for (var i = 0; i < data.length; i++) {
                                if (data[i].HasErrors) {
                                    errorsCount++;
                                }
                            }
                            if (errorsCount < 1) {
                                _this.duplexes = [];
                                _this.gridOptions.data = _this.duplexes;
                                _this.uploadedFile = {};
                                _this.toastr.showToast("Duplexes was successfully created", App.Common.Ui.Toaster.ToastType.Success, App.Common.Ui.Toaster.ToastPosition.BottomRight);
                            }
                            else {
                                var message = 'Duplicate duplex';
                                if (errorsCount > 1)
                                    message = "Duplicate " + errorsCount + " duplexes";
                                _this.toastr.showToast(message, App.Common.Ui.Toaster.ToastType.Error, App.Common.Ui.Toaster.ToastPosition.BottomRight);
                            }
                        })
                            .catch(function (error) {
                            _this.toastr.showToast("Error has occurred during processing request", App.Common.Ui.Toaster.ToastType.Error, App.Common.Ui.Toaster.ToastPosition.BottomRight);
                        });
                    }
                };
                ImportDuplexesCtrl.prototype.processFile = function () {
                    var _this = this;
                    var url = '/api/duplexes/import';
                    var data = { file: this.uploadedFile };
                    var config = {
                        data: data,
                        url: url,
                        method: 'POST'
                    };
                    this.uploader.upload(config)
                        .then(function (response) {
                        _this.duplexes = [];
                        for (var i = 0; i < response.data.length; i++) {
                            var duplex = response.data[i];
                            duplex.Id = i;
                            _this.duplexes.push(duplex);
                        }
                        _this.gridOptions.data = _this.duplexes;
                    })
                        .catch(function (exception) {
                        if (exception.status === 400) {
                            _this.toastr
                                .showToast("Uploaded file has incorrect format. Please check the data or upload another one.", App.Common.Ui.Toaster.ToastType.Error, App.Common.Ui.Toaster.ToastPosition.BottomRight);
                        }
                        else {
                            _this.toastr.showToast("Error has occurred during processing request", App.Common.Ui.Toaster.ToastType.Error, App.Common.Ui.Toaster.ToastPosition.BottomRight);
                        }
                    });
                };
                ImportDuplexesCtrl.prototype.deleteDuplexModal = function (duplex) {
                    var _this = this;
                    var confirmation = 'Do you wish to remove this duplex?';
                    this.deleteModalService.deleteConfirmation(confirmation)
                        .then(function (response) {
                        if (response === 'ok') {
                            _this.deleteDuplex(duplex);
                            var notification = 'Duplex was deleted.';
                            _this.deleteModalService.deleteCompleted(notification);
                        }
                    });
                };
                ImportDuplexesCtrl.prototype.editDuplex = function (duplex) {
                    this.localStorage.set(this.importedDuplexesKey, this.duplexes);
                    this.$state.go('editImportedDuplex', { duplex: duplex });
                };
                ImportDuplexesCtrl.prototype.deleteDuplex = function (duplex) {
                    var index = this.duplexes.indexOf(duplex);
                    this.duplexes.splice(index, 1);
                };
                ImportDuplexesCtrl.$inject = ['$window', '$state', '$stateParams', 'localStorageService', 'deleteModalService', 'Upload', 'duplexesService', 'toastService'];
                return ImportDuplexesCtrl;
            }());
            App.getAppContainer()
                .getSection('app.duplexes')
                .getInstance()
                .controller('ImportDuplexesCtrl', ImportDuplexesCtrl);
        })(Controllers = Duplexes.Controllers || (Duplexes.Controllers = {}));
    })(Duplexes = App.Duplexes || (App.Duplexes = {}));
})(App || (App = {}));
//# sourceMappingURL=importDuplexesCtrl.js.map