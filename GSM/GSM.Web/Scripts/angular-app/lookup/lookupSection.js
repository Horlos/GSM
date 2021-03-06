var App;
(function (App) {
    var Lookup;
    (function (Lookup) {
        var section = new App.Framework.AppSection('app.lookup', [
            'ui.grid',
            'ui.grid.moveColumns',
            'ui.grid.pagination',
            'ui.grid.resizeColumns',
            'ui.grid.selection',
            'ui.grid.autoFitColumns',
            'common.router',
            'app.services'
        ]);
        App.getAppContainer().addSection(section);
        var LookupConfig = (function () {
            function LookupConfig() {
                this.views = {
                    targets: {
                        headerTitle: 'Targets',
                        apiUrl: '/api/targets',
                        baseUrl: '/lookup/targets',
                        userSearchSettings: 'TargetSearchSettings',
                        viewDetailUrl: function (id) { return "/Target/Edit/" + id; },
                        columnDefs: [
                            { name: 'Name', field: 'Name', visible: true },
                            { name: 'IsActive', field: 'IsActive', visible: true }
                        ]
                    },
                    instruments: {
                        headerTitle: 'Instruments',
                        apiUrl: '/api/Instruments',
                        baseUrl: '/lookup/instruments',
                        userSearchSettings: 'InstrumentSearchSettings',
                        viewDetailUrl: function (id) { return "/Instrument/Edit/" + id; },
                        columnDefs: [
                            { name: 'Name', field: 'Name', visible: true },
                            { name: 'MaxAmidites', field: 'MaxAmidites', visible: true },
                            { name: 'IsActive', field: 'IsActive', visible: true }
                        ]
                    },
                    species: {
                        headerTitle: 'Species',
                        apiUrl: '/api/species',
                        baseUrl: '/lookup/species',
                        userSearchSettings: 'SpeciesSearchSettings',
                        viewDetailUrl: function (id) { return "/Species/Edit/" + id; },
                        columnDefs: [
                            { name: 'Name', field: 'Name', visible: true },
                            { name: 'IsActive', field: 'IsActive', visible: true }
                        ]
                    },
                    modStructures: {
                        headerTitle: 'Modifier Structures',
                        apiUrl: '/api/modstructures',
                        baseUrl: '/lookup/modstructures',
                        userSearchSettings: 'ModStructureSearchSettings',
                        viewDetailUrl: function (id) { return "/ModStructure/Edit/" + id; },
                        columnDefs: [
                            { name: 'Name', field: 'Name', visible: true },
                            { name: 'Base', field: 'Base', visible: true },
                            { name: 'StartingMaterialMW', field: 'StartingMaterialMW', visible: true },
                            { name: 'IncorporatedMW', field: 'IncorporatedMW', visible: true },
                            { name: 'VendorName', field: 'VendorName', visible: true },
                            { name: 'VendorCatalogNumber', field: 'VendorCatalogNumber', visible: true },
                            { name: 'Coupling', field: 'Coupling', visible: true },
                            { name: 'Deprotection', field: 'Deprotection', visible: true },
                            { name: 'Formula', field: 'Formula', visible: true }
                        ]
                    },
                    strands: {
                        headerTitle: 'Strands',
                        apiUrl: '/api/strands',
                        baseUrl: '/lookup/strands',
                        userSearchSettings: 'StrandSearchSettings',
                        viewDetailUrl: function (id) { return "/Strand/Edit/" + id; },
                        columnDefs: [
                            {
                                name: 'ArrowheadStrandId',
                                displayName: 'Strand ID',
                                visible: true,
                                field: 'ArrowheadStrandId'
                            },
                            {
                                name: 'GenomeNumber',
                                field: 'GenomeNumber',
                                visible: true
                            },
                            {
                                name: 'GenomePosition',
                                field: 'GenomePosition',
                                visible: true
                            },
                            {
                                name: 'Sequence',
                                field: 'Sequence',
                                visible: true
                            },
                            {
                                name: 'BaseSequence',
                                field: 'BaseSequence',
                                visible: true
                            },
                            {
                                name: 'MW',
                                field: 'MW',
                                visible: true
                            },
                            {
                                name: 'ExtinctionCoefficient',
                                field: 'ExtinctionCoefficient',
                                visible: true
                            },
                            {
                                name: 'ColumnIdentity',
                                field: 'ColumnIdentity',
                                visible: true
                            }
                        ]
                    },
                    duplexes: {
                        headerTitle: 'Duplexes',
                        apiUrl: '/api/duplexes',
                        baseUrl: '/lookup/duplexes',
                        userSearchSettings: 'DuplexSearchSettings',
                        viewDetailUrl: function (id) { return "/Duplex/Edit/" + id; },
                        columnDefs: [
                            {
                                name: 'ArrowheadDuplexId',
                                field: 'ArrowheadDuplexId',
                                displayName: 'Duplex ID',
                                visible: true
                            },
                            {
                                name: 'Target',
                                field: 'Target.Name',
                                displayName: "Target",
                                visible: true
                            },
                            {
                                name: 'SenseStrandId',
                                field: 'SenseStrand.ArrowheadStrandId',
                                displayName: "Sense Strand ID",
                                visible: true
                            },
                            {
                                name: 'AntisenseStrandID',
                                field: 'AntiSenseStrand.ArrowheadStrandId',
                                displayName: "Antisense Strand ID",
                                visible: true
                            },
                            {
                                name: 'MW',
                                field: 'MW',
                                visible: true
                            }
                        ]
                    }
                };
            }
            return LookupConfig;
        }());
        section.getInstance()
            .constant('lookupConfig', new LookupConfig());
    })(Lookup = App.Lookup || (App.Lookup = {}));
})(App || (App = {}));
//# sourceMappingURL=lookupSection.js.map