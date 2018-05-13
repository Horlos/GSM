var App;
(function (App) {
    var ModStructures;
    (function (ModStructures) {
        var Controllers;
        (function (Controllers) {
            var CreateModStructureCtrl = (function () {
                function CreateModStructureCtrl($scope, $window, $q, uploader, modStructuresService, lookupService, toastService) {
                    this.$scope = $scope;
                    this.$window = $window;
                    this.$q = $q;
                    this.uploader = uploader;
                    this.modStructuresService = modStructuresService;
                    this.lookupService = lookupService;
                    this.toastService = toastService;
                    this.maxFileUploadSize = 28.6; // IIS7 default max file upload size is 28.6MB
                    this.initialize();
                    this.loadModStructuresTypes();
                    this.loadInstruments();
                }
                CreateModStructureCtrl.prototype.initialize = function () {
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
                };
                CreateModStructureCtrl.prototype.loadModStructuresTypes = function () {
                    var _this = this;
                    this.lookupService.getTable("ModStructureTypes")
                        .then(function (data) {
                        _this.availableModStructureTypes = data.ModStructureTypes;
                    });
                };
                CreateModStructureCtrl.prototype.loadInstruments = function () {
                    var _this = this;
                    this.lookupService.getTable("Instruments")
                        .then(function (data) {
                        var instrumentModStructures = [];
                        angular.forEach(data.Instruments, function (item) {
                            _this.availableInstruments.push({
                                Id: item.Id,
                                Name: item.Name
                            });
                            instrumentModStructures.push({
                                InstrumentId: item.Id,
                                Code: ''
                            });
                        });
                        _this.modStructure.InstrumentModStructures = instrumentModStructures;
                    });
                };
                CreateModStructureCtrl.prototype.getInstrumentName = function (instrumentId) {
                    var instrument = this.availableInstruments.filter(function (instrument) {
                        return instrument.Id === instrumentId;
                    });
                    if (instrument.length > 0)
                        return instrument[0].Name;
                    return "";
                };
                CreateModStructureCtrl.prototype.permitSubmit = function () {
                    return this.$scope.form.$valid;
                };
                CreateModStructureCtrl.prototype.submit = function () {
                    var _this = this;
                    if (this.permitSubmit()) {
                        this.modStructure.ModStructureTypeId = this.modStructure.ModStructureType.Id;
                        this.modStructuresService.createModStructure(this.modStructure)
                            .then(function (response) {
                            if (response.HasErrors) {
                                _this.modStructure.Error = response.Errors;
                                _this.$scope.form.$setPristine();
                            }
                            else {
                                var modStructureId = response.Id;
                                if (_this.uploadedFiles.length > 0) {
                                    _this.modStructure.Id = modStructureId;
                                    _this.saveAttachments();
                                }
                                else {
                                    _this.$window.location.href = '/ModStructure/Edit/' + modStructureId;
                                }
                            }
                        });
                    }
                };
                CreateModStructureCtrl.prototype.cancelChanges = function () {
                    this.$window.location.href = '/ModStructures';
                };
                CreateModStructureCtrl.prototype.uploadFiles = function (files, errFiles) {
                    var _this = this;
                    angular.forEach(files, function (file) {
                        if (file.size < _this.maxFileUploadSize * 1024 * 1024) {
                            _this.modStructure.Attachments.push({ FileName: file.name });
                            _this.uploadedFiles.push(file);
                        }
                        else {
                            _this.toastr.showToast('Max file upload size of ' + _this.maxFileUploadSize + 'MB exceeded.', App.Common.Ui.Toaster.ToastType.Error, App.Common.Ui.Toaster.ToastPosition.BottomRight);
                        }
                    });
                };
                CreateModStructureCtrl.prototype.saveAttachments = function () {
                    var _this = this;
                    var promises = [];
                    angular.forEach(this.uploadedFiles, function (file) {
                        var uploadConfig = {
                            method: 'POST',
                            url: '/api/modstructures/attachment/' + _this.modStructure.Id,
                            data: { file: file }
                        };
                        var promise = _this.uploader.upload(uploadConfig);
                        promise.then(function (response) {
                            //$timeout(() => {
                            //    file.result = response.data;
                            //});
                        }, function (response) {
                            if (response.status > 0) {
                                _this.toastr.showToast('Error has occurred during processing request', App.Common.Ui.Toaster.ToastType.Error, App.Common.Ui.Toaster.ToastPosition.BottomRight);
                            }
                        });
                        promises.push(promise);
                    });
                    this.$q.all(promises)
                        .then(function () {
                        _this.$window.location.href = '/ModStructure/Edit/' + _this.modStructure.Id;
                    });
                };
                CreateModStructureCtrl.prototype.deleleAttachment = function (item) {
                    var index = this.modStructure.Attachments.indexOf(item);
                    if (index > -1) {
                        this.modStructure.Attachments.splice(index, 1);
                    }
                    ;
                };
                CreateModStructureCtrl.$inject = ['$scope', '$window', '$q', 'Upload', 'modStructuresService', 'lookupService', 'toastService'];
                return CreateModStructureCtrl;
            }());
            App.getAppContainer()
                .getSection('app.modStructures')
                .getInstance()
                .controller('CreateModStructureCtrl', CreateModStructureCtrl);
        })(Controllers = ModStructures.Controllers || (ModStructures.Controllers = {}));
    })(ModStructures = App.ModStructures || (App.ModStructures = {}));
})(App || (App = {}));
//# sourceMappingURL=createModStructureCtrl.js.map