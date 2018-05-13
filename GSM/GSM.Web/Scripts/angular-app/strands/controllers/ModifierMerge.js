var app = angular.module('modifierMergeApp', ['ngResource', 'ui.bootstrap.contextMenu', 'ui.bootstrap', 'ui.grid', 'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.grid.selection', 'ui.grid.autoFitColumns']);

app.factory('lookupResource', ['$resource', function (resource) {
    return resource('/api/lookup',
        {
            'table': ['ModStructures']
        }
    );
}]);

app.factory('strandResource', ['$resource', function (resource) {
    return resource('/api/strands', null, {
        'query': { isArray: false }
    });
}]);

app.factory('modifierMergeResource', ['$resource', function (resource) {
    return resource('/api/mergestrand', null,
    {
        'save': {
            method: 'POST',
            isArray: true
        }
    });
}]);

app.factory('modifierTemplateResource', ['$resource', function (resource) {
    return resource('/api/modifiertemplates', null, {
        'query': { isArray: false }
    });
}]);

app.factory('modifierResource', ['$resource', function (resource) {
    return resource('/api/modifiers/:modifierTemplateId/:strandId', { modifierTemplateId: '@modifierTemplateId', strandId: '@strandId' }, { 'query': { isArray: false } });
}]);

var removeTemplate = '<input type="image" src="../../Content/Images/delete_icon.png" style="margin: 5px; width: 60%; height: 60%;" ng-click="grid.appScope.removeRow(row.entity)"/>';
var sequenceTemplate = '<div title="{{row.entity.ErrorDescription}}" ng-class="row.entity.Errors ? \'ui-grid-cell-contents-error\' : \'ui-grid-cell-contents\'">{{COL_FIELD}}</div>';

