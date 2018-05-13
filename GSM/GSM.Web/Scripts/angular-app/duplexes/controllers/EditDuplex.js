var app = angular.module('editDuplexApp', ['ngResource', 'ui.bootstrap', 'ui.grid', 'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.grid.selection']);

app.factory('lookupResource', ['$resource', function (resource) {
	return resource('/api/lookup',
		{
			'table': ['Targets']
		}
	);
}]);

app.factory('duplexResource', ['$resource', function (resource) {
	return resource('/api/duplexes/:duplexId', { duplexId: '@DuplexId' });
}]);

function DuplexService(duplexResource) {
	this.duplexResource = duplexResource;
	DuplexService.prototype.Get = function (id, onSuccess) {
		var proxy = this.duplexResource.get({ duplexId: id });
		proxy.$promise.then(angular.bind(this, function (data) {
			if (proxy.$resolved) {
				onSuccess(data);
			}
		}));
	}
};

function EditDuplexController(scope, window, uibModal, location, duplexSvc, duplexResource, lookupResource) {
	this.lookupResource = lookupResource;
	this.duplexSvc = duplexSvc;
	this.window = window;
	this.duplexResource = duplexResource;
	this.uibModal = uibModal;
	this.scope = scope;
	this.location = location;
	this.back = '/Duplex';
	scope.permitEditMode = true;   // Hook to user permission "Modify Lookup Data"
	scope.editMode = false;
	scope.deleteConfirmation = angular.bind(this, DeleteConfirmation);
	scope.deleteCompleted = angular.bind(this, DeleteCompleted);
	scope.viewModeChange = angular.bind(this, ViewModeChange);
	scope.pageMode = PageMode;
	scope.availableTargets = [];
	scope.totalAmountRemaining = 0;
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
		  	field: 'ArrowHeadDuplexBatchNumber'
		  },
		  {
		  	name: 'PreparedDate',
		  	field: 'PreparedDate',
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
			   	window.location.pathname = '/Duplex/EditDuplexBatch/' + row.entity.Id;
			   });
		}
	}


	scope.delete = angular.bind(this, this.delete);
	scope.cancelChanges = angular.bind(this, this.cancelChanges);
	scope.onSaveCompleted = angular.bind(this, this.onSaveCompleted);
	scope.loadDuplexData = angular.bind(this, this.loadDuplexData);
	scope.buildDuplexPositions = angular.bind(this, this.buildDuplexPositions);
	scope.getStrandModStructures = angular.bind(this, this.getStrandModStructures);
	scope.getDisplayModStructures = angular.bind(this, this.getDisplayModStructures);
	scope.getAlignmentAxis = angular.bind(this, this.getAlignmentAxis);
	scope.isBackboneModStructure = angular.bind(this, this.isBackboneModStructure);
	scope.findModStructure = angular.bind(this, this.findModStructure);

	scope.showEdit = angular.bind(this, this.showEdit);
	scope.submit = angular.bind(this, this.submit);
	this.loadLookupData();
	this.loadDuplexData();
}


EditDuplexController.prototype.delete = function (response) {
	if (response == 'ok') {
		var proxy = this.duplexResource.delete({ duplexId: this.scope.editDuplex.Id });
		proxy.$promise.then(angular.bind(this, OnDeleteCompleted));
	}
}

EditDuplexController.prototype.submit = function () {
	var proxy = this.duplexResource.save({ duplexId: this.scope.editDuplex.Id }, this.scope.editDuplex);
	proxy.$promise.then(angular.bind(this, this.onSaveCompleted));
}

EditDuplexController.prototype.loadLookupData = function () {
	var proxy = this.lookupResource.get({});
	proxy.$promise.then(angular.bind(this, this.LookupCompleted));
}

EditDuplexController.prototype.onLoadLookupCompleted = function (data) {
	this.scope.availableTargets = data.ItemList;
}


EditDuplexController.prototype.onSaveCompleted = function (editDuplex) {
	if (editDuplex.HasErrors) {
		this.scope.editDuplex.Error = editDuplex.Errors;
	} else {
		this.scope.editDuplexForm.$setPristine();
		this.scope.editMode = false;
	}
}

EditDuplexController.prototype.cancelChanges = function () {
	this.scope.loadDuplexData();
	this.scope.editDuplexForm.$setPristine();
	this.scope.editMode = false;
}

EditDuplexController.prototype.showEdit = function () {
	return !this.scope.editMode && this.scope.permitEditMode;
}

