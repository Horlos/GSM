"use strict";
var create_material_request_controller_1 = require('./create-material-request.controller');
var select_items_modal_1 = require("./select-items.modal");
var material_request_resource_1 = require("./material-request.resource");
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
        { name: 'ArrowheadStrandID', displayName: 'Strand ID' },
        { name: 'Target.Name', displayName: 'Target' }
    ],
})
    .value('duplexesGridOptions', {
    enableRowSelection: true,
    enableRowHeaderSelection: false,
    enableColumnMenus: false,
    enableHorizontalScrollbar: 0,
    multiSelect: false,
    columnDefs: [
        { name: 'ArrowheadStrandID', displayName: 'Strand ID' },
        { name: 'Target.Name', displayName: 'Target' }
    ],
})
    .service('materialRequestResource', material_request_resource_1.MaterialRequestResource)
    .service('selectItemsModal', select_items_modal_1.SelectItemsModal)
    .controller('createMaterialRequestController', create_material_request_controller_1.CreateMaterialRequestController);
//# sourceMappingURL=app.module.js.map