function ModifierMergeController(scope, window, uibModal, lookupResource, strandResource, modifierResource, modifierMergeResource, modifierTemplateResource) {
    this.scope = scope;
    this.window = window;
    this.uibModal = uibModal;
    this.lookupResource = lookupResource;
    this.strandResource = strandResource;
    this.modifierResource = modifierResource;
    this.modifierMergeResource = modifierMergeResource;
    this.modifierTemplateResource = modifierTemplateResource;
    scope.selectedSequence = {};
    scope.selectedStrand = {};
    scope.availableModStructures = [];
    scope.chosenModStructures = [];
    scope.queuedMergedItens = [];
    scope.menuOptions = [
        ['Set As First', function ($itemScope) {
            $itemScope.$parent.selectedSequence.FirstPosition = $itemScope.mod.OrdinalPosition;
        }, function ($itemScope) {
            if ($itemScope.mod.Name == undefined) {
                return null;
            }
            return $itemScope.mod != null;
        }],
        ['Delete', function ($itemScope) {
            var index = $itemScope.$parent.chosenModStructures.indexOf($itemScope.mod);
            if (index != -1) {
                $itemScope.$parent.chosenModStructures.splice(index, 1);
                $itemScope.$parent.rebuildSelectedSequence();
            }
        }, function ($itemScope) {
            if ($itemScope.mod.OrdinalPosition == $itemScope.$parent.selectedSequence.FirstPosition) {
                return null;
            }
            return $itemScope.mod != null;
        }],
        ['Insert', function ($itemScope) {
            var index = $itemScope.$parent.chosenModStructures.indexOf($itemScope.mod);
            if (index != -1) {
                $itemScope.$parent.chosenModStructures.splice(index, 0, { Base: '', Name: '' });
            }
        }, function ($itemScope) {
            if ($itemScope.mod.Name == undefined) {
                return null;
            }
            return $itemScope.mod != null;
        }]
    ];
    scope.selectedSequences = {
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        enableColumnMenus: false,
        enableHorizontalScrollbar: 2,
        multiSelect: false,
        columnDefs: [
            {
                name: 'StrandID',
                displayName: 'Strand ID',
                field: 'ArrowheadStrandId'
            },
            {
                name: 'Sequence',
                displayName: 'Sequence',
                field: 'Sequence'
            },
            {
                name: 'Target',
                displayName: 'Target',
                field: 'Target.Name'
            },
            {
                name: 'Orientation',
                displayName: 'Orientation',
                field: 'Orientation.Name'
            }
        ],
        onRegisterApi: function (gridApi) {
            scope.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged(scope,
                function (row) {
                    if (row.isSelected) {
                        scope.selectedStrand = row.entity;
                    } else {
                        scope.selectedStrand = {};
                    }
                });
        }
    };
    scope.selectedModifierTemplate = {};
    scope.selectedModifierTemplates = {
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        enableColumnMenus: false,
        enableHorizontalScrollbar: 0,
        multiSelect: false,
        columnDefs: [
          { name: 'Name' }
        ],
        onRegisterApi: function (gridApi) {
            scope.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged(scope, function (row) {
                if (row.isSelected) {
                    scope.selectedModifierTemplate = row.entity;
                } else {
                    scope.selectedModifierTemplate = {};
                }
            });
        }
    };
    scope.mergeResults = {
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        enableColumnMenus: false,
        multiSelect: false,
        enableHorizontalScrollbar: 0,
        columnDefs: [
            {
                name: 'Sequence',
                cellTemplate: sequenceTemplate,
                field: 'Sequence'
            },
            {
                name: 'TemplateName',
                displayName: 'Mod Template',
                field: 'TemplateName'
            },
            {
                displayName: '',
                name: 'Delete',
                cellTemplate: removeTemplate,
                width: 30,
                resizable: false
            },
            {
                name: 'SequenceWithDelimiter',
                visible: false,
                field: 'SequenceWithDelimiter'
            },
            {
                name: 'FirstPosition',
                visible: false,
                field: 'FirstPosition'
            },
            {
                name: 'FromStrandId',
                visible: false,
                field: 'FromStrandId'
            },
            {
                name: 'Errors',
                visible: false,
                field: 'Errors'
            }
        ],
        onRegisterApi: function (gridApi) {
            scope.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged(scope,
                function (row) {
                    if (row.isSelected) {
                        scope.selectedSequence = row.entity;
                    } else {
                        scope.selectedSequence = {};
                    }
                    scope.buildModStructures();
                });
        }
    };

    scope.addSequenceModal = angular.bind(this, this.addSequenceModal);
    scope.addModifierTemplateModal = angular.bind(this, this.addModifierTemplateModal);
    scope.permitImport = angular.bind(this, this.permitImport);
    scope.removeSelectedSequence = angular.bind(this, this.removeSelectedSequence);
    scope.removeSelectedModifierTemplate = angular.bind(this, this.removeSelectedModifierTemplate);
    scope.applyModifierTemplateCompleted = angular.bind(this, this.applyModifierTemplateCompleted);
    scope.buildChosenModStructuresFromTemplate = angular.bind(this, this.buildChosenModStructuresFromTemplate);
    scope.performMerge = angular.bind(this, this.performMerge);
    scope.queueMergeedItems = angular.bind(this, this.queueMergeedItems);
    scope.onLoadLookupCompleted = angular.bind(this, this.onLoadLookupCompleted);
    scope.modifiedSequence = angular.bind(this, this.modifiedSequence);
    scope.modifiedSequenceWithDelimiter = angular.bind(this, this.modifiedSequenceWithDelimiter);
    scope.rebuildSelectedSequence = angular.bind(this, this.rebuildSelectedSequence);
    scope.changeInModStructure = angular.bind(this, this.changeInModStructure);
    scope.buildModStructures = angular.bind(this, this.buildModStructures);
    scope.prependModifier = angular.bind(this, this.prependModifier);
    scope.appendModifier = angular.bind(this, this.appendModifier);
    scope.reCalcPositions = angular.bind(this, this.reCalcPositions);
    scope.importMergedItems = angular.bind(this, this.importMergedItems);
    scope.removeRow = angular.bind(this, this.removeRow);
    scope.onSaveCompleted = angular.bind(this, this.onSaveCompleted);
    this.loadLookupData();
}

