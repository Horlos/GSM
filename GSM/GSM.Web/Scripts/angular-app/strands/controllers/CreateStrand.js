var app = angular.module('newStrandApp', ['ngResource', 'ui.bootstrap.contextMenu', 'ui.bootstrap', 'ui.grid', 'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.grid.selection']);

app.factory('lookupResource', ['$resource', function (resource) {
    return resource('/api/lookup',
        {
            'table': ['Targets', 'Orientations', 'SpeciesList', 'ModStructures']
        }
    );
}]);

app.factory('strandResource', ['$resource', function (resource) {
    return resource('/api/strands/:strandId', { strandId: '@StrandID' }, { 'query': { isArray: false }});
}]);

app.factory('modifierTemplateResource', ['$resource', function (resource) {
    return resource('/api/modifiertemplates', null, {
        'query': { isArray: false }
    });
}]);

app.factory('strandSpeciesResource', ['$resource', function (resource) {
    return resource('/api/strands/:strandId/species', { strandId: '@StrandID' }, { 'query': { isArray: true } });
}]);

app.factory('modifierResource', ['$resource', function (resource) {
    return resource('/api/modifiers/:modifierTemplateId/:baseSequence/:firstPosition', { modifierTemplateId: '@modifierTemplateId', baseSequence: '@baseSequence', firstPosition: '@firstPosition' }, { 'query': { isArray: false } });
}]);

