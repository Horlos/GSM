var app = angular.module('editStrandApp', ['ngResource', 'ui.bootstrap.contextMenu', 'ui.bootstrap', 'ui.grid', 'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.grid.selection']);

app.factory('lookupResource', ['$resource', function (resource) {
	return resource('/api/lookup',
		{
			'table': ['Targets', 'Orientations', 'SpeciesList', 'ModStructures', 'ModStructureTypes']
		}
	);
}]);

app.factory('strandResource', ['$resource', function (resource) {
	return resource('/api/strands/:strandId', { strandId: '@StrandID' });
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

function StrandController(scope, window, uibModal, location, lookupResource, strandResource, strandSpeciesResource, modifierResource, modifierTemplateResource) {
	this.lookupResource = lookupResource;
	this.strandResource = strandResource;
	this.location = location;
	this.strandSpeciesResource = strandSpeciesResource;
	this.modifierResource = modifierResource;
	this.modifierTemplateResource = modifierTemplateResource;
	this.scope = scope;
	this.window = window;
	this.back = '/Strand';
	this.uibModal = uibModal;
	this.MvcController = MvcController(this.window.location.pathname);
	scope.deleteConfirmation = angular.bind(this, DeleteConfirmation);
	scope.deleteCompleted = angular.bind(this, DeleteCompleted);
	scope.viewModeChange = angular.bind(this, this.viewModeChange);
	scope.pageMode = PageMode;
	scope.editMode = false;
	scope.menuOptions = [];
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
	scope.sequenceEntered = '';
	scope.sequenceEnteredError = '';
	scope.totalAmountRemaining = 0;
	scope.strand = {
		StrandModStructures: [],
		Batches: [],
		FirstPosition: 1,
		Name: '',
		Orientation: {},
		Target: {},
		GenomeNumber: '',
		GenomePosition: '',
		Notes: '',
		Species: [],
		Error: {}
	};
	scope.batchesGridOptions = {
		enableColumnMenus: false,
		enableRowSelection: true,
		enableRowHeaderSelection: false,
		multiSelect: false,
		modifierKeysToMultiSelect: false,
		noUnselect: true,
		columnDefs: [
			{
				name: 'ArrowHeadBatchNumber',
				displayName: 'Batch Number',
				field: 'ArrowHeadBatchNumber'
			},
			{
				name: 'InitiatedDate',
				field: 'InitiatedDate',
				cellFilter: 'date:\'yyyy-MM-dd\''
			},
			{
				name: 'AmountRemaining',
				field: 'AmountRemaining',
				cellFilter: 'number: 1'
			},
			{
				name: 'Unavailable',
				displayName: 'Unavailable',
				field: 'Unavailable',
				visible: true,
				type: 'boolean',
				cellTemplate: '<input type="checkbox" ng-model="row.entity.Unavailable" disabled>'
			}
		],
		onRegisterApi: function (gridApi) {
			scope.gridApi = gridApi;
			gridApi.selection.on.rowSelectionChanged(scope,
				function (row) {
					window.location.pathname = '/Strand/EditStrandBatch/' + row.entity.Id;
				});
		}
	}
	scope.modStructureTypes = [];
	scope.$watch('chosenModStructures.length', function (a, b) {
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
	scope.baseSequence = angular.bind(this, this.baseSequence);
	scope.onModifierTemplateChange = angular.bind(this, this.onModifierTemplateChange);
	scope.modifiedSequence = angular.bind(this, this.modifiedSequence);
	scope.modStructureProperty = angular.bind(this, this.modStructureProperty);
	scope.isSpeciesSelected = angular.bind(this, this.isSpeciesSelected);
	scope.selectModifierTemplate = angular.bind(this, this.selectModifierTemplate);
	scope.sequenceDelimiter = angular.bind(this, this.sequenceDelimiter);
	scope.changeInModStructure = angular.bind(this, this.changeInModStructure);
	scope.reCalcPositions = angular.bind(this, this.reCalcPositions);
	scope.applyModifierTemplateCompleted = angular.bind(this, this.applyModifierTemplateCompleted);
	scope.validChosenModStructureBases = angular.bind(this, this.validChosenModStructureBases);
	scope.validChosenModStructures = angular.bind(this, this.validChosenModStructures);
	scope.rebuildContextMenu = angular.bind(this, this.rebuildContextMenu);
	scope.updateModStructureTypes = angular.bind(this, this.updateModStructureTypes);
	scope.getPositionDecorator = angular.bind(this, this.getPositionDecorator);
	scope.getPositionRelativeToFirst = angular.bind(this, this.getPositionRelativeToFirst);
	scope.buildChosenModStructuresFromTemplate = angular.bind(this, this.buildChosenModStructuresFromTemplate);
	scope.prependModifier = angular.bind(this, this.prependModifier);
	scope.getModStructureCount = angular.bind(this, this.getModStructureCount);
	scope.appendModifier = angular.bind(this, this.appendModifier);
	scope.loadStrandData = angular.bind(this, this.loadStrandData);
	scope.onloadStrandDataCompleted = angular.bind(this, this.onloadStrandDataCompleted);
	scope.resetForm = angular.bind(this, this.resetForm);
	scope.getColumnIdentity = angular.bind(this, this.getColumnIdentity);

	scope.delete = angular.bind(this, this.delete);
	scope.saveStrand = angular.bind(this, this.saveStrand);
	scope.permitSave = angular.bind(this, this.permitSave);
	this.loadLookupData();
}

StrandController.prototype.delete = function (response) {
	if (response == 'ok') {
		var proxy = this.strandResource.delete({ strandId: this.scope.strand.Id });
		proxy.$promise.then(angular.bind(this, OnDeleteCompleted));
	}
}

StrandController.prototype.viewModeChange = function () {
	this.scope.editMode = !this.scope.editMode;
	this.scope.rebuildContextMenu();
}

StrandController.prototype.rebuildContextMenu = function () {
	if (this.scope.editMode) {
		this.scope.menuOptions = [
			[
				'Set As First', function ($itemScope) {
					$itemScope.$parent.strand.FirstPosition = $itemScope.mod.OrdinalPosition;
					$itemScope.$parent.strandForm.$dirty = true;
				}, function ($itemScope) {
					if ($itemScope.mod.Name == undefined || !$itemScope.$parent.editMode) {
						return null;
					}
					return $itemScope.mod != null;
				}
			],
			[
				'Delete', function ($itemScope) {
					var index = $itemScope.$parent.chosenModStructures.indexOf($itemScope.mod);
					if (index !== -1) {
						$itemScope.$parent.chosenModStructures.splice(index, 1);
						$itemScope.$parent.strandForm.$dirty = true;
						if (index < $itemScope.$parent.strand.FirstPosition)
							$itemScope.$parent.strand.FirstPosition--;
					}
				}, function ($itemScope) {
					if ($itemScope.mod.OrdinalPosition == $itemScope.$parent.strand.FirstPosition || !$itemScope.$parent.editMode) {
						return null;
					}
					return $itemScope.mod != null;
				}
			],
			[
				'Insert', function ($itemScope) {
					var index = $itemScope.$parent.chosenModStructures.indexOf($itemScope.mod);
					if (index != -1) {
						$itemScope.$parent.chosenModStructures.splice(index, 0, { Base: '', Name: '' });
						$itemScope.$parent.strandForm.$dirty = true;
					}
				}, function ($itemScope) {
					if ($itemScope.mod.Name == undefined || !$itemScope.$parent.editMode) {
						return null;
					}
					return $itemScope.mod != null;
				}
			]
		];
	} else {
		this.scope.menuOptions = [];
	}

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
	var proxy = this.strandResource.save({ strandId: this.scope.strand.Id }, this.scope.strand);
	proxy.$promise.then(angular.bind(this, this.onSaveCompleted));
}

StrandController.prototype.resetForm = function () {
	this.scope.chosenModStructures = [];
	this.scope.sequenceEntered = '';
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
		Notes: '',
		Species: [],
		Error: {}
	};
}

StrandController.prototype.baseSequence = function () {
	var seq = "";
	for (var i = 0; i < this.scope.chosenModStructures.length; i++) {
		if (this.scope.chosenModStructures[i].Base != undefined && this.scope.chosenModStructures[i].Base.length > 0) {
			seq += this.scope.chosenModStructures[i].Base;
		} else {
			seq += ' ';
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

StrandController.prototype.selectModifierTemplate = function () {
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
			searchResource: function () {
				return {
					getData: function (query) {
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

StrandController.prototype.onSaveCompleted = function (editStrand) {
	this.scope.strand.Error = editStrand.Errors;
	this.scope.strandForm.$setPristine();
	if (!editStrand.HasErrors) {
		this.window.location.href = '/' + this.MvcController + '/Edit/' + editStrand.Id;
	}
}

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

StrandController.prototype.getColumnIdentity = function () {
	var length = this.scope.chosenModStructures.length;
	if (length > 0) {
		var modStructure = this.scope.chosenModStructures[length - 1];
		if (modStructure)
			return modStructure.Name;
	}

	return '';
}

StrandController.prototype.buildChosenModStructures = function (seq) {
	this.scope.sequenceEnteredError = '';
	this.scope.selectedModStructure = {};
	this.scope.chosenModStructures = [];
	var sequenceArray = seq.split(this.scope.sequenceDelimiter());
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
		unAdjustedRelativePosition = indexOfMod - indexOfFp;
	} else {
		unAdjustedRelativePosition = indexOfFp - indexOfMod;
	}
	if (unAdjustedRelativePosition >= 0) {
		unAdjustedRelativePosition++;
	}

	return unAdjustedRelativePosition + this.scope.getPositionDecorator();
}

StrandController.prototype.sequenceDelimiter = function () {
	if (this.scope.EntryUsingModified) return ',';
	return '';
}

StrandController.prototype.loadStrandData = function () {
	var proxy = this.strandResource.get({ strandId: LastUrlParam(this.location.absUrl()) });
	proxy.$promise.then(angular.bind(this, this.onloadStrandDataCompleted));
}

StrandController.prototype.onloadStrandDataCompleted = function (data) {
	this.scope.strand = data;
	this.scope.strand.Species = data.Species || [];
	this.scope.batchesGridOptions.data = data.Batches;
	for (var i = 0; i < data.Batches.length; i++) {
		this.scope.totalAmountRemaining += data.Batches[i].AmountRemaining;
	}

	for (var i = 0; i < data.StrandModStructures.length; i++) {
		this.scope.updateModStructureTypes(data.StrandModStructures[i].ModStructure);
		data.StrandModStructures[i].ModStructure.SelectedModName = data.StrandModStructures[i].ModStructure.Name;
		this.scope.chosenModStructures.push(data.StrandModStructures[i].ModStructure);
	}
}

StrandController.prototype.updateModStructureTypes = function (modStructureData) {
	var modStructureSummary = SearchFor(this.scope.modStructureTypes, "Id", modStructureData.ModStructureTypeId);
	if (modStructureSummary != null) {
		var modStructure = SearchFor(modStructureSummary.ModStructures, "Id", modStructureData.Id);
		if (modStructure != null) {
			modStructure.Count++;
		} else {
			modStructureSummary.ModStructures.push({
				Name: modStructureData.Name,
				Id: modStructureData.Id,
				Count: 1
			});
		}
	}
}

StrandController.prototype.getModStructureCount = function (mod) {
	var result = 0;
	for (var i = 0; i < mod.ModStructures.length; i++) {
		result = result + mod.ModStructures[i].Count;
	}
	return result;
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

StrandController.prototype.prependModifier = function () {
	this.scope.chosenModStructures.unshift({ Base: '' });
	this.scope.strand.FirstPosition++;
}

StrandController.prototype.appendModifier = function () {
	this.scope.chosenModStructures.push({ Base: '' });
}

StrandController.prototype.cancelChanges = function () {
	this.window.location.href = '/' + this.MvcController + '/Edit/' + LastUrlParam(this.location.absUrl());
}

StrandController.prototype.loadLookupData = function () {
	var proxy = this.lookupResource.get({});
	proxy.$promise.then(angular.bind(this, this.onLoadLookupCompleted));
}

StrandController.prototype.onLoadLookupCompleted = function (data) {
	this.scope.availableTargets = data.Targets;
	this.scope.availableOrientations = data.Orientations;
	this.scope.availableSpeciesList = data.SpeciesList;
	this.scope.availableModStructures = data.ModStructures;
	this.scope.modStructureTypes = data.ModStructureTypes;
	for (var i = 0; i < this.scope.modStructureTypes.length; i++) {
		this.scope.modStructureTypes[i].ModStructures = [];
	}
	this.scope.loadStrandData();
}

StrandController.prototype.selectSpecies = function (species) {
	this.scope.strandForm.$dirty = true;
	var speciesList = this.scope.strand.Species || [];
	var filteredSpeciesList = speciesList.filter(function (item) {
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
app.controller('editStrandController', ['$scope', '$window', '$uibModal', '$location', 'lookupResource', 'strandResource', 'strandSpeciesResource', 'modifierResource', 'modifierTemplateResource', StrandController]);
app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance) {
	$scope.ok = function () {
		$uibModalInstance.close('ok');
	};
	$scope.cancel = function () {
		$uibModalInstance.close('cancel');
	};
});