ModifierMergeController.prototype.removeRow = function (entity) {
    var index = this.scope.mergeResults.data.indexOf(entity);
    this.scope.mergeResults.data.splice(index, 1);
    this.scope.selectedSequence = {};
    this.scope.chosenModStructures = [];
};

ModifierMergeController.prototype.importMergedItems = function () {
   
    var mergedStrands = [];
    for (var j = 0; j < this.scope.mergeResults.data.length; j++) {
        var strandModStructures = [];
        for (var k = 0; k < this.scope.mergeResults.data[j].SequenceWithDelimiter.length; k++) {
            var modStructure = SearchFor(this.scope.availableModStructures, 'Name', this.scope.mergeResults.data[j].SequenceWithDelimiter[k]);
            strandModStructures.push({
                OrdinalPosition: k + 1,
                ModStructureId: modStructure.Id
            });
        }
        var strand = {};
        strand.Id = this.scope.mergeResults.data[j].FromStrandId;
        strand.FirstPosition = this.scope.mergeResults.data[j].FirstPosition;
        strand.StrandModStructures = strandModStructures;
        strand.Sequence = this.scope.mergeResults.data[j].Sequence;
        mergedStrands.push(strand);
    }
    var proxy = this.modifierMergeResource.save(mergedStrands);
    proxy.$promise.then(angular.bind(this, this.onSaveCompleted));
};

ModifierMergeController.prototype.onSaveCompleted = function (data) {
    var hasErrors = false;
    for (var i = 0; i < data.length; i++) {
        if (data[i].HasErrors) {
            hasErrors = true;
        }
    }
    if (!hasErrors) {
        this.window.location.href = '/Strand';
    } else {
        this.scope.mergeResults.data.forEach(function(item) {
            data.forEach(function(strand) {
                if (item.Sequence == strand.Sequence) {
                    item.ErrorDescription = 'Duplicate Sequence';
                    item.Errors = true;
                }
            });
        });
    }
}

ModifierMergeController.prototype.loadLookupData = function () {
    var proxy = this.lookupResource.get({});
    proxy.$promise.then(angular.bind(this, this.onLoadLookupCompleted));
}

ModifierMergeController.prototype.onLoadLookupCompleted = function (data) {
    this.scope.availableModStructures = data.ModStructures;
}

ModifierMergeController.prototype.addSequenceModal = function () {
    var _this = this;
    var settings = {
        templateUrl: '/Scripts/angular-app/widgets/selectModalTemplate.html',
        controller: 'SelectModalCtrl',
        controllerAs: "vm",
        size: 'lg',
        resolve: {
            selectModalConfig: function () {
                return {
                    gridOptions: {
                        multiSelect: true,
                        columnDefs: [
                            {
                                name: 'StrandID',
                                displayName: 'Strand ID',
                                field: 'ArrowheadStrandId'
                            },
                            {
                                name: 'Sequence',
                                displayName: 'Sequence',
                                field: 'Sequence'
                            },
                            {
                                name: 'Target',
                                displayName: 'Target',
                                field: 'Target.Name'
                            },
                            {
                                name: 'Orientation',
                                displayName: 'Orientation',
                                field: 'Orientation.Name'
                            }
                        ]
                    },
                    collectionName: 'ItemList',
                    prompt: 'Select sequences'
                }
            },
            searchResource: function () {
                return {
                    getData: function(query) {
                        return _this.strandResource.get(query).$promise;
                    }
                }

            }
        }
    };
    var modalInstance = this.uibModal.open(settings);
    modalInstance.result.then(angular.bind(this, function (result) {
        var _this = this;
        if (result != 'cancel') {
            angular.forEach(result,
                function(sequence){
                    _this.scope.selectedSequences.data.push(sequence);
                });
        };
    }), function () { });
};

