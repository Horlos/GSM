import {IScope, IFormController} from 'angular';
import {IGridOptions, IGridApi} from 'angular-ui-grid';
import {IMaterialRequestModel} from './material-request.model';
import IModalService = angular.ui.bootstrap.IModalService;
import {SelectItemsModal} from "./select-items.modal";
import {MaterialRequestResource} from "./material-request.resource";

export class CreateMaterialRequestController {
    createForm:IFormController;
    formData:IMaterialRequestModel;

    static $inject:string[] = [
        '$scope',
        'selectItemsModal',
        'strandsGridOptions',
        'duplexesGridOptions',
        'materialRequestResource'
    ];

    constructor(
        private $scope:IScope, 
        private selectItemsModal:SelectItemsModal,
        public strandsGridOptions:IGridOptions,
        public duplexesGridOptions:IGridOptions,
        private materialRequestResource:MaterialRequestResource
    ) {
        this.strandsGridOptions.onRegisterApi = (gridApi:IGridApi) => { debugger
            gridApi.selection.on.rowSelectionChanged(this.$scope, (row) => {
                // if (row.isSelected) {
                //     scope.selectedAntisenseStrand = row.entity;
                // } else {
                //     scope.selectedAntisenseStrand = {};
                // }
            });
        };

        this.duplexesGridOptions.onRegisterApi = (gridApi:IGridApi) => { debugger
            gridApi.selection.on.rowSelectionChanged(this.$scope, (row) => {});
        };
    }

    save() {
        let materialRequest = new this.materialRequestResource.resource(this.formData);
        materialRequest.$save(
            (susses) => console.log('saved'),
            (errors) => console.log(errors)
        );
    }

    addItems(name:string) {
        this.selectItemsModal.open().then((list: any[]) => {});
    }
}
