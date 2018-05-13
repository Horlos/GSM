var App;
(function (App) {
    var SynthesisRequests;
    (function (SynthesisRequests) {
        var ExportSequenceCtrl = (function () {
            function ExportSequenceCtrl($uibModal, synthesisRequestsService, strandsService, lookupService) {
                this.$uibModal = $uibModal;
                this.synthesisRequestsService = synthesisRequestsService;
                this.strandsService = strandsService;
                this.lookupService = lookupService;
                this.initialize();
                this.initializeGrids();
                this.loadInstruments();
            }
            ExportSequenceCtrl.prototype.initialize = function () {
                this.selectedStrands = [];
                this.selectedStrandToRemove = null;
                this.totalAmiditesMessage = "";
                this.InstrumentModStructuresSize = 0;
                this.StrandModStructures = [];
                this.selectedInstrument = null;
            };
            ExportSequenceCtrl.prototype.initializeGrids = function () {
                var _this = this;
                this.strandsGrid = {
                    enableRowSelection: true,
                    enableRowHeaderSelection: false,
                    enableColumnMenus: false,
                    enableHorizontalScrollbar: true,
                    multiSelect: false,
                    columnDefs: [
                        { name: 'ArrowheadStrandID', displayName: 'Strand ID', field: 'ArrowheadStrandId', width: 100 },
                        { name: 'Target.Name', displayName: 'Target', width: 80 },
                        { name: 'Orientation.Name', displayName: 'Orientation', width: 100 },
                        { name: 'Sequence', displayName: 'Sequence' }
                    ],
                    onRegisterApi: function (gridApi) {
                        _this.onRegisterApi(gridApi);
                    }
                };
                this.machineCodesGrid = {
                    enableRowSelection: false,
                    enableRowHeaderSelection: false,
                    enableColumnMenus: false,
                    enableHorizontalScrollbar: false,
                    multiSelect: false,
                    columnDefs: [
                        { field: 'ModStructure.Name', displayName: 'Name' },
                        {
                            field: 'InstrumentModStructure.Code',
                            displayName: 'Code'
                        }
                    ]
                };
            };
            ExportSequenceCtrl.prototype.onRegisterApi = function (gridApi) {
                var _this = this;
                this.gridApi = gridApi;
                gridApi.selection.on.rowSelectionChanged(null, function (row) {
                    if (row.isSelected) {
                        _this.selectedStrandToRemove = row.entity;
                    }
                    else {
                        _this.selectedStrandToRemove = null;
                    }
                });
            };
            ExportSequenceCtrl.prototype.addItemsStrand = function () {
                var _this = this;
                var modalSettings = {
                    templateUrl: '/Scripts/angular-app/widgets/selectModalTemplate.html',
                    controller: 'SelectModalCtrl',
                    controllerAs: 'vm',
                    size: 'lg',
                    resolve: {
                        selectModalConfig: function () {
                            return {
                                gridOptions: {
                                    multiSelect: true,
                                    columnDefs: [
                                        {
                                            name: 'ArrowheadStrandID',
                                            displayName: 'Strand ID',
                                            field: 'ArrowheadStrandId'
                                        },
                                        {
                                            name: 'Target.Name',
                                            displayName: 'Target',
                                            field: 'Target.Name'
                                        }
                                    ]
                                },
                                collectionName: 'ItemList',
                                prompt: 'Select Strands'
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
                        _this.addSelectedStrands(result);
                    }
                    ;
                });
            };
            ExportSequenceCtrl.prototype.addSelectedStrands = function (result) {
                //if there are selected records
                if (result != null && result.length > 0) {
                    App.Common.Utils.addRange(this.selectedStrands, result);
                    this.strandsGrid.data = this.selectedStrands;
                    this.extractModStructures();
                }
            };
            ExportSequenceCtrl.prototype.extractModStructures = function () {
                var _this = this;
                this.InstrumentModStructuresSize = 0;
                this.StrandModStructures = [];
                angular.forEach(this.selectedStrands, function (strand) {
                    angular.forEach(strand.StrandModStructures, function (strandModStructure) {
                        if (_this.StrandModStructures.length < 1 ||
                            !_this.StrandModStructures.some(function (item) {
                                return item.ModStructureId === strandModStructure.ModStructureId;
                            })) {
                            _this.StrandModStructures.push(strandModStructure);
                        }
                    });
                });
                this.instrumentSelected();
                //console.log(exportSequence.machineCodes.data);
            };
            ExportSequenceCtrl.prototype.instrumentSelected = function () {
                var _this = this;
                this.InstrumentModStructuresSize = 0;
                if (this.selectedInstrument != null) {
                    angular.forEach(this.StrandModStructures, function (strandModStructure) {
                        var instrumentModStructures = strandModStructure.ModStructure.InstrumentModStructures;
                        var found = instrumentModStructures.filter(function (modStructure) {
                            return modStructure.InstrumentId === _this.selectedInstrument.Id;
                        });
                        if (found.length === 1) {
                            _this.InstrumentModStructuresSize += 1;
                            strandModStructure.InstrumentModStructure = found[0];
                        }
                    });
                }
                //consolo.log("Instrument %o", exportSequence.Instrument, exportSequence.InstrumentModStructuresSize);
                this.machineCodesGrid.data = this.StrandModStructures;
                //console.log(exportSequence.machineCodes.data);
            };
            ExportSequenceCtrl.prototype.canSubmit = function () {
                this.totalAmiditesMessage = "";
                if (this.selectedStrands.length > 0 &&
                    this.selectedInstrument != null) {
                    //StrandModStructures the unique amidities list
                    //console.log("Instrument soported mode structures ", );
                    if (this.InstrumentModStructuresSize < this.StrandModStructures.length) {
                        this.totalAmiditesMessage = "This machine only supports " +
                            this.InstrumentModStructuresSize + " amidites.";
                        return false;
                    }
                    return true;
                }
                return false;
            };
            ExportSequenceCtrl.prototype.exportFile = function () {
                this.synthesisRequestsService.exportFile(this.selectedStrands, this.selectedInstrument);
            };
            ExportSequenceCtrl.prototype.loadInstruments = function () {
                var _this = this;
                this.lookupService.getTable('Instruments')
                    .then(function (data) {
                    _this.availableInstruments = data.Instruments;
                });
            };
            ExportSequenceCtrl.prototype.removeSelectedStrand = function () {
                if (this.selectedStrandToRemove != null) {
                    App.Common.Utils.findAndRemove(this.selectedStrands, this.selectedStrandToRemove);
                    this.selectedStrandToRemove = null;
                    //recalc modeStructures
                    this.extractModStructures();
                }
            };
            ExportSequenceCtrl.$inject = ['$uibModal', 'synthesisRequestsService', 'strandsService', 'lookupService'];
            return ExportSequenceCtrl;
        }());
        App.getAppContainer()
            .getSection("app.synthesisRequests")
            .getInstance()
            .controller("ExportSequenceCtrl", ExportSequenceCtrl)
            .controller('SelectModalCtrl', App.Widgets.SelectModalCtrl);
    })(SynthesisRequests = App.SynthesisRequests || (App.SynthesisRequests = {}));
})(App || (App = {}));
//# sourceMappingURL=exportSequenceCtrl.js.map