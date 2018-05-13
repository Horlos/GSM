var App;
(function (App) {
    var ModStructures;
    (function (ModStructures) {
        var Controllers;
        (function (Controllers) {
            var EditModStructureCtrl = (function () {
                function EditModStructureCtrl($scope, $window, $location, $q, $uibModal, deleteModalService, uploader, modStructuresService, lookupService, toastService) {
                    this.$scope = $scope;
                    this.$window = $window;
                    this.$location = $location;
                    this.$q = $q;
                    this.$uibModal = $uibModal;
                    this.deleteModalService = deleteModalService;
                    this.uploader = uploader;
                    this.modStructuresService = modStructuresService;
                    this.lookupService = lookupService;
                    this.toastService = toastService;
                    this.maxFileUploadSize = 28.6; // IIS7 default max file upload size is 28.6MB
                    this.initialize();
                    var modStructureId = +App.Common.Utils.lastUrlParam(this.$location.absUrl());
                    this.loadModStructureData(modStructureId);
                }
                EditModStructureCtrl.prototype.initialize = function () {
                    this.editMode = false;
                    this.availableModStructureTypes = [];
                    this.availableInstruments = [];
                    this.uploadedFiles = [];
                    this.toastr = this.toastService.getToastServiceInstance();
                };
                EditModStructureCtrl.prototype.loadModStructureData = function (modStructureId) {
                    var _this = this;
                    this.modStructuresService.getModStructureById(modStructureId)
                        .then(function (data) {
                        _this.modStructure = data;
                        _this.modStructure.Attachments = data.Attachments || [];
                        _this.modStructure.InstrumentModStructures = data.InstrumentModStructures || [];
                        _this.loadLookupData();
                    });
                };
                EditModStructureCtrl.prototype.permitSubmit = function () {
                    return this.$scope.form.$valid;
                };
                EditModStructureCtrl.prototype.submit = function () {
                    if (this.permitSubmit()) {
                        if (this.modStructure.HasAssociations && this.isModStructureChanged()) {
                            this.showUpdateModal();
                        }
                        else {
                            this.updateModStructure();
                        }
                    }
                };
                EditModStructureCtrl.prototype.cancelChanges = function () {
                    var modStructureId = this.modStructure.Id;
                    this.loadModStructureData(modStructureId);
                    this.$scope.form.$setPristine();
                    this.editMode = false;
                };
                EditModStructureCtrl.prototype.pageMode = function () {
                    if (this.editMode) {
                        return "View";
                    }
                    else {
                        return "Edit";
                    }
                };
                EditModStructureCtrl.prototype.permitView = function () {
                    return this.$scope.form.$dirty;
                };
                EditModStructureCtrl.prototype.viewModeChange = function () {
                    this.editMode = !this.editMode;
                };
                EditModStructureCtrl.prototype.showDeleteModal = function () {
                    var _this = this;
                    var confirmation = 'Do you wish to remove this mod structure ' + this.modStructure.Name + '?';
                    this.deleteModalService.deleteConfirmation(confirmation)
                        .then(function (response) {
                        if (response === 'ok') {
                            _this.deleteModStructure();
                        }
                    });
                };
                EditModStructureCtrl.prototype.showUpdateModal = function () {
                    var _this = this;
                    var config = {
                        templateUrl: '/Scripts/angular-app/widgets/confirmationModal.html',
                        controller: 'ConfirmModalCtrl',
                        controllerAs: 'vm',
                        size: 'md',
                        resolve: {
                            confirmModalConfig: function () {
                                return {
                                    confirmationMessage: '<div>' +
                                        ' <p> Changes to any of the following fields requires manually updating any strands that contain this Mod Structure:</p>' +
                                        '<ul><li>Starting Material MW</li>' +
                                        '<li> Incorporated MW </li>' +
                                        '<li> Mod Structure Name</li>' +
                                        '<li> Base </li>' +
                                        '</ul><p> Continue save? </p></div>',
                                    title: "Update Mod Structure"
                                };
                            }
                        }
                    };
                    var modalInstance = this.$uibModal.open(config);
                    modalInstance.result.then(function (result) {
                        if (result === 'ok') {
                            _this.updateModStructure();
                        }
                    });
                };
                EditModStructureCtrl.prototype.permitDeletion = function () {
                    if (this.modStructure) {
                        return !this.modStructure.HasAssociations;
                    }
                    return false;
                };
                EditModStructureCtrl.prototype.deleteModStructure = function () {
                    var _this = this;
                    this.modStructuresService.deleteModStructure(this.modStructure.Id)
                        .then(function () {
                        var notification = 'Mod structure ' + _this.modStructure.Name + ' was deleted.';
                        _this.deleteModalService.deleteCompleted(notification)
                            .then(function () {
                            return _this.$window.location.href = '/ModStructure/';
                        });
                    });
                };
                EditModStructureCtrl.prototype.loadLookupData = function () {
                    var _this = this;
                    this.getModStructuresTypes()
                        .then(function (data) {
                        _this.availableModStructureTypes = data.ModStructureTypes;
                    });
                    this.getInstruments()
                        .then(function (data) {
                        _this.availableInstruments = data.Instruments.map(function (item) {
                            return {
                                Id: item.Id,
                                Name: item.Name
                            };
                        });
                        for (var i = 0; i < data.Instruments.length; i++) {
                            var existingInstrument = App.Common.Utils
                                .searchFor(_this.modStructure.InstrumentModStructures, 'InstrumentId', data.Instruments[i].Id);
                            if (existingInstrument == null) {
                                _this.modStructure.InstrumentModStructures.push({
                                    InstrumentId: data.Instruments[i].Id,
                                    ModStructureId: _this.modStructure.Id,
                                    Code: ''
                                });
                            }
                        }
                    });
                };
                EditModStructureCtrl.prototype.getModStructuresTypes = function () {
                    return this.lookupService.getTable("ModStructureTypes");
                };
                EditModStructureCtrl.prototype.getInstruments = function () {
                    return this.lookupService.getTable("Instruments");
                };
                EditModStructureCtrl.prototype.getInstrumentName = function (instrumentId) {
                    var instrument = this.availableInstruments.filter(function (instrument) {
                        return instrument.Id === instrumentId;
                    });
                    if (instrument.length > 0)
                        return instrument[0].Name;
                    return "";
                };
                EditModStructureCtrl.prototype.uploadFiles = function (files, errFiles) {
                    var _this = this;
                    angular.forEach(files, function (file) {
                        if (file.size < _this.maxFileUploadSize * 1024 * 1024) {
                            _this.modStructure.Attachments.push({
                                FileName: file.name,
                                ModStructureId: _this.modStructure.Id
                            });
                            _this.uploadedFiles.push(file);
                        }
                        else {
                            _this.toastr.showToast('Max file upload size of ' + _this.maxFileUploadSize + 'MB exceeded.', App.Common.Ui.Toaster.ToastType.Error, App.Common.Ui.Toaster.ToastPosition.BottomRight);
                        }
                    });
                };
                EditModStructureCtrl.prototype.saveAttachments = function () {
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
                ;
                EditModStructureCtrl.prototype.deleleAttachment = function (item) {
                    var index = this.modStructure.Attachments.indexOf(item);
                    if (index > -1) {
                        this.modStructure.Attachments.splice(index, 1);
                    }
                    ;
                };
                ;
                EditModStructureCtrl.prototype.isModStructureChanged = function () {
                    return this.$scope.form['starting-material-weight'].$dirty ||
                        this.$scope.form['incorporated-weight'].$dirty ||
                        this.$scope.form['mod-structure-name'].$dirty ||
                        this.$scope.form['base'].$dirty;
                };
                EditModStructureCtrl.prototype.updateModStructure = function () {
                    var _this = this;
                    var modStructureId = this.modStructure.Id;
                    this.modStructure.ModStructureTypeId = this.modStructure.ModStructureType.Id;
                    this.modStructuresService.updateModStructure(modStructureId, this.modStructure)
                        .then(function (data) {
                        if (data.HasErrors) {
                            _this.modStructure.Error = data.Errors;
                        }
                        else {
                            if (_this.uploadedFiles.length > 0) {
                                _this.saveAttachments();
                            }
                            else {
                                _this.$window.location.href = '/ModStructure/Edit/' + data.Id;
                            }
                        }
                    });
                };
                EditModStructureCtrl.$inject = [
                    '$scope', '$window', '$location', '$q', '$uibModal', 'deleteModalService', 'Upload', 'modStructuresService',
                    'lookupService', 'toastService'
                ];
                return EditModStructureCtrl;
            }());
            App.getAppContainer()
                .getSection('app.modStructures')
                .getInstance()
                .controller('EditModStructureCtrl', EditModStructureCtrl);
        })(Controllers = ModStructures.Controllers || (ModStructures.Controllers = {}));
    })(ModStructures = App.ModStructures || (App.ModStructures = {}));
})(App || (App = {}));
//# sourceMappingURL=editModStructureCtrl.js.map