import {CreateMaterialRequestController} from './create-material-request.controller';
import {SelectItemsModal} from "./select-items.modal";
import {MaterialRequestResource} from "./material-request.resource";

angular.module('materialRequestApp', [
        'ngResource',
        'ui.bootstrap',
        'ui.grid',
        'ui.grid.selection'
    ])
    .value('strandsGridOptions', {
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        enableColumnMenus: false,
        enableHorizontalScrollbar: 0,
        multiSelect: false,
        columnDefs: [
            {name: 'ArrowheadStrandID', displayName: 'Strand ID'},
            {name: 'Target.Name', displayName: 'Target'}
        ],
    })
    .value('duplexesGridOptions', {
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        enableColumnMenus: false,
        enableHorizontalScrollbar: 0,
        multiSelect: false,
        columnDefs: [
            {name: 'ArrowheadStrandID', displayName: 'Strand ID'},
            {name: 'Target.Name', displayName: 'Target'}
        ],
    })
    .service('materialRequestResource', MaterialRequestResource)
    .service('selectItemsModal', SelectItemsModal)
    .controller('createMaterialRequestController', CreateMaterialRequestController);