ModifierMergeController.prototype.addModifierTemplateModal = function () {
    var _this = this;
    var settings = {
        templateUrl: '/Scripts/angular-app/widgets/selectModalTemplate.html',
        controller: 'SelectModalCtrl',
        controllerAs: "vm",
        size: 'lg',
        resolve: {
            selectModalConfig: function () {
                return {
                    gridOptions: {
                        multiSelect: true,
                        columnDefs: [
                            {
                                name: 'Name',
                                field: 'Name'
                            }
                        ]
                    },
                    collectionName: 'ItemList',
                    prompt: 'Select modifier templates'
                }
            },
            searchResource: function () {
                return {
                    getData: function(query) {
                        return _this.modifierTemplateResource.get(query).$promise;
                    }
                }

            }
        }
    };
    var modalInstance = this.uibModal.open(settings);
    modalInstance.result.then(angular.bind(this, function (result) {
        var _this = this;
        if (result != 'cancel') {
            angular.forEach(result,
               function (modifierTemplate) {
                   _this.scope.selectedModifierTemplates.data.push(modifierTemplate);
               });
            
        };
    }), function () { });
};


ModifierMergeController.prototype.removeSelectedSequence = function () {
    FindAndRemove(this.scope.selectedSequences.data, this.scope.selectedStrand);
    this.scope.selectedStrand = {};
}

ModifierMergeController.prototype.removeSelectedModifierTemplate = function () {
    FindAndRemove(this.scope.selectedModifierTemplates.data, this.scope.selectedModifierTemplate);
    this.scope.selectedModifierTemplate = {};
}

ModifierMergeController.prototype.queueMergeedItems = function () {
    for (var j = 0; j < this.scope.selectedModifierTemplates.data.length; j++) {
        for (var i = 0; i < this.scope.selectedSequences.data.length; i++) {
            this.scope.queuedMergedItens.push({ modifierTemplateId: this.scope.selectedModifierTemplates.data[j].Id, strandId: this.scope.selectedSequences.data[i].Id });
        }
    }
    this.scope.queuedMergedItens.reverse();
    this.scope.mergeResults.data = [];
    this.scope.performMerge();
}

ModifierMergeController.prototype.performMerge = function () {
    if (this.scope.queuedMergedItens.length > 0) {
        var target = this.scope.queuedMergedItens.pop();
        var proxy = this.modifierResource.query({ modifierTemplateId: target.modifierTemplateId, strandId: target.strandId });
        proxy.$promise.then(angular.bind(this, this.applyModifierTemplateCompleted));
    }
}

ModifierMergeController.prototype.applyModifierTemplateCompleted = function (data) {
    this.scope.buildChosenModStructuresFromTemplate(data.ModifiedSequence, data.FirstPosition, data.ModifierTemplateName, data.StrandId, data.HasErrors);
    this.scope.performMerge();
}

ModifierMergeController.prototype.buildChosenModStructuresFromTemplate = function (seq, firstPosition, templateName, fromStrandId, hasErrors) {
    var sequenceArray = seq.split(',');
    var hasError = hasErrors;
    var errorDescription = '';
    if (hasErrors) {
        errorDescription = 'Duplicate Sequence';
    }
    for (var i = 0; i < sequenceArray.length; i++) {
        var modStructure = SearchFor(this.scope.availableModStructures, 'Name', sequenceArray[i]);
        if (modStructure == null) {
            hasError = true;
            errorDescription = 'Invalid Sequence';
        }
    }
    var merged = {
        Sequence: sequenceArray.join(''),
        SequenceWithDelimiter: sequenceArray,
        FirstPosition: firstPosition,
        TemplateName: templateName,
        FromStrandId: fromStrandId,
        Errors: hasError,
        ErrorDescription: errorDescription
    };
    this.scope.mergeResults.data.push(merged);
}

ModifierMergeController.prototype.prependModifier = function () {
    this.scope.chosenModStructures.unshift({ Base: '' });
    this.scope.reCalcPositions();
}