EditDuplexController.prototype.buildDuplexPositions = function () {
	var antiSenseStrand = this.scope.editDuplex.AntiSenseStrand;
	var sesnseStrand = this.scope.editDuplex.SenseStrand;

	if (antiSenseStrand != null &&
		sesnseStrand != null &&
		antiSenseStrand.FirstPosition != null &&
		sesnseStrand.FirstPosition != null) {
		var senseStrandModStructures = this.scope.getStrandModStructures(sesnseStrand);
		var antiSenseStrandModStructures = this.scope.getStrandModStructures(antiSenseStrand);

		var antiSenseStrandPositions = antiSenseStrandModStructures.map(function (m) { return m.DisplayPosition; });
		var senseStrandPositions = senseStrandModStructures.map(function (m) { return m.DisplayPosition; });

		var rangeLow = Math.min(Math.min.apply(null, senseStrandPositions),
			-Math.max.apply(null, antiSenseStrandPositions));
		var rangeHigh = Math.max(Math.max.apply(null, senseStrandPositions),
			-Math.min.apply(null, antiSenseStrandPositions));

		this.scope.alignmentAxis = this.scope.getAlignmentAxis(rangeLow, rangeHigh);
		this.scope.editDuplex.SenseStrandPositions = this.scope.getDisplayModStructures(senseStrandModStructures, rangeLow, rangeHigh);
		this.scope.editDuplex.AntiSenseStrandPositions = this.scope.getDisplayModStructures(antiSenseStrandModStructures, -rangeHigh, -rangeLow);
	}
}

EditDuplexController.prototype.getAlignmentAxis = function (rangeLow, rangeHigh) {
	var displayPositions = [];
	for (var i = rangeLow; i <= rangeHigh; i++) {
		var position = -i;
		if (i <= 0) {
			position = position + 1;
		}

		displayPositions.push(position.toString());
		if (i < rangeHigh) {
			displayPositions.push("");
		}
	}

	return displayPositions;
}

EditDuplexController.prototype.getDisplayModStructures = function (modStructures, rangeLow, rangeHigh) {
	var displayModStructures = [];
	for (var i = rangeLow; i <= rangeHigh; i++) {
		var position = i;
		if (i < 0)
			position = position - 1;

		var modStructure = this.scope.findModStructure(modStructures, i);
		if (!modStructure) {
			var emptyStructure = {
				Color: '#FFFFFF',
				TextColor: determineTextColor('#FFFFFF'),
				Name: '',
				Position: position
			};
			displayModStructures.push(emptyStructure);
			displayModStructures.push(emptyStructure);
		} else {
			var modStructureName = modStructure.ModStructure.Name;
			var displayColor = modStructure.ModStructure.DisplayColor;

			if (this.scope.isBackboneModStructure(modStructure)) {
				displayModStructures.push({
					Color: displayColor,
					TextColor: determineTextColor(displayColor),
					Name: modStructureName,
					Position: ''
				});
			} else if (modStructureName.endsWith('s')) {
				modStructureName = modStructureName.slice(0, -1);
				displayModStructures.push({
					Color: displayColor,
					TextColor: determineTextColor(displayColor),
					Name: modStructureName,
					Position: position
				});
				displayModStructures.push({
					Color: "#fbf008",
					TextColor: determineTextColor("#fbf008"),
					Name: 's',
					Position: ''
				});
			} else {
				displayModStructures.push({
					Color: displayColor,
					TextColor: determineTextColor(displayColor),
					Name: modStructureName,
					Position: position
				});
				var nextModStructure = this.scope.findModStructure(modStructures, i + 1);
				if (nextModStructure) {
					displayModStructures.push({
						Color: "#D3D3D3",
						TextColor: determineTextColor("#D3D3D3"),
						Name: 'o',
						Position: ''
					});
				}
			}
		}
	}

	return displayModStructures;
}

EditDuplexController.prototype.findModStructure = function (modStructures, displayPosition) {
	return modStructures.find(function (elem) {
		return elem.DisplayPosition === displayPosition;
	});
}

EditDuplexController.prototype.isBackboneModStructure = function (modStructure) {
	return modStructure.ModStructure.Name === 'p';
}

EditDuplexController.prototype.getStrandModStructures = function (strand) {
	var modStructures = strand.StrandModStructures;
	var firstPosition = strand.FirstPosition;
	angular.forEach(modStructures, function (mod) {
		mod.DisplayPosition = mod.OrdinalPosition - firstPosition;
	});
	return modStructures;
}

EditDuplexController.prototype.loadDuplexData = function () {
	this.duplexSvc.Get(LastUrlParam(this.location.absUrl()), angular.bind(this, function (data) {
		this.scope.editDuplex = data;
		this.scope.batchesGridOptions.data = data.Batches;
		for (var i = 0; i < data.Batches.length; i++) {
			this.scope.totalAmountRemaining += data.Batches[i].AmountRemaining;
		}

		this.scope.buildDuplexPositions();
	}));
};

app.service('duplexService', ['duplexResource', DuplexService]);
app.controller('editDuplexController', ['$scope', '$window', '$uibModal', '$location', 'duplexService', 'duplexResource', 'lookupResource', EditDuplexController]);
app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance) {
	$scope.ok = function () {
		$uibModalInstance.close('ok');
	};
	$scope.cancel = function () {
		$uibModalInstance.close('cancel');
	};
});