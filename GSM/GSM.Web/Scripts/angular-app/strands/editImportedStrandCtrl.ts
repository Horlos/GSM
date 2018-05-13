namespace App.Strands.Controllers {

    interface IEditImportedStrandScope extends ng.IScope {
        form: ng.IFormController;
    }

    class EditImportedStrandCtrl {
        public strand: App.Strands.Models.StrandModel;
        public chosenModStructures: Array<App.Strands.Models.ModStructureModel>;
        public selectedFirstPosition: any;
        public selectedModStructure: App.Strands.Models.ModStructureModel;
        public modifierTemplate: any;

        public availableTargets: Array<App.Strands.Models.TargetModel>;
        public availableOrientations: Array<App.Strands.Models.OrientationModel>;
        public availableSpeciesList: Array<App.Strands.Models.SpeciesModel>;
        public availableModStructures: Array<App.Strands.Models.ModStructureModel>;

        public sequenceEntered: string;
        public sequenceEnteredError: string;

        public entryUsingModified: boolean;
        public copiedFrom: string;

        public menuOptions: any;

        static $inject =
        [
            '$scope', '$window', '$uibModal', '$state', '$stateParams',
            'strandsService', 'modifierTemplatesService', 'lookupService'
        ];
        constructor(
            private $scope: IEditImportedStrandScope,
            private $window: ng.IWindowService,
            private $uibModal: angular.ui.bootstrap.IModalService,
            private $state: angular.ui.IStateService,
            private $stateParams: angular.ui.IStateParamsService,
            private strandsService: App.Strands.Services.IStrandsService,
            private modifierService: App.Services.IModifierTemplatesService,
            private lookupService: App.Services.ILookupService) {

            let importedStrand = $stateParams["strand"];
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
            this.chosenModStructures = this.strand.StrandModStructures.map((sm) => { return sm.ModStructure }) || [];

            this.initialize();
            this.loadLookupData();
        }

        initialize() {
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
                    'Set As First', ($itemScope) => {
                        $itemScope.$parent.vm.strand.FirstPosition = $itemScope.mod.OrdinalPosition;
                    }, ($itemScope) => {
                        if ($itemScope.mod.Name == undefined) {
                            return null;
                        }
                        return $itemScope.mod != null;
                    }
                ],
                [
                    'Delete', ($itemScope) => {
                        var index = $itemScope.$parent.vm.chosenModStructures.indexOf($itemScope.mod);
                        if (index !== -1) {
                            $itemScope.$parent.vm.chosenModStructures.splice(index, 1);
                        }
                    }, ($itemScope) => {
                        if ($itemScope.mod.OrdinalPosition === $itemScope.$parent.vm.strand.FirstPosition) {
                            return null;
                        }
                        return $itemScope.mod != null;
                    }
                ],
                [
                    'Insert', $itemScope => {
                        var index = $itemScope.$parent.vm.chosenModStructures.indexOf($itemScope.mod);
                        if (index !== -1) {
                            $itemScope.$parent.vm.chosenModStructures.splice(index, 0, { Base: '', Name: '' });
                        }
                    }, $itemScope => {
                        if ($itemScope.mod.Name == undefined) {
                            return null;
                        }
                        return $itemScope.mod != null;
                    }
                ]
            ];
            this.$scope.$watch(() => {
                return this.chosenModStructures.length;
            },
                (a: number, b: number) => {
                    if (a !== b) {
                        this.recalculatePositions();
                    }
                });
            this.$scope.$watch(() => {
                return this.chosenModStructures;
            },
                (a: Array<App.Strands.Models.ModStructureModel>) => {
                    if (a.length > 0 && !angular.isDefined(a[0].OrdinalPosition)) {
                        this.recalculatePositions();
                    }
                });
        }

        permitSave(): boolean {
            return this.validChosenModStructures() &&
                angular.isDefined(this.strand.Target.Name) &&
                angular.isDefined(this.strand.Orientation.Name);
        }

        returnStrand(): void {
            this.strand.StrandModStructures = [];
            if (angular.isDefined(this.selectedFirstPosition.OrdinalPosition)) {
                this.strand.FirstPosition = this.selectedFirstPosition.OrdinalPosition;
            }
            for (var i = 0; i < this.chosenModStructures.length; i++) {
                if (this.chosenModStructures[i].Name != undefined) {
                    let modStructure: App.Strands.Models.StrandModStructureModel = {
                        ModStructure: this.chosenModStructures[i],
                        OrdinalPosition: i + 1,
                        HasErrors: false
                    };
                    this.strand.StrandModStructures.push(modStructure);
                }
            }
            this.$state.go('importStrand', { strand: this.strand });
        }

        resetForm(): void {
            this.chosenModStructures = [];
            this.sequenceEntered = '';
            this.copiedFrom = 'None';
            this.sequenceEnteredError = '';
            this.modifierTemplate = { Name: 'None' };
            let strandId = this.strand.Id;
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
        }

        cancelChanges(): void {
            this.$window.location.href = '/Strand';
        }

        selectSpecies(species: App.Strands.Models.SpeciesModel): void {
            let speciesList = this.strand.Species;
            let filteredSpeciesList = speciesList.filter((item) => {
                return item.Id !== species.Id;
            });
            if (filteredSpeciesList.length !== speciesList.length) {
                this.strand.Species = filteredSpeciesList;
            } else {
                this.strand.Species.push(species);
            }
        }

        isSpeciesSelected(species: App.Strands.Models.SpeciesModel): boolean {
            let speciesList = this.strand.Species;
            if (!angular.isDefined(speciesList))
                return false;

            let locatedIndex = App.Common.Utils.searchFor(speciesList, "Name", species.Name);
            if (locatedIndex != null) {
                return true;
            } else {
                return false;
            }
        }

        baseSequence(): string {
            let seq = '';
            for (let i = 0; i < this.chosenModStructures.length; i++) {
                if (angular.isDefined(this.chosenModStructures[i].Base)) {
                    seq = seq + this.chosenModStructures[i].Base;
                }
            }

            return seq;
        }

        modifiedSequence(): string {
            let seq = '';
            for (let i = 0; i < this.chosenModStructures.length; i++) {
                if (angular.isDefined(this.chosenModStructures[i].Name)) {
                    seq = seq + this.chosenModStructures[i].Name;
                }
            }

            return seq;
        }

        onModifierTemplateChange(): void {
            let modifierTemplateId = this.modifierTemplate.Id;
            let baseSequence = this.baseSequence();
            let firstPosition = this.strand.FirstPosition;

            this.modifierService.getModifierTemplate(modifierTemplateId, baseSequence, firstPosition)
                .then((data: App.Strands.Models.ModifierTemplateModel) => {
                    this.buildChosenModStructuresFromTemplate(data.ModifiedSequence);
                });
        }

        recalculatePositions(): void {
            for (let i = 0; i < this.chosenModStructures.length; i++) {
                this.chosenModStructures[i].OrdinalPosition = i + 1;
            }
        }

        changeInModStructure(mod: App.Strands.Models.ModStructureModel): void {
            if (mod.Name.length === 0) return;
            var modStructure = App.Common.Utils.searchFor(this.availableModStructures, 'Name', mod.Name);
            if (modStructure != null) {
                var modStructWithOrdinal: App.Strands.Models.ModStructureModel = {
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
        }

        buildChosenModStructures(): void {
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
                var modStructWithOrdinal: App.Strands.Models.ModStructureModel = {
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
                } else {
                    modStructWithOrdinal.Base = sequenceArray[i];
                }
                this.chosenModStructures.push(modStructWithOrdinal);
            }
        }

        buildChosenModStructuresFromTemplate(sequence: string): void {
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
                var modStructWithOrdinal: App.Strands.Models.ModStructureModel = {
                    Name: '',
                    OrdinalPosition: 0,
                    Base: '',
                    HasErrors: false
                };
                if (modStructure != null) {
                    angular.copy(modStructure, modStructWithOrdinal);
                    modStructWithOrdinal.Name = modStructWithOrdinal.Name;
                } else {
                    modStructWithOrdinal.Base = sequenceArray[i];
                }
                this.chosenModStructures.push(modStructWithOrdinal);
            }
        }

        sequenceDelimiter(): string {
            if (this.entryUsingModified) return ',';
            return '';
        }

        modStructureProperty(): string {
            if (this.entryUsingModified) return 'Name';
            return 'Base';
        }

        validChosenModStructureBases(): boolean {
            if (this.chosenModStructures.length === 0) return false;
            for (var i = 0; i < this.chosenModStructures.length; i++) {
                if (!angular.isDefined(this.chosenModStructures[i])) {
                    return false;
                }
            }
            return true;
        }

        validChosenModStructures(): boolean {
            if (this.chosenModStructures.length === 0) return false;
            for (var i = 0; i < this.chosenModStructures.length; i++) {
                if (!angular.isDefined(this.chosenModStructures[i])) {
                    return false;
                }
            }
            return true;
        }

        buildChosenModStructuresFromCopy(strandModStructures: Array<App.Strands.Models.StrandModStructureModel>): void {
            this.selectedModStructure = {
                Base: '',
                OrdinalPosition: 0,
                Name: '',
                HasErrors: false
            };
            this.chosenModStructures = [];
            for (var i = 0; i < strandModStructures.length; i++) {
                var modStructWithOrdinal: App.Strands.Models.ModStructureModel = {
                    Base: '',
                    OrdinalPosition: 0,
                    Name: '',
                    HasErrors: false
                };
                angular.copy(strandModStructures[i].ModStructure, modStructWithOrdinal);
                modStructWithOrdinal.Name = strandModStructures[i].ModStructure.Name;
                this.chosenModStructures.push(modStructWithOrdinal);
            }
        }

        prependModifier(): void {
            this.chosenModStructures.unshift({
                Base: '',
                OrdinalPosition: 0,
                Name: '',
                HasErrors: false
            });
        }

        appendModifier(): void {
            this.chosenModStructures.push({
                Base: '',
                OrdinalPosition: 0,
                Name: '',
                HasErrors: false
            });
        }

        getCopyStrandSpecies(strandId: number): void {
            this.strandsService.getStrandSpecies(strandId)
                .then((data: Array<App.Strands.Models.SpeciesModel>) => {
                    this.strand.Species = data;
                });
        }

        loadLookupData(): void {
            this.lookupService.get()
                .then((data) => {
                    this.availableTargets = data.Targets;
                    this.availableOrientations = data.Orientations;
                    this.availableSpeciesList = data.SpeciesList;
                    this.availableModStructures = data.ModStructures;
                });
        }

        getPositionDecorator(): string {
            if (this.strand.Orientation.Name != undefined && this.strand.Orientation.Name === "Sense") {
                return '\'';
            }
            return '';
        }

        getPositionRelativeToFirst(mod: App.Strands.Models.ModStructureModel): string {
            let positionInd = this.getPositionDecorator();
            let indexOfFp = this.strand.FirstPosition - 1;
            let indexOfMod = this.chosenModStructures.indexOf(mod);
            let unAdjustedRelativePosition;
            if (positionInd === '') {
                unAdjustedRelativePosition = indexOfMod - indexOfFp;    // Antisense
            } else {
                unAdjustedRelativePosition = indexOfFp - indexOfMod;    // Sense
            }
            if (unAdjustedRelativePosition >= 0) {
                unAdjustedRelativePosition++;
            }

            return unAdjustedRelativePosition + this.getPositionDecorator();
        }

        selectModifierTemplate(): void {
            let modalSettings: ng.ui.bootstrap.IModalSettings = {
                templateUrl: '/Scripts/angular-app/widgets/selectModalTemplate.html',
                controller: 'SelectModalCtrl',
                controllerAs: "vm",
                size: 'lg',
                resolve: {
                    selectModalConfig: (): App.Widgets.ISelectModalConfig => {
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
                        }
                    },
                    searchResource: (): App.Widgets.ISearchResource => {
                        return {
                            getData: (query): ng.IPromise<any> => {
                                return this.modifierService.getModifierTemplates(query);
                            }
                        }
                    }
                }
            };
            var modalInstance = this.$uibModal.open(modalSettings);
            modalInstance.result.then((result) => {
                if (result !== 'cancel') {
                    this.modifierTemplate = result;
                    this.onModifierTemplateChange();
                };
            });
        }

        copyExistingStrand(): void {
            let modalSettings: ng.ui.bootstrap.IModalSettings = {
                templateUrl: '/Scripts/angular-app/widgets/selectModalTemplate.html',
                controller: 'SelectModalCtrl',
                controllerAs: "vm",
                size: 'lg',
                resolve: {
                    selectModalConfig: (): App.Widgets.ISelectModalConfig => {
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
                        }
                    },
                    searchResource: (): App.Widgets.ISearchResource => {
                        return {
                            getData: (query): ng.IPromise<any> => {
                                return this.strandsService.getStrands(query);
                            }
                        }
                    }
                }
            };
            var modalInstance = this.$uibModal.open(modalSettings);
            modalInstance.result.then((result) => {
                if (result !== 'cancel') {
                    this.getCopyStrandSpecies(result.Id);
                    this.modifierTemplate = { Name: 'None' };
                    this.copiedFrom = result.ArrowheadStrandId;
                    this.strand.FirstPosition = result.FirstPosition;
                    this.strand.Orientation = result.Orientation;
                    this.strand.Target = result.Target;
                    this.strand.Notes = result.Notes;
                    this.strand.GenomeNumber = result.GenomeNumber;
                    this.strand.GenomePosition = result.GenomePosition;
                    this.strand.ParentSequence = result.ParentSequence;
                    this.buildChosenModStructuresFromCopy(result.StrandModStructures);
                    this.$scope.form.$dirty = true;
                };
            });
        }
    }

    App.getAppContainer()
        .getSection('app.strands')
        .getInstance()
        .controller('EditImportedStrandCtrl', EditImportedStrandCtrl)
        .controller('SelectModalCtrl', App.Widgets.SelectModalCtrl);
}