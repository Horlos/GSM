"use strict";
var CreateMaterialRequestController = (function () {
    function CreateMaterialRequestController($scope, selectItemsModal, strandsGridOptions, duplexesGridOptions, materialRequestResource) {
        var _this = this;
        this.$scope = $scope;
        this.selectItemsModal = selectItemsModal;
        this.strandsGridOptions = strandsGridOptions;
        this.duplexesGridOptions = duplexesGridOptions;
        this.materialRequestResource = materialRequestResource;
        this.strandsGridOptions.onRegisterApi = function (gridApi) {
            debugger;
            gridApi.selection.on.rowSelectionChanged(_this.$scope, function (row) {
                // if (row.isSelected) {
                //     scope.selectedAntisenseStrand = row.entity;
                // } else {
                //     scope.selectedAntisenseStrand = {};
                // }
            });
        };
        this.duplexesGridOptions.onRegisterApi = function (gridApi) {
            debugger;
            gridApi.selection.on.rowSelectionChanged(_this.$scope, function (row) { });
        };
    }
    CreateMaterialRequestController.prototype.save = function () {
        var materialRequest = new this.materialRequestResource.resource(this.formData);
        materialRequest.$save(function (susses) { return console.log('saved'); }, function (errors) { return console.log(errors); });
    };
    CreateMaterialRequestController.prototype.addItems = function (name) {
        this.selectItemsModal.open().then(function (list) { });
    };
    CreateMaterialRequestController.$inject = [
        '$scope',
        'selectItemsModal',
        'strandsGridOptions',
        'duplexesGridOptions',
        'materialRequestResource'
    ];
    return CreateMaterialRequestController;
}());
exports.CreateMaterialRequestController = CreateMaterialRequestController;
//# sourceMappingURL=create-material-request.controller.js.map