function StrandController(scope, window, uibModal, lookupResource, strandResource, modifierTemplateResource, strandSpeciesResource, modifierResource) {
    this.lookupResource = lookupResource;
    this.strandResource = strandResource;
    this.strandSpeciesResource = strandSpeciesResource;
    this.modifierResource = modifierResource;
    this.modifierTemplateResource = modifierTemplateResource;
    this.scope = scope;
    this.window = window;
    this.uibModal = uibModal;
    this.MvcController = MvcController(this.window.location.pathname);
    scope.menuOptions = [
        ['Set As First', function ($itemScope) {
            $itemScope.$parent.strand.FirstPosition = $itemScope.mod.OrdinalPosition;
        }, function ($itemScope) {
            if ($itemScope.mod.Name == undefined) {
                return null;
            }
            return $itemScope.mod != null;
        }],
        ['Delete', function ($itemScope) {
            var index = $itemScope.$parent.chosenModStructures.indexOf($itemScope.mod);
            if (index !== -1) {
                $itemScope.$parent.chosenModStructures.splice(index, 1);
                if (index < $itemScope.$parent.strand.FirstPosition)
                    $itemScope.$parent.strand.FirstPosition--;
            }
        }, function ($itemScope) {
            if ($itemScope.mod.OrdinalPosition == $itemScope.$parent.strand.FirstPosition) {
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
    scope.availableTargets = [];
    scope.availableOrientations = [];
    scope.availableSpeciesList = [];
    scope.availableModStructures = [];
    scope.chosenModStructures = [];
    scope.EntryUsingModified = false;
    scope.selectedFirstPosition = {};
    scope.selectedModStructure = {};
    scope.modifierTemplate = {
        Name: 'None'
    };
    scope.copiedFrom = 'None';
    scope.sequenceEntered = '';
    scope.sequenceEnteredError = '';
    scope.strand = {
        StrandModStructures: [],
        FirstPosition: 1,
        Name: '',
        Orientation: {},
        Target: {},
        GenomeNumber: '',
        GenomePosition: '',
        ParentSequence: '',
        Notes: '',
        Species: [],
        Error: {}
    };
    scope.$watch('chosenModStructures.length', function(a, b) {
        if (a != b) {
            scope.reCalcPositions();
        }
    });
    scope.$watch('chosenModStructures', function (a, b) {
        if (a.length > 0 && a[0].OrdinalPosition == undefined) {
            scope.reCalcPositions();
        }
    });
    scope.cancelChanges = angular.bind(this, this.cancelChanges);
    scope.onSaveCompleted = angular.bind(this, this.onSaveCompleted);
    scope.selectSpecies = angular.bind(this, this.selectSpecies);
    scope.buildChosenModStructures = angular.bind(this, this.buildChosenModStructures);
    scope.buildChosenModStructuresFromCopy = angular.bind(this, this.buildChosenModStructuresFromCopy);
    scope.baseSequence = angular.bind(this, this.baseSequence);
    scope.onModifierTemplateChange = angular.bind(this, this.onModifierTemplateChange);
    scope.modifiedSequence = angular.bind(this, this.modifiedSequence);
    scope.modStructureProperty = angular.bind(this, this.modStructureProperty);
    scope.copyExistingStrand = angular.bind(this, this.copyExistingStrand);
    scope.isSpeciesSelected = angular.bind(this, this.isSpeciesSelected);
    scope.selectModifierTemplate = angular.bind(this, this.selectModifierTemplate);
    scope.getCopyStrandSpecies = angular.bind(this, this.getCopyStrandSpecies);
    scope.sequenceDelimiter = angular.bind(this, this.sequenceDelimiter);
    scope.onGetCopyStrandSpeciesCompleted = angular.bind(this, this.onGetCopyStrandSpeciesCompleted);
    scope.changeInModStructure = angular.bind(this, this.changeInModStructure);
    scope.reCalcPositions = angular.bind(this, this.reCalcPositions);
    scope.applyModifierTemplateCompleted = angular.bind(this, this.applyModifierTemplateCompleted);
    scope.validChosenModStructureBases = angular.bind(this, this.validChosenModStructureBases);
    scope.validChosenModStructures = angular.bind(this, this.validChosenModStructures);
    scope.getPositionDecorator = angular.bind(this, this.getPositionDecorator);
    scope.getPositionRelativeToFirst = angular.bind(this, this.getPositionRelativeToFirst);
    scope.buildChosenModStructuresFromTemplate = angular.bind(this, this.buildChosenModStructuresFromTemplate);
    scope.prependModifier = angular.bind(this, this.prependModifier);
    scope.appendModifier = angular.bind(this, this.appendModifier);
    scope.resetForm = angular.bind(this, this.resetForm);

    scope.saveStrand = angular.bind(this, this.saveStrand);
    scope.permitSave = angular.bind(this, this.permitSave);
    this.loadLookupData();
}

StrandController.prototype.saveStrand = function () {
    this.scope.strand.StrandModStructures = [];
    if (this.scope.selectedFirstPosition.OrdinalPosition != undefined) {
        this.scope.strand.FirstPosition = this.scope.selectedFirstPosition.OrdinalPosition;
    }
    for (var i = 0; i < this.scope.chosenModStructures.length; i++) {
        if (this.scope.chosenModStructures[i].Name != undefined) {
            this.scope.strand.StrandModStructures.push({
                'OrdinalPosition': i + 1,
                'ModStructure': this.scope.chosenModStructures[i],
                 ModStructureId: this.scope.chosenModStructures[i].Id
            });
        }
    }
    var proxy = this.strandResource.save(this.scope.strand);
    proxy.$promise.then(angular.bind(this, this.onSaveCompleted));
}

StrandController.prototype.onSaveCompleted = function (newStrand) {
    this.scope.strand.Error = newStrand.Errors;
    this.scope.strandForm.$setPristine();
    if (!newStrand.HasErrors) {
        this.window.location.href = '/' + this.MvcController + '/Edit/' + newStrand.Id;
    }
}

StrandController.prototype.resetForm = function () {
    this.scope.chosenModStructures = [];
    this.scope.sequenceEntered = '';
    this.scope.copiedFrom = 'None';
    this.scope.sequenceEnteredError = '';
    this.scope.modifierTemplate = { Name: 'None' };
    this.scope.strand = {
        StrandModStructures: [],
        FirstPosition: 1,
        Name: '',
        Orientation: {},
        Target: {},
        GenomeNumber: '',
        GenomePosition: '',
        ParentSequence: '',
        Notes: '',
        Species: [],
        Error: {}
    };
}

StrandController.prototype.baseSequence = function () {
    var seq = '';
    for (var i = 0; i < this.scope.chosenModStructures.length; i++) {
        if (this.scope.chosenModStructures[i].Base != undefined) {
            seq = seq + this.scope.chosenModStructures[i].Base;
        }
    }
    return seq;
}

StrandController.prototype.modifiedSequence = function () {
    var seq = '';
    for (var i = 0; i < this.scope.chosenModStructures.length; i++) {
        if (this.scope.chosenModStructures[i].Name != undefined) {
            seq = seq + this.scope.chosenModStructures[i].Name;
        }
    }
    return seq;
}

StrandController.prototype.onModifierTemplateChange = function () {
    var proxy = this.modifierResource.query({ modifierTemplateId: this.scope.modifierTemplate.Id, baseSequence: this.scope.baseSequence(), firstPosition: this.scope.strand.FirstPosition });
    proxy.$promise.then(angular.bind(this, this.applyModifierTemplateCompleted));
}

StrandController.prototype.applyModifierTemplateCompleted = function (data) {
    this.scope.buildChosenModStructuresFromTemplate(data.ModifiedSequence);
}

StrandController.prototype.reCalcPositions = function () {
    for (var i = 0; i < this.scope.chosenModStructures.length; i++) {
        this.scope.chosenModStructures[i].OrdinalPosition = i + 1;
    }
}

StrandController.prototype.copyExistingStrand = function () {
var _this = this;
    var settings = {
        templateUrl: '/Scripts/angular-app/widgets/selectModalTemplate.html',
        controller: 'SelectModalCtrl',
        controllerAs: "vm",
        size: 'lg',
        resolve: {
            selectModalConfig: function() {
                return {
                    gridOptions: {
                        multiSelect: false,
                        columnDefs: [
                            {
                                displayName: 'Strand ID',
                                name: 'ArrowheadStrandID',
                                field: 'ArrowheadStrandId'
                            },
                            {
                                name: 'Sequence',
                                field: 'Sequence'
                            },
                            {
                                name: 'BaseSequence',
                                field: 'BaseSequence'

                            }
                        ]
                    },
                    collectionName: 'ItemList',
                    prompt: 'Select the strand to copy from'
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
        if (result != 'cancel') {
            this.scope.getCopyStrandSpecies(result.Id);
            this.scope.modifierTemplate = { Name: 'None'};
            this.scope.copiedFrom = result.ArrowheadStrandId;
            this.scope.strand.FirstPosition = result.FirstPosition;
            this.scope.strand.Orientation = result.Orientation;
            this.scope.strand.Target = result.Target;
            this.scope.strand.Notes = result.Notes;
            this.scope.strand.GenomeNumber = result.GenomeNumber;
            this.scope.strand.GenomePosition = result.GenomePosition;
            this.scope.strand.ParentSequence = result.ParentSequence;
            this.scope.buildChosenModStructuresFromCopy(result.StrandModStructures);
            this.scope.strandForm.$dirty = true;
        };
    }), function () {});
};

StrandController.prototype.selectModifierTemplate = function () {
    var _this = this;
    var settings = {
        templateUrl: '/Scripts/angular-app/widgets/selectModalTemplate.html',
        controller: 'SelectModalCtrl',
        controllerAs: "vm",
        size: 'lg',
        resolve: {
            selectModalConfig: function() {
                return {
                    gridOptions: {
                        multiSelect: false,
                        columnDefs: [
                            {
                                name: 'Name',
                                field: 'Name'
                            }
                        ]
                    },
                    collectionName: 'ItemList',
                    prompt: 'Select a modifier template'
                }
            },
            searchResource: function() {
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
        if (result != 'cancel') {
            this.scope.modifierTemplate = result;
            this.scope.onModifierTemplateChange();
        };
    }), function () { });
};

StrandController.prototype.changeInModStructure = function (mod) {
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
}

StrandController.prototype.buildChosenModStructures = function (seq) {
    this.scope.sequenceEnteredError = '';
    this.scope.selectedModStructure = {};
    this.scope.chosenModStructures = [];
    var removeSpaces = seq.replace(/\s+/g, '');
    var sequenceArray = removeSpaces.split(this.scope.sequenceDelimiter());
    for (var i = 0; i < sequenceArray.length; i++) {
        var modStructure = SearchFor(this.scope.availableModStructures, this.scope.modStructureProperty(), sequenceArray[i]);
        var modStructWithOrdinal = {};
        if (modStructure != null) {
            if (this.scope.EntryUsingModified) {
                modStructure.SelectedModName = modStructure.Name;
            }
            angular.copy(modStructure, modStructWithOrdinal);
        } else {
            modStructWithOrdinal.Base = sequenceArray[i];
            modStructWithOrdinal.Error = Error;
        }
        this.scope.chosenModStructures.push(modStructWithOrdinal);
    }
}

StrandController.prototype.buildChosenModStructuresFromTemplate = function (seq) {
    this.scope.sequenceEnteredError = '';
    this.scope.selectedModStructure = {};
    this.scope.chosenModStructures = [];
    var sequenceArray = seq.split(',');
    this.scope.strand.FirstPosition = this.scope.modifierTemplate.FirstPosition;
    for (var i = 0; i < sequenceArray.length; i++) {
        var modStructure = SearchFor(this.scope.availableModStructures, 'Name', sequenceArray[i]);
        var modStructWithOrdinal = {};
        if (modStructure != null) {
            angular.copy(modStructure, modStructWithOrdinal);
            modStructWithOrdinal.SelectedModName = modStructWithOrdinal.Name;
        } else {
            modStructWithOrdinal.Base = sequenceArray[i];
            modStructWithOrdinal.Error = Error;
        }
        this.scope.chosenModStructures.push(modStructWithOrdinal);
    }
}

StrandController.prototype.sequenceDelimiter = function () {
    if (this.scope.EntryUsingModified) return ',';
    return '';
}

StrandController.prototype.modStructureProperty = function () {
    if (this.scope.EntryUsingModified) return 'Name';
    return 'Base';
}

StrandController.prototype.validChosenModStructureBases = function () {
    if (this.scope.chosenModStructures.length == 0) return false;
    for (var i = 0; i < this.scope.chosenModStructures.length; i++) {
        if (this.scope.chosenModStructures[i].Error != undefined) {
            return false;
        }
    }
    return true;
}

StrandController.prototype.validChosenModStructures = function () {
    if (this.scope.chosenModStructures.length == 0) return false;
    for (var i = 0; i < this.scope.chosenModStructures.length; i++) {
        if (this.scope.chosenModStructures[i].Error != undefined || this.scope.chosenModStructures[i].SelectedModName == undefined) {
            return false;
        }
    }
    return true;
}

StrandController.prototype.buildChosenModStructuresFromCopy = function (copyFrom) {
    this.scope.selectedModStructure = {};
    this.scope.chosenModStructures = [];
    for (var i = 0; i < copyFrom.length; i++) {
        var modStructWithOrdinal = {};
        angular.copy(copyFrom[i].ModStructure, modStructWithOrdinal);
        modStructWithOrdinal.SelectedModName = copyFrom[i].ModStructure.Name;
        this.scope.chosenModStructures.push(modStructWithOrdinal);
    }
}

StrandController.prototype.prependModifier = function () {
    this.scope.chosenModStructures.unshift({ Base: '' });
    this.scope.strand.FirstPosition++;
}

StrandController.prototype.appendModifier = function () {
    this.scope.chosenModStructures.push({ Base: '' });
}

StrandController.prototype.cancelChanges = function () {
    this.window.location.href = '/' + this.MvcController;
}

StrandController.prototype.loadLookupData = function () {
    var proxy = this.lookupResource.get({});
    proxy.$promise.then(angular.bind(this, this.onLoadLookupCompleted));
}

StrandController.prototype.onLoadLookupCompleted = function (data) {
    this.scope.availableTargets = data.Targets;
    if (this.scope.availableTargets.length > 0) {
        this.scope.strand.Target = this.scope.availableTargets[0];        
    }
    this.scope.availableOrientations = data.Orientations;
    if (this.scope.availableOrientations.length > 0) {
        this.scope.strand.Orientation = this.scope.availableOrientations[0];
    }
    this.scope.availableSpeciesList = data.SpeciesList;
    this.scope.availableModStructures = data.ModStructures;
}

StrandController.prototype.getCopyStrandSpecies = function (strandId) {
    var proxy = this.strandSpeciesResource.query({ strandId: strandId });
    proxy.$promise.then(angular.bind(this, this.onGetCopyStrandSpeciesCompleted));
}

StrandController.prototype.onGetCopyStrandSpeciesCompleted = function (data) {
    this.scope.strand.Species = data;
}

StrandController.prototype.getPositionDecorator = function () {
    if (this.scope.strand.Orientation.Name != undefined && this.scope.strand.Orientation.Name == "Sense") {
        return '\'';
    }
    return '';
}

StrandController.prototype.getPositionRelativeToFirst = function (mod) {
    var positionInd = this.scope.getPositionDecorator();
    var indexOfFp = this.scope.strand.FirstPosition - 1;
    var indexOfMod = this.scope.chosenModStructures.indexOf(mod);
    var unAdjustedRelativePosition;
    if (positionInd == '') {
        unAdjustedRelativePosition = indexOfMod - indexOfFp;    // Antisense
    } else {
        unAdjustedRelativePosition = indexOfFp - indexOfMod;    // Sense
    }
    if (unAdjustedRelativePosition >= 0) {
        unAdjustedRelativePosition++;
    }

    return unAdjustedRelativePosition + this.scope.getPositionDecorator();
}

StrandController.prototype.selectSpecies = function(species) {
    var speciesList = this.scope.strand.Species;
    var filteredSpeciesList = speciesList.filter(function(item) {
        return item.Id !== species.Id;
    });
    if (filteredSpeciesList.length !== speciesList.length) {
        this.scope.strand.Species = filteredSpeciesList;
    } else {
        this.scope.strand.Species.push(species);
    }
}

StrandController.prototype.isSpeciesSelected = function (species) {
    var speciesList = this.scope.strand.Species;
    if (speciesList == undefined) return false;
    var locatedIndex = SearchFor(speciesList, "Name", species.Name);
    if (locatedIndex != null) {
        return true;
    } else {
        return false;
    }
}

StrandController.prototype.permitSave = function () {
    return this.scope.strandForm.$dirty && this.scope.validChosenModStructures() && this.scope.strand.Target.Name != undefined && this.scope.strand.Orientation.Name != undefined;
}

app.controller('SelectModalCtrl', App.Widgets.SelectModalCtrl);
app.controller('newStrandController', ['$scope', '$window', '$uibModal', 'lookupResource', 'strandResource', 'modifierTemplateResource', 'strandSpeciesResource', 'modifierResource', StrandController]);