var App;
(function (App) {
    var Strands;
    (function (Strands) {
        var Controllers;
        (function (Controllers) {
            var EditImportedStrandCtrl = (function () {
                function EditImportedStrandCtrl($scope, $window, $uibModal, $state, $stateParams, strandsService, modifierService, lookupService) {
                    this.$scope = $scope;
                    this.$window = $window;
                    this.$uibModal = $uibModal;
                    this.$state = $state;
                    this.$stateParams = $stateParams;
                    this.strandsService = strandsService;
                    this.modifierService = modifierService;
                    this.lookupService = lookupService;
                    var importedStrand = $stateParams["strand"];
                    this.strand = {
                        Id: importedStrand.Id || 0,
                        StrandModStructures: importedStrand.StrandModStructures || [],
                        FirstPosition: importedStrand.FirstPosition,
                        Name: '',
                        Orientation: importedStrand.Orientation || {
                            Id: 0,
                            Name: '',
                            HasErrors: false
                        },
                        Target: importedStrand.Target || {
                            Id: 0,
                            Name: '',
                            HasErrors: false
                        },
                        GenomeNumber: importedStrand.GenomeNumber || '',
                        GenomePosition: importedStrand.GenomePosition || '',
                        ParentSequence: importedStrand.ParentSequence || '',
                        Notes: '',
                        Species: []
                    };
                    this.chosenModStructures = this.strand.StrandModStructures.map(function (sm) { return sm.ModStructure; }) || [];
                    this.initialize();
                    this.loadLookupData();
                }
                EditImportedStrandCtrl.prototype.initialize = function () {
                    var _this = this;
                    this.availableTargets = [];
                    this.availableOrientations = [];
                    this.availableSpeciesList = [];
                    this.availableModStructures = [];
                    this.selectedFirstPosition = {};
                    this.selectedModStructure = {
                        OrdinalPosition: 0,
                        Name: '',
                        Base: '',
                        HasErrors: false
                    };
                    this.modifierTemplate = {
                        Name: 'None'
                    };
                    this.copiedFrom = 'None';
                    this.entryUsingModified = false;
                    this.sequenceEntered = '';
                    this.sequenceEnteredError = '';
                    this.menuOptions = [
                        [
                            'Set As First', function ($itemScope) {
                                $itemScope.$parent.vm.strand.FirstPosition = $itemScope.mod.OrdinalPosition;
                            }, function ($itemScope) {
                                if ($itemScope.mod.Name == undefined) {
                                    return null;
                                }
                                return $itemScope.mod != null;
                            }
                        ],
                        [
                            'Delete', function ($itemScope) {
                                var index = $itemScope.$parent.vm.chosenModStructures.indexOf($itemScope.mod);
                                if (index !== -1) {
                                    $itemScope.$parent.vm.chosenModStructures.splice(index, 1);
                                }
                            }, function ($itemScope) {
                                if ($itemScope.mod.OrdinalPosition === $itemScope.$parent.vm.strand.FirstPosition) {
                                    return null;
                                }
                                return $itemScope.mod != null;
                            }
                        ],
                        [
                            'Insert', function ($itemScope) {
                                var index = $itemScope.$parent.vm.chosenModStructures.indexOf($itemScope.mod);
                                if (index !== -1) {
                                    $itemScope.$parent.vm.chosenModStructures.splice(index, 0, { Base: '', Name: '' });
                                }
                            }, function ($itemScope) {
                                if ($itemScope.mod.Name == undefined) {
                                    return null;
                                }
                                return $itemScope.mod != null;
                            }
                        ]
                    ];
                    this.$scope.$watch(function () {
                        return _this.chosenModStructures.length;
                    }, function (a, b) {
                        if (a !== b) {
                            _this.recalculatePositions();
                        }
                    });
                    this.$scope.$watch(function () {
                        return _this.chosenModStructures;
                    }, function (a) {
                        if (a.length > 0 && !angular.isDefined(a[0].OrdinalPosition)) {
                            _this.recalculatePositions();
                        }
                    });
                };
                EditImportedStrandCtrl.prototype.permitSave = function () {
                    return this.validChosenModStructures() &&
                        angular.isDefined(this.strand.Target.Name) &&
                        angular.isDefined(this.strand.Orientation.Name);
                };
                EditImportedStrandCtrl.prototype.returnStrand = function () {
                    this.strand.StrandModStructures = [];
                    if (angular.isDefined(this.selectedFirstPosition.OrdinalPosition)) {
                        this.strand.FirstPosition = this.selectedFirstPosition.OrdinalPosition;
                    }
                    for (var i = 0; i < this.chosenModStructures.length; i++) {
                        if (this.chosenModStructures[i].Name != undefined) {
                            var modStructure = {
                                ModStructure: this.chosenModStructures[i],
                                OrdinalPosition: i + 1,
                                HasErrors: false
                            };
                            this.strand.StrandModStructures.push(modStructure);
                        }
                    }
                    this.$state.go('importStrand', { strand: this.strand });
                };
                EditImportedStrandCtrl.prototype.resetForm = function () {
                    this.chosenModStructures = [];
                    this.sequenceEntered = '';
                    this.copiedFrom = 'None';
                    this.sequenceEnteredError = '';
                    this.modifierTemplate = { Name: 'None' };
                    var strandId = this.strand.Id;
                    this.strand = {
                        Id: strandId,
                        StrandModStructures: [],
                        FirstPosition: 1,
                        Name: '',
                        Orientation: {
                            Name: '',
                            Id: 0,
                            HasErrors: false
                        },
                        Target: {
                            Name: '',
                            Id: 0,
                            HasErrors: false
                        },
                        GenomeNumber: '',
                        GenomePosition: '',
                        ParentSequence: '',
                        Notes: '',
                        Species: []
                    };
                };
                EditImportedStrandCtrl.prototype.cancelChanges = function () {
                    this.$window.location.href = '/Strand';
                };
                EditImportedStrandCtrl.prototype.selectSpecies = function (species) {
                    var speciesList = this.strand.Species;
                    var filteredSpeciesList = speciesList.filter(function (item) {
                        return item.Id !== species.Id;
                    });
                    if (filteredSpeciesList.length !== speciesList.length) {
                        this.strand.Species = filteredSpeciesList;
                    }
                    else {
                        this.strand.Species.push(species);
                    }
                };
                EditImportedStrandCtrl.prototype.isSpeciesSelected = function (species) {
                    var speciesList = this.strand.Species;
                    if (!angular.isDefined(speciesList))
                        return false;
                    var locatedIndex = App.Common.Utils.searchFor(speciesList, "Name", species.Name);
                    if (locatedIndex != null) {
                        return true;
                    }
                    else {
                        return false;
                    }
                };
                EditImportedStrandCtrl.prototype.baseSequence = function () {
                    var seq = '';
                    for (var i = 0; i < this.chosenModStructures.length; i++) {
                        if (angular.isDefined(this.chosenModStructures[i].Base)) {
                            seq = seq + this.chosenModStructures[i].Base;
                        }
                    }
                    return seq;
                };
                EditImportedStrandCtrl.prototype.modifiedSequence = function () {
                    var seq = '';
                    for (var i = 0; i < this.chosenModStructures.length; i++) {
                        if (angular.isDefined(this.chosenModStructures[i].Name)) {
                            seq = seq + this.chosenModStructures[i].Name;
                        }
                    }
                    return seq;
                };
                EditImportedStrandCtrl.prototype.onModifierTemplateChange = function () {
                    var _this = this;
                    var modifierTemplateId = this.modifierTemplate.Id;
                    var baseSequence = this.baseSequence();
                    var firstPosition = this.strand.FirstPosition;
                    this.modifierService.getModifierTemplate(modifierTemplateId, baseSequence, firstPosition)
                        .then(function (data) {
                        _this.buildChosenModStructuresFromTemplate(data.ModifiedSequence);
                    });
                };
                EditImportedStrandCtrl.prototype.recalculatePositions = function () {
                    for (var i = 0; i < this.chosenModStructures.length; i++) {
                        this.chosenModStructures[i].OrdinalPosition = i + 1;
                    }
                };
                EditImportedStrandCtrl.prototype.changeInModStructure = function (mod) {
                    if (mod.Name.length === 0)
                        return;
                    var modStructure = App.Common.Utils.searchFor(this.availableModStructures, 'Name', mod.Name);
                    if (modStructure != null) {
                        var modStructWithOrdinal = {
                            OrdinalPosition: 0,
                            Name: '',
                            Base: '',
                            HasErrors: false
                        };
                        angular.copy(modStructure, modStructWithOrdinal);
                        modStructWithOrdinal.OrdinalPosition = mod.OrdinalPosition;
                        modStructWithOrdinal.Name = mod.Name;
                        this.chosenModStructures[modStructWithOrdinal.OrdinalPosition - 1] = modStructWithOrdinal;
                        this.selectedModStructure = {
                            Base: '',
                            OrdinalPosition: 0,
                            Name: '',
                            HasErrors: false
                        };
                    }
                };
                EditImportedStrandCtrl.prototype.buildChosenModStructures = function () {
                    this.sequenceEnteredError = '';
                    this.selectedModStructure = {
                        Base: '',
                        OrdinalPosition: 0,
                        Name: '',
                        HasErrors: false
                    };
                    this.chosenModStructures = [];
                    var removeSpaces = this.sequenceEntered.replace(/\s+/g, '');
                    var sequenceArray = removeSpaces.split(this.sequenceDelimiter());
                    for (var i = 0; i < sequenceArray.length; i++) {
                        var modStructure = App.Common.Utils.searchFor(this.availableModStructures, this.modStructureProperty(), sequenceArray[i]);
                        var modStructWithOrdinal = {
                            Base: '',
                            Name: '',
                            OrdinalPosition: 0,
                            HasErrors: false
                        };
                        if (modStructure != null) {
                            if (this.entryUsingModified) {
                                modStructure.SelectedModName = modStructure.Name;
                            }
                            angular.copy(modStructure, modStructWithOrdinal);
                        }
                        else {
                            modStructWithOrdinal.Base = sequenceArray[i];
                        }
                        this.chosenModStructures.push(modStructWithOrdinal);
                    }
                };
                EditImportedStrandCtrl.prototype.buildChosenModStructuresFromTemplate = function (sequence) {
                    this.sequenceEnteredError = '';
                    this.selectedModStructure = {
                        Base: '',
                        OrdinalPosition: 0,
                        Name: '',
                        HasErrors: false
                    };
                    this.chosenModStructures = [];
                    var sequenceArray = sequence.split(',');
                    this.strand.FirstPosition = this.modifierTemplate.FirstPosition;
                    for (var i = 0; i < sequenceArray.length; i++) {
                        var modStructure = App.Common.Utils.searchFor(this.availableModStructures, 'Name', sequenceArray[i]);
                        var modStructWithOrdinal = {
                            Name: '',
                            OrdinalPosition: 0,
                            Base: '',
                            HasErrors: false
                        };
                        if (modStructure != null) {
                            angular.copy(modStructure, modStructWithOrdinal);
                            modStructWithOrdinal.Name = modStructWithOrdinal.Name;
                        }
                        else {
                            modStructWithOrdinal.Base = sequenceArray[i];
                        }
                        this.chosenModStructures.push(modStructWithOrdinal);
                    }
                };
                EditImportedStrandCtrl.prototype.sequenceDelimiter = function () {
                    if (this.entryUsingModified)
                        return ',';
                    return '';
                };
                EditImportedStrandCtrl.prototype.modStructureProperty = function () {
                    if (this.entryUsingModified)
                        return 'Name';
                    return 'Base';
                };
                EditImportedStrandCtrl.prototype.validChosenModStructureBases = function () {
                    if (this.chosenModStructures.length === 0)
                        return false;
                    for (var i = 0; i < this.chosenModStructures.length; i++) {
                        if (!angular.isDefined(this.chosenModStructures[i])) {
                            return false;
                        }
                    }
                    return true;
                };
                EditImportedStrandCtrl.prototype.validChosenModStructures = function () {
                    if (this.chosenModStructures.length === 0)
                        return false;
                    for (var i = 0; i < this.chosenModStructures.length; i++) {
                        if (!angular.isDefined(this.chosenModStructures[i])) {
                            return false;
                        }
                    }
                    return true;
                };
                EditImportedStrandCtrl.prototype.buildChosenModStructuresFromCopy = function (strandModStructures) {
                    this.selectedModStructure = {
                        Base: '',
                        OrdinalPosition: 0,
                        Name: '',
                        HasErrors: false
                    };
                    this.chosenModStructures = [];
                    for (var i = 0; i < strandModStructures.length; i++) {
                        var modStructWithOrdinal = {
                            Base: '',
                            OrdinalPosition: 0,
                            Name: '',
                            HasErrors: false
                        };
                        angular.copy(strandModStructures[i].ModStructure, modStructWithOrdinal);
                        modStructWithOrdinal.Name = strandModStructures[i].ModStructure.Name;
                        this.chosenModStructures.push(modStructWithOrdinal);
                    }
                };
                EditImportedStrandCtrl.prototype.prependModifier = function () {
                    this.chosenModStructures.unshift({
                        Base: '',
                        OrdinalPosition: 0,
                        Name: '',
                        HasErrors: false
                    });
                };
                EditImportedStrandCtrl.prototype.appendModifier = function () {
                    this.chosenModStructures.push({
                        Base: '',
                        OrdinalPosition: 0,
                        Name: '',
                        HasErrors: false
                    });
                };
                EditImportedStrandCtrl.prototype.getCopyStrandSpecies = function (strandId) {
                    var _this = this;
                    this.strandsService.getStrandSpecies(strandId)
                        .then(function (data) {
                        _this.strand.Species = data;
                    });
                };
                EditImportedStrandCtrl.prototype.loadLookupData = function () {
                    var _this = this;
                    this.lookupService.get()
                        .then(function (data) {
                        _this.availableTargets = data.Targets;
                        _this.availableOrientations = data.Orientations;
                        _this.availableSpeciesList = data.SpeciesList;
                        _this.availableModStructures = data.ModStructures;
                    });
                };
                EditImportedStrandCtrl.prototype.getPositionDecorator = function () {
                    if (this.strand.Orientation.Name != undefined && this.strand.Orientation.Name === "Sense") {
                        return '\'';
                    }
                    return '';
                };
                EditImportedStrandCtrl.prototype.getPositionRelativeToFirst = function (mod) {
                    var positionInd = this.getPositionDecorator();
                    var indexOfFp = this.strand.FirstPosition - 1;
                    var indexOfMod = this.chosenModStructures.indexOf(mod);
                    var unAdjustedRelativePosition;
                    if (positionInd === '') {
                        unAdjustedRelativePosition = indexOfMod - indexOfFp; // Antisense
                    }
                    else {
                        unAdjustedRelativePosition = indexOfFp - indexOfMod; // Sense
                    }
                    if (unAdjustedRelativePosition >= 0) {
                        unAdjustedRelativePosition++;
                    }
                    return unAdjustedRelativePosition + this.getPositionDecorator();
                };
                EditImportedStrandCtrl.prototype.selectModifierTemplate = function () {
                    var _this = this;
                    var modalSettings = {
                        templateUrl: '/Scripts/angular-app/widgets/selectModalTemplate.html',
                        controller: 'SelectModalCtrl',
                        controllerAs: "vm",
                        size: 'lg',
                        resolve: {
                            selectModalConfig: function () {
                                return {
                                    gridOptions: {
                                        columnDefs: [
                                            {
                                                name: 'Name',
                                                field: 'Name'
                                            }
                                        ],
                                        multiSelect: false
                                    },
                                    prompt: 'Select a modifier template'
                                };
                            },
                            searchResource: function () {
                                return {
                                    getData: function (query) {
                                        return _this.modifierService.getModifierTemplates(query);
                                    }
                                };
                            }
                        }
                    };
                    var modalInstance = this.$uibModal.open(modalSettings);
                    modalInstance.result.then(function (result) {
                        if (result !== 'cancel') {
                            _this.modifierTemplate = result;
                            _this.onModifierTemplateChange();
                        }
                        ;
                    });
                };
                EditImportedStrandCtrl.prototype.copyExistingStrand = function () {
                    var _this = this;
                    var modalSettings = {
                        templateUrl: '/Scripts/angular-app/widgets/selectModalTemplate.html',
                        controller: 'SelectModalCtrl',
                        controllerAs: "vm",
                        size: 'lg',
                        resolve: {
                            selectModalConfig: function () {
                                return {
                                    gridOptions: {
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
                                        ],
                                        multiSelect: false
                                    },
                                    collectionName: 'ItemList',
                                    prompt: 'Select the strand to copy from'
                                };
                            },
                            searchResource: function () {
                                return {
                                    getData: function (query) {
                                        return _this.strandsService.getStrands(query);
                                    }
                                };
                            }
                        }
                    };
                    var modalInstance = this.$uibModal.open(modalSettings);
                    modalInstance.result.then(function (result) {
                        if (result !== 'cancel') {
                            _this.getCopyStrandSpecies(result.Id);
                            _this.modifierTemplate = { Name: 'None' };
                            _this.copiedFrom = result.ArrowheadStrandId;
                            _this.strand.FirstPosition = result.FirstPosition;
                            _this.strand.Orientation = result.Orientation;
                            _this.strand.Target = result.Target;
                            _this.strand.Notes = result.Notes;
                            _this.strand.GenomeNumber = result.GenomeNumber;
                            _this.strand.GenomePosition = result.GenomePosition;
                            _this.strand.ParentSequence = result.ParentSequence;
                            _this.buildChosenModStructuresFromCopy(result.StrandModStructures);
                            _this.$scope.form.$dirty = true;
                        }
                        ;
                    });
                };
                EditImportedStrandCtrl.$inject = [
                    '$scope', '$window', '$uibModal', '$state', '$stateParams',
                    'strandsService', 'modifierTemplatesService', 'lookupService'
                ];
                return EditImportedStrandCtrl;
            }());
            App.getAppContainer()
                .getSection('app.strands')
                .getInstance()
                .controller('EditImportedStrandCtrl', EditImportedStrandCtrl)
                .controller('SelectModalCtrl', App.Widgets.SelectModalCtrl);
        })(Controllers = Strands.Controllers || (Strands.Controllers = {}));
    })(Strands = App.Strands || (App.Strands = {}));
})(App || (App = {}));
//# sourceMappingURL=editImportedStrandCtrl.js.map