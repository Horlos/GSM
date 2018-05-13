namespace App.SynthesisRequests {
    class ExportSequenceCtrl {
        public gridApi: uiGrid.IGridApi;
        public selectedInstrument: any;
        public availableInstruments: any[];

        public strandsGrid: uiGrid.IGridOptions;
        public selectedStrands: any[];
        public selectedStrandToRemove: any;

        public InstrumentModStructuresSize: number;
        public StrandModStructures: any[];

        public machineCodesGrid: uiGrid.IGridOptions;
        public totalAmiditesMessage: string;

        static $inject = ['$uibModal', 'synthesisRequestsService', 'strandsService','lookupService'];
        constructor(
            private $uibModal: ng.ui.bootstrap.IModalService,
            private synthesisRequestsService: ISynthesisRequestsService,
            private strandsService: App.Services.IStrandsService,
            private lookupService: App.Services.ILookupService) {
            this.initialize();
            this.initializeGrids();
            this.loadInstruments();
        }

        initialize(): void {
            this.selectedStrands = [];
            this.selectedStrandToRemove = null;
            this.totalAmiditesMessage = "";
            this.InstrumentModStructuresSize = 0;
            this.StrandModStructures = [];
            this.selectedInstrument = null;
        }

        initializeGrids() {
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
                onRegisterApi: (gridApi) => {
                    this.onRegisterApi(gridApi);
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
        }

        onRegisterApi(gridApi: uiGrid.IGridApi) {
            this.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged(null,
                (row) => {
                    if (row.isSelected) {
                        this.selectedStrandToRemove = row.entity;
                    } else {
                        this.selectedStrandToRemove = null;
                    }
                });
        }

        addItemsStrand(): void {
            let modalSettings: ng.ui.bootstrap.IModalSettings = {
                templateUrl: '/Scripts/angular-app/widgets/selectModalTemplate.html',
                controller: 'SelectModalCtrl',
                controllerAs: 'vm',
                size: 'lg',
                resolve: {
                    selectModalConfig: (): App.Widgets.ISelectModalConfig => {
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
                    this.addSelectedStrands(result);
                };
            });
        }

        addSelectedStrands(result) {
            //if there are selected records
            if (result != null && result.length > 0) {
                App.Common.Utils.addRange(this.selectedStrands, result);
                this.strandsGrid.data = this.selectedStrands;
                this.extractModStructures();
            }
        }

        extractModStructures(): void {
            this.InstrumentModStructuresSize = 0;
            this.StrandModStructures = [];
            angular.forEach(this.selectedStrands,
                (strand) => {
                    angular.forEach(strand.StrandModStructures,
                        (strandModStructure) => {
                            if (this.StrandModStructures.length < 1 ||
                                !this.StrandModStructures.some((item) => {
                                    return item.ModStructureId === strandModStructure.ModStructureId;
                                })) {
                                this.StrandModStructures.push(strandModStructure);
                            }
                        });
                });
            this.instrumentSelected();
            //console.log(exportSequence.machineCodes.data);
        }

        instrumentSelected() {
            this.InstrumentModStructuresSize = 0;
            if (this.selectedInstrument != null) {
                angular.forEach(this.StrandModStructures,
                    (strandModStructure) => {
                        let instrumentModStructures: any[] = strandModStructure.ModStructure.InstrumentModStructures;
                        let found = instrumentModStructures.filter((modStructure) => {
                            return modStructure.InstrumentId === this.selectedInstrument.Id;
                        });
                        if (found.length === 1) {
                            this.InstrumentModStructuresSize += 1;
                            strandModStructure.InstrumentModStructure = found[0];
                        }
                    });
            }

            //consolo.log("Instrument %o", exportSequence.Instrument, exportSequence.InstrumentModStructuresSize);
            this.machineCodesGrid.data = this.StrandModStructures;
            //console.log(exportSequence.machineCodes.data);
        }

        canSubmit(): boolean {
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
        }

        exportFile(): void {
            this.synthesisRequestsService.exportFile(this.selectedStrands, this.selectedInstrument);
        }

        loadInstruments(): void {
            this.lookupService.getTable('Instruments')
                .then((data) => {
                    this.availableInstruments = data.Instruments;
                });
        }

        removeSelectedStrand(): void {
            if (this.selectedStrandToRemove != null) {
                App.Common.Utils.findAndRemove(this.selectedStrands, this.selectedStrandToRemove);
                this.selectedStrandToRemove = null;

                //recalc modeStructures
                this.extractModStructures();
            }
        }
    }

    App.getAppContainer()
        .getSection("app.synthesisRequests")
        .getInstance()
        .controller("ExportSequenceCtrl", ExportSequenceCtrl)
        .controller('SelectModalCtrl', App.Widgets.SelectModalCtrl);
}