ModifierMergeController.prototype.appendModifier = function () {
    this.scope.chosenModStructures.push({ Base: '' });
    this.scope.reCalcPositions();
}

ModifierMergeController.prototype.buildModStructures = function () {
    this.scope.chosenModStructures = [];
    var sequenceArray = this.scope.selectedSequence.SequenceWithDelimiter || 0;
    for (var i = 0; i < sequenceArray.length; i++) {
        var modStructure = SearchFor(this.scope.availableModStructures, 'Name', sequenceArray[i]);
        var modStructWithOrdinal = {};
        if (modStructure != null) {
            angular.copy(modStructure, modStructWithOrdinal);
            modStructWithOrdinal.SelectedModName = modStructWithOrdinal.Name;
        } else {
            modStructWithOrdinal.Base = sequenceArray[i];
        }
        this.scope.chosenModStructures.push(modStructWithOrdinal);
    }
    this.scope.reCalcPositions();
}

ModifierMergeController.prototype.reCalcPositions = function () {
    for (var i = 0; i < this.scope.chosenModStructures.length; i++) {
        this.scope.chosenModStructures[i].OrdinalPosition = i + 1;
    }
}

ModifierMergeController.prototype.rebuildSelectedSequence = function () {
    this.scope.selectedSequence.Sequence = this.scope.modifiedSequence();
    this.scope.selectedSequence.SequenceWithDelimiter = this.scope.modifiedSequenceWithDelimiter();
}

ModifierMergeController.prototype.modifiedSequence = function () {
    var seq = '';
    this.scope.selectedSequence.Errors = false;
    this.scope.selectedSequence.ErrorDescription = '';
    for (var i = 0; i < this.scope.chosenModStructures.length; i++) {
        if (this.scope.chosenModStructures[i].Base == '?' || !this.scope.chosenModStructures[i].Name) {
            seq = seq + this.scope.chosenModStructures[i].Base;
            this.scope.selectedSequence.Errors = true;
            this.scope.selectedSequence.ErrorDescription = 'Invalid Sequence';
        } else {
            seq = seq + this.scope.chosenModStructures[i].Name;
        }
    }
    return seq;
}

ModifierMergeController.prototype.modifiedSequenceWithDelimiter = function () {
    var seq = [];
    for (var i = 0; i < this.scope.chosenModStructures.length; i++) {
        //if (this.scope.chosenModStructures[i].Base == '?') {
        //    push(this.scope.chosenModStructures[i].Base);
        //} else 
        if (this.scope.chosenModStructures[i].Name != undefined) {
            seq.push(this.scope.chosenModStructures[i].Name);
        }
    }
    return seq;
}

ModifierMergeController.prototype.changeInModStructure = function (mod) {
    if (mod.SelectedModName.length == 0) return;
    var modStructure = SearchFor(this.scope.availableModStructures, 'Name', mod.SelectedModName);
    if (modStructure != null) {
        var modStructWithOrdinal = {};
        angular.copy(modStructure, modStructWithOrdinal);
        modStructWithOrdinal.OrdinalPosition = mod.OrdinalPosition;
        modStructWithOrdinal.SelectedModName = mod.SelectedModName;
        this.scope.chosenModStructures[modStructWithOrdinal.OrdinalPosition - 1] = modStructWithOrdinal;
        this.scope.selectedModStructure = {};
    }
    this.scope.rebuildSelectedSequence();
}

ModifierMergeController.prototype.permitImport = function () {
    if (this.scope.mergeResults.data.length == 0) return false;
    for (var i = 0; i < this.scope.mergeResults.data.length; i++) {
        if (this.scope.mergeResults.data[i].Errors) {
            return false;
        }
    }
    return true;
}

app.controller('SelectModalCtrl', App.Widgets.SelectModalCtrl);
app.controller('modifierMergeController', ['$scope', '$window', '$uibModal', 'lookupResource', 'strandResource', 'modifierResource', 'modifierMergeResource', 'modifierTemplateResource', ModifierMergeController]);