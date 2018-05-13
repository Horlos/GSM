import IModalService = angular.ui.bootstrap.IModalService;
import IPromise = angular.IPromise;
import IGridOptions = uiGrid.IGridOptions;

/**
 * Ror debugging
 */
var mockData = {
    "ItemList": [{
        "MaterialRequests": [],
        "Orientation": {"OrientationID": 1, "Name": "Sense"},
        "StrandModStructures": [{
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 2,
                    "Code": "A"
                }, {"InstrumentID": 2, "ModStructureID": 2, "Code": "A"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 2,
                    "Code": "A"
                }, {"InstrumentID": 4, "ModStructureID": 2, "Code": "A"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 2,
                    "Code": "A"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 2,
                "Name": "A",
                "Base": "A",
                "FilePath": null,
                "StartingMaterialMW": 329.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 329.2000,
                "Formula": null,
                "DisplayColor": "#ff1212",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 8, "OrdinalPosition": 1, "ModStructureID": 2
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 25,
                "Name": "T",
                "Base": "T",
                "FilePath": null,
                "StartingMaterialMW": 301.0000,
                "VendorName": "Glen",
                "VendorCatalogNumber": "G123",
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 301.0000,
                "Formula": null,
                "DisplayColor": "#fffb00",
                "Notes": "some notes",
                "ModStructureTypeID": 1
            }, "StrandID": 8, "OrdinalPosition": 2, "ModStructureID": 25
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 11,
                    "Code": "G"
                }, {"InstrumentID": 2, "ModStructureID": 11, "Code": "G"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 11,
                    "Code": "G"
                }, {"InstrumentID": 4, "ModStructureID": 11, "Code": "G"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 11,
                    "Code": "G"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 11,
                "Name": "G",
                "Base": "G",
                "FilePath": null,
                "StartingMaterialMW": 345.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 345.2000,
                "Formula": null,
                "DisplayColor": "#ff9f00",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 8, "OrdinalPosition": 3, "ModStructureID": 11
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 11,
                    "Code": "G"
                }, {"InstrumentID": 2, "ModStructureID": 11, "Code": "G"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 11,
                    "Code": "G"
                }, {"InstrumentID": 4, "ModStructureID": 11, "Code": "G"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 11,
                    "Code": "G"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 11,
                "Name": "G",
                "Base": "G",
                "FilePath": null,
                "StartingMaterialMW": 345.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 345.2000,
                "Formula": null,
                "DisplayColor": "#ff9f00",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 8, "OrdinalPosition": 4, "ModStructureID": 11
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 4,
                    "Code": "C"
                }, {"InstrumentID": 2, "ModStructureID": 4, "Code": "C"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 4,
                    "Code": "C"
                }, {"InstrumentID": 4, "ModStructureID": 4, "Code": "C"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 4,
                    "Code": "C"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 4,
                "Name": "C",
                "Base": "C",
                "FilePath": null,
                "StartingMaterialMW": 305.2000,
                "VendorName": "Glen",
                "VendorCatalogNumber": "12345",
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 305.2000,
                "Formula": null,
                "DisplayColor": "#e5ff00",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 8, "OrdinalPosition": 5, "ModStructureID": 4
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 4,
                    "Code": "C"
                }, {"InstrumentID": 2, "ModStructureID": 4, "Code": "C"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 4,
                    "Code": "C"
                }, {"InstrumentID": 4, "ModStructureID": 4, "Code": "C"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 4,
                    "Code": "C"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 4,
                "Name": "C",
                "Base": "C",
                "FilePath": null,
                "StartingMaterialMW": 305.2000,
                "VendorName": "Glen",
                "VendorCatalogNumber": "12345",
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 305.2000,
                "Formula": null,
                "DisplayColor": "#e5ff00",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 8, "OrdinalPosition": 6, "ModStructureID": 4
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 25,
                "Name": "T",
                "Base": "T",
                "FilePath": null,
                "StartingMaterialMW": 301.0000,
                "VendorName": "Glen",
                "VendorCatalogNumber": "G123",
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 301.0000,
                "Formula": null,
                "DisplayColor": "#fffb00",
                "Notes": "some notes",
                "ModStructureTypeID": 1
            }, "StrandID": 8, "OrdinalPosition": 7, "ModStructureID": 25
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 11,
                    "Code": "G"
                }, {"InstrumentID": 2, "ModStructureID": 11, "Code": "G"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 11,
                    "Code": "G"
                }, {"InstrumentID": 4, "ModStructureID": 11, "Code": "G"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 11,
                    "Code": "G"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 11,
                "Name": "G",
                "Base": "G",
                "FilePath": null,
                "StartingMaterialMW": 345.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 345.2000,
                "Formula": null,
                "DisplayColor": "#ff9f00",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 8, "OrdinalPosition": 8, "ModStructureID": 11
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 11,
                    "Code": "G"
                }, {"InstrumentID": 2, "ModStructureID": 11, "Code": "G"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 11,
                    "Code": "G"
                }, {"InstrumentID": 4, "ModStructureID": 11, "Code": "G"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 11,
                    "Code": "G"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 11,
                "Name": "G",
                "Base": "G",
                "FilePath": null,
                "StartingMaterialMW": 345.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 345.2000,
                "Formula": null,
                "DisplayColor": "#ff9f00",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 8, "OrdinalPosition": 9, "ModStructureID": 11
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 2,
                    "Code": "A"
                }, {"InstrumentID": 2, "ModStructureID": 2, "Code": "A"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 2,
                    "Code": "A"
                }, {"InstrumentID": 4, "ModStructureID": 2, "Code": "A"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 2,
                    "Code": "A"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 2,
                "Name": "A",
                "Base": "A",
                "FilePath": null,
                "StartingMaterialMW": 329.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 329.2000,
                "Formula": null,
                "DisplayColor": "#ff1212",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 8, "OrdinalPosition": 10, "ModStructureID": 2
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 4,
                    "Code": "C"
                }, {"InstrumentID": 2, "ModStructureID": 4, "Code": "C"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 4,
                    "Code": "C"
                }, {"InstrumentID": 4, "ModStructureID": 4, "Code": "C"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 4,
                    "Code": "C"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 4,
                "Name": "C",
                "Base": "C",
                "FilePath": null,
                "StartingMaterialMW": 305.2000,
                "VendorName": "Glen",
                "VendorCatalogNumber": "12345",
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 305.2000,
                "Formula": null,
                "DisplayColor": "#e5ff00",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 8, "OrdinalPosition": 11, "ModStructureID": 4
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 25,
                "Name": "T",
                "Base": "T",
                "FilePath": null,
                "StartingMaterialMW": 301.0000,
                "VendorName": "Glen",
                "VendorCatalogNumber": "G123",
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 301.0000,
                "Formula": null,
                "DisplayColor": "#fffb00",
                "Notes": "some notes",
                "ModStructureTypeID": 1
            }, "StrandID": 8, "OrdinalPosition": 12, "ModStructureID": 25
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 25,
                "Name": "T",
                "Base": "T",
                "FilePath": null,
                "StartingMaterialMW": 301.0000,
                "VendorName": "Glen",
                "VendorCatalogNumber": "G123",
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 301.0000,
                "Formula": null,
                "DisplayColor": "#fffb00",
                "Notes": "some notes",
                "ModStructureTypeID": 1
            }, "StrandID": 8, "OrdinalPosition": 13, "ModStructureID": 25
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 4,
                    "Code": "C"
                }, {"InstrumentID": 2, "ModStructureID": 4, "Code": "C"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 4,
                    "Code": "C"
                }, {"InstrumentID": 4, "ModStructureID": 4, "Code": "C"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 4,
                    "Code": "C"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 4,
                "Name": "C",
                "Base": "C",
                "FilePath": null,
                "StartingMaterialMW": 305.2000,
                "VendorName": "Glen",
                "VendorCatalogNumber": "12345",
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 305.2000,
                "Formula": null,
                "DisplayColor": "#e5ff00",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 8, "OrdinalPosition": 14, "ModStructureID": 4
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 2,
                    "Code": "A"
                }, {"InstrumentID": 2, "ModStructureID": 2, "Code": "A"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 2,
                    "Code": "A"
                }, {"InstrumentID": 4, "ModStructureID": 2, "Code": "A"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 2,
                    "Code": "A"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 2,
                "Name": "A",
                "Base": "A",
                "FilePath": null,
                "StartingMaterialMW": 329.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 329.2000,
                "Formula": null,
                "DisplayColor": "#ff1212",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 8, "OrdinalPosition": 15, "ModStructureID": 2
        }],
        "Target": {"TargetID": 1, "Name": "AATz", "IsActive": true},
        "StrandID": 8,
        "ArrowheadStrandID": "AM00008-SS",
        "TargetID": 1,
        "OrientationID": 1,
        "GenomeNumber": "",
        "GenomePosition": "",
        "ParentSequence": "ATGGCCTGGACTTCA",
        "Sequence": "ATGGCCTGGACTTCA",
        "BaseSequence": "ATGGCCTGGACTTCA",
        "Notes": "",
        "FirstPosition": 15,
        "MW": null,
        "ExtinctionCoefficient": null,
        "ColumnIdentity": null
    }, {
        "MaterialRequests": [],
        "Orientation": {"OrientationID": 1, "Name": "Sense"},
        "StrandModStructures": [{
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 11,
                    "Code": "G"
                }, {"InstrumentID": 2, "ModStructureID": 11, "Code": "G"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 11,
                    "Code": "G"
                }, {"InstrumentID": 4, "ModStructureID": 11, "Code": "G"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 11,
                    "Code": "G"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 11,
                "Name": "G",
                "Base": "G",
                "FilePath": null,
                "StartingMaterialMW": 345.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 345.2000,
                "Formula": null,
                "DisplayColor": "#ff9f00",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 14, "OrdinalPosition": 1, "ModStructureID": 11
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 4,
                    "Code": "C"
                }, {"InstrumentID": 2, "ModStructureID": 4, "Code": "C"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 4,
                    "Code": "C"
                }, {"InstrumentID": 4, "ModStructureID": 4, "Code": "C"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 4,
                    "Code": "C"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 4,
                "Name": "C",
                "Base": "C",
                "FilePath": null,
                "StartingMaterialMW": 305.2000,
                "VendorName": "Glen",
                "VendorCatalogNumber": "12345",
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 305.2000,
                "Formula": null,
                "DisplayColor": "#e5ff00",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 14, "OrdinalPosition": 2, "ModStructureID": 4
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 2, "Name": "RNA"},
                "ModStructureID": 16,
                "Name": "U",
                "Base": "U",
                "FilePath": null,
                "StartingMaterialMW": 306.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 306.2000,
                "Formula": null,
                "DisplayColor": "#56ac66",
                "Notes": null,
                "ModStructureTypeID": 2
            }, "StrandID": 14, "OrdinalPosition": 3, "ModStructureID": 16
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 4,
                    "Code": "C"
                }, {"InstrumentID": 2, "ModStructureID": 4, "Code": "C"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 4,
                    "Code": "C"
                }, {"InstrumentID": 4, "ModStructureID": 4, "Code": "C"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 4,
                    "Code": "C"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 4,
                "Name": "C",
                "Base": "C",
                "FilePath": null,
                "StartingMaterialMW": 305.2000,
                "VendorName": "Glen",
                "VendorCatalogNumber": "12345",
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 305.2000,
                "Formula": null,
                "DisplayColor": "#e5ff00",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 14, "OrdinalPosition": 4, "ModStructureID": 4
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 2, "Name": "RNA"},
                "ModStructureID": 16,
                "Name": "U",
                "Base": "U",
                "FilePath": null,
                "StartingMaterialMW": 306.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 306.2000,
                "Formula": null,
                "DisplayColor": "#56ac66",
                "Notes": null,
                "ModStructureTypeID": 2
            }, "StrandID": 14, "OrdinalPosition": 5, "ModStructureID": 16
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 2, "Name": "RNA"},
                "ModStructureID": 16,
                "Name": "U",
                "Base": "U",
                "FilePath": null,
                "StartingMaterialMW": 306.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 306.2000,
                "Formula": null,
                "DisplayColor": "#56ac66",
                "Notes": null,
                "ModStructureTypeID": 2
            }, "StrandID": 14, "OrdinalPosition": 6, "ModStructureID": 16
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 2, "Name": "RNA"},
                "ModStructureID": 16,
                "Name": "U",
                "Base": "U",
                "FilePath": null,
                "StartingMaterialMW": 306.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 306.2000,
                "Formula": null,
                "DisplayColor": "#56ac66",
                "Notes": null,
                "ModStructureTypeID": 2
            }, "StrandID": 14, "OrdinalPosition": 7, "ModStructureID": 16
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 11,
                    "Code": "G"
                }, {"InstrumentID": 2, "ModStructureID": 11, "Code": "G"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 11,
                    "Code": "G"
                }, {"InstrumentID": 4, "ModStructureID": 11, "Code": "G"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 11,
                    "Code": "G"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 11,
                "Name": "G",
                "Base": "G",
                "FilePath": null,
                "StartingMaterialMW": 345.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 345.2000,
                "Formula": null,
                "DisplayColor": "#ff9f00",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 14, "OrdinalPosition": 8, "ModStructureID": 11
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 2,
                    "Code": "A"
                }, {"InstrumentID": 2, "ModStructureID": 2, "Code": "A"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 2,
                    "Code": "A"
                }, {"InstrumentID": 4, "ModStructureID": 2, "Code": "A"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 2,
                    "Code": "A"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 2,
                "Name": "A",
                "Base": "A",
                "FilePath": null,
                "StartingMaterialMW": 329.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 329.2000,
                "Formula": null,
                "DisplayColor": "#ff1212",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 14, "OrdinalPosition": 9, "ModStructureID": 2
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 4,
                    "Code": "C"
                }, {"InstrumentID": 2, "ModStructureID": 4, "Code": "C"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 4,
                    "Code": "C"
                }, {"InstrumentID": 4, "ModStructureID": 4, "Code": "C"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 4,
                    "Code": "C"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 4,
                "Name": "C",
                "Base": "C",
                "FilePath": null,
                "StartingMaterialMW": 305.2000,
                "VendorName": "Glen",
                "VendorCatalogNumber": "12345",
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 305.2000,
                "Formula": null,
                "DisplayColor": "#e5ff00",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 14, "OrdinalPosition": 10, "ModStructureID": 4
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 4,
                    "Code": "C"
                }, {"InstrumentID": 2, "ModStructureID": 4, "Code": "C"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 4,
                    "Code": "C"
                }, {"InstrumentID": 4, "ModStructureID": 4, "Code": "C"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 4,
                    "Code": "C"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 4,
                "Name": "C",
                "Base": "C",
                "FilePath": null,
                "StartingMaterialMW": 305.2000,
                "VendorName": "Glen",
                "VendorCatalogNumber": "12345",
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 305.2000,
                "Formula": null,
                "DisplayColor": "#e5ff00",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 14, "OrdinalPosition": 11, "ModStructureID": 4
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 2, "Name": "RNA"},
                "ModStructureID": 16,
                "Name": "U",
                "Base": "U",
                "FilePath": null,
                "StartingMaterialMW": 306.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 306.2000,
                "Formula": null,
                "DisplayColor": "#56ac66",
                "Notes": null,
                "ModStructureTypeID": 2
            }, "StrandID": 14, "OrdinalPosition": 12, "ModStructureID": 16
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 11,
                    "Code": "G"
                }, {"InstrumentID": 2, "ModStructureID": 11, "Code": "G"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 11,
                    "Code": "G"
                }, {"InstrumentID": 4, "ModStructureID": 11, "Code": "G"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 11,
                    "Code": "G"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 11,
                "Name": "G",
                "Base": "G",
                "FilePath": null,
                "StartingMaterialMW": 345.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 345.2000,
                "Formula": null,
                "DisplayColor": "#ff9f00",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 14, "OrdinalPosition": 13, "ModStructureID": 11
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 2, "Name": "RNA"},
                "ModStructureID": 16,
                "Name": "U",
                "Base": "U",
                "FilePath": null,
                "StartingMaterialMW": 306.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 306.2000,
                "Formula": null,
                "DisplayColor": "#56ac66",
                "Notes": null,
                "ModStructureTypeID": 2
            }, "StrandID": 14, "OrdinalPosition": 14, "ModStructureID": 16
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 2,
                    "Code": "A"
                }, {"InstrumentID": 2, "ModStructureID": 2, "Code": "A"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 2,
                    "Code": "A"
                }, {"InstrumentID": 4, "ModStructureID": 2, "Code": "A"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 2,
                    "Code": "A"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 2,
                "Name": "A",
                "Base": "A",
                "FilePath": null,
                "StartingMaterialMW": 329.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 329.2000,
                "Formula": null,
                "DisplayColor": "#ff1212",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 14, "OrdinalPosition": 15, "ModStructureID": 2
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 4,
                    "Code": "C"
                }, {"InstrumentID": 2, "ModStructureID": 4, "Code": "C"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 4,
                    "Code": "C"
                }, {"InstrumentID": 4, "ModStructureID": 4, "Code": "C"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 4,
                    "Code": "C"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 4,
                "Name": "C",
                "Base": "C",
                "FilePath": null,
                "StartingMaterialMW": 305.2000,
                "VendorName": "Glen",
                "VendorCatalogNumber": "12345",
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 305.2000,
                "Formula": null,
                "DisplayColor": "#e5ff00",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 14, "OrdinalPosition": 16, "ModStructureID": 4
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 2,
                    "Code": "A"
                }, {"InstrumentID": 2, "ModStructureID": 2, "Code": "A"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 2,
                    "Code": "A"
                }, {"InstrumentID": 4, "ModStructureID": 2, "Code": "A"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 2,
                    "Code": "A"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 2,
                "Name": "A",
                "Base": "A",
                "FilePath": null,
                "StartingMaterialMW": 329.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 329.2000,
                "Formula": null,
                "DisplayColor": "#ff1212",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 14, "OrdinalPosition": 17, "ModStructureID": 2
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 2,
                    "Code": "A"
                }, {"InstrumentID": 2, "ModStructureID": 2, "Code": "A"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 2,
                    "Code": "A"
                }, {"InstrumentID": 4, "ModStructureID": 2, "Code": "A"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 2,
                    "Code": "A"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 2,
                "Name": "A",
                "Base": "A",
                "FilePath": null,
                "StartingMaterialMW": 329.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 329.2000,
                "Formula": null,
                "DisplayColor": "#ff1212",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 14, "OrdinalPosition": 18, "ModStructureID": 2
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 2,
                    "Code": "A"
                }, {"InstrumentID": 2, "ModStructureID": 2, "Code": "A"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 2,
                    "Code": "A"
                }, {"InstrumentID": 4, "ModStructureID": 2, "Code": "A"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 2,
                    "Code": "A"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 2,
                "Name": "A",
                "Base": "A",
                "FilePath": null,
                "StartingMaterialMW": 329.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 329.2000,
                "Formula": null,
                "DisplayColor": "#ff1212",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 14, "OrdinalPosition": 19, "ModStructureID": 2
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 25,
                "Name": "T",
                "Base": "T",
                "FilePath": null,
                "StartingMaterialMW": 301.0000,
                "VendorName": "Glen",
                "VendorCatalogNumber": "G123",
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 301.0000,
                "Formula": null,
                "DisplayColor": "#fffb00",
                "Notes": "some notes",
                "ModStructureTypeID": 1
            }, "StrandID": 14, "OrdinalPosition": 20, "ModStructureID": 25
        }],
        "Target": {"TargetID": 1, "Name": "AATz", "IsActive": true},
        "StrandID": 14,
        "ArrowheadStrandID": "AM00014-SS",
        "TargetID": 1,
        "OrientationID": 1,
        "GenomeNumber": "",
        "GenomePosition": "",
        "ParentSequence": "",
        "Sequence": "GCUCUUUGACCUGUACAAAT",
        "BaseSequence": "GCUCUUUGACCUGUACAAAT",
        "Notes": "",
        "FirstPosition": 20,
        "MW": null,
        "ExtinctionCoefficient": null,
        "ColumnIdentity": null
    }, {
        "MaterialRequests": [],
        "Orientation": {"OrientationID": 1, "Name": "Sense"},
        "StrandModStructures": [{
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 25,
                "Name": "T",
                "Base": "T",
                "FilePath": null,
                "StartingMaterialMW": 301.0000,
                "VendorName": "Glen",
                "VendorCatalogNumber": "G123",
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 301.0000,
                "Formula": null,
                "DisplayColor": "#fffb00",
                "Notes": "some notes",
                "ModStructureTypeID": 1
            }, "StrandID": 15, "OrdinalPosition": 1, "ModStructureID": 25
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 4,
                    "Code": "C"
                }, {"InstrumentID": 2, "ModStructureID": 4, "Code": "C"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 4,
                    "Code": "C"
                }, {"InstrumentID": 4, "ModStructureID": 4, "Code": "C"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 4,
                    "Code": "C"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 4,
                "Name": "C",
                "Base": "C",
                "FilePath": null,
                "StartingMaterialMW": 305.2000,
                "VendorName": "Glen",
                "VendorCatalogNumber": "12345",
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 305.2000,
                "Formula": null,
                "DisplayColor": "#e5ff00",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 15, "OrdinalPosition": 2, "ModStructureID": 4
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 2, "Name": "RNA"},
                "ModStructureID": 16,
                "Name": "U",
                "Base": "U",
                "FilePath": null,
                "StartingMaterialMW": 306.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 306.2000,
                "Formula": null,
                "DisplayColor": "#56ac66",
                "Notes": null,
                "ModStructureTypeID": 2
            }, "StrandID": 15, "OrdinalPosition": 3, "ModStructureID": 16
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 4,
                    "Code": "C"
                }, {"InstrumentID": 2, "ModStructureID": 4, "Code": "C"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 4,
                    "Code": "C"
                }, {"InstrumentID": 4, "ModStructureID": 4, "Code": "C"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 4,
                    "Code": "C"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 4,
                "Name": "C",
                "Base": "C",
                "FilePath": null,
                "StartingMaterialMW": 305.2000,
                "VendorName": "Glen",
                "VendorCatalogNumber": "12345",
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 305.2000,
                "Formula": null,
                "DisplayColor": "#e5ff00",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 15, "OrdinalPosition": 4, "ModStructureID": 4
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 2, "Name": "RNA"},
                "ModStructureID": 16,
                "Name": "U",
                "Base": "U",
                "FilePath": null,
                "StartingMaterialMW": 306.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 306.2000,
                "Formula": null,
                "DisplayColor": "#56ac66",
                "Notes": null,
                "ModStructureTypeID": 2
            }, "StrandID": 15, "OrdinalPosition": 5, "ModStructureID": 16
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 2,
                    "Code": "A"
                }, {"InstrumentID": 2, "ModStructureID": 2, "Code": "A"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 2,
                    "Code": "A"
                }, {"InstrumentID": 4, "ModStructureID": 2, "Code": "A"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 2,
                    "Code": "A"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 2,
                "Name": "A",
                "Base": "A",
                "FilePath": null,
                "StartingMaterialMW": 329.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 329.2000,
                "Formula": null,
                "DisplayColor": "#ff1212",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 15, "OrdinalPosition": 6, "ModStructureID": 2
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 2,
                    "Code": "A"
                }, {"InstrumentID": 2, "ModStructureID": 2, "Code": "A"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 2,
                    "Code": "A"
                }, {"InstrumentID": 4, "ModStructureID": 2, "Code": "A"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 2,
                    "Code": "A"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 2,
                "Name": "A",
                "Base": "A",
                "FilePath": null,
                "StartingMaterialMW": 329.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 329.2000,
                "Formula": null,
                "DisplayColor": "#ff1212",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 15, "OrdinalPosition": 7, "ModStructureID": 2
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 11,
                    "Code": "G"
                }, {"InstrumentID": 2, "ModStructureID": 11, "Code": "G"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 11,
                    "Code": "G"
                }, {"InstrumentID": 4, "ModStructureID": 11, "Code": "G"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 11,
                    "Code": "G"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 11,
                "Name": "G",
                "Base": "G",
                "FilePath": null,
                "StartingMaterialMW": 345.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 345.2000,
                "Formula": null,
                "DisplayColor": "#ff9f00",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 15, "OrdinalPosition": 8, "ModStructureID": 11
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 2,
                    "Code": "A"
                }, {"InstrumentID": 2, "ModStructureID": 2, "Code": "A"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 2,
                    "Code": "A"
                }, {"InstrumentID": 4, "ModStructureID": 2, "Code": "A"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 2,
                    "Code": "A"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 2,
                "Name": "A",
                "Base": "A",
                "FilePath": null,
                "StartingMaterialMW": 329.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 329.2000,
                "Formula": null,
                "DisplayColor": "#ff1212",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 15, "OrdinalPosition": 9, "ModStructureID": 2
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 4,
                    "Code": "C"
                }, {"InstrumentID": 2, "ModStructureID": 4, "Code": "C"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 4,
                    "Code": "C"
                }, {"InstrumentID": 4, "ModStructureID": 4, "Code": "C"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 4,
                    "Code": "C"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 4,
                "Name": "C",
                "Base": "C",
                "FilePath": null,
                "StartingMaterialMW": 305.2000,
                "VendorName": "Glen",
                "VendorCatalogNumber": "12345",
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 305.2000,
                "Formula": null,
                "DisplayColor": "#e5ff00",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 15, "OrdinalPosition": 10, "ModStructureID": 4
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 4,
                    "Code": "C"
                }, {"InstrumentID": 2, "ModStructureID": 4, "Code": "C"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 4,
                    "Code": "C"
                }, {"InstrumentID": 4, "ModStructureID": 4, "Code": "C"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 4,
                    "Code": "C"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 4,
                "Name": "C",
                "Base": "C",
                "FilePath": null,
                "StartingMaterialMW": 305.2000,
                "VendorName": "Glen",
                "VendorCatalogNumber": "12345",
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 305.2000,
                "Formula": null,
                "DisplayColor": "#e5ff00",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 15, "OrdinalPosition": 11, "ModStructureID": 4
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 2, "Name": "RNA"},
                "ModStructureID": 16,
                "Name": "U",
                "Base": "U",
                "FilePath": null,
                "StartingMaterialMW": 306.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 306.2000,
                "Formula": null,
                "DisplayColor": "#56ac66",
                "Notes": null,
                "ModStructureTypeID": 2
            }, "StrandID": 15, "OrdinalPosition": 12, "ModStructureID": 16
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 11,
                    "Code": "G"
                }, {"InstrumentID": 2, "ModStructureID": 11, "Code": "G"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 11,
                    "Code": "G"
                }, {"InstrumentID": 4, "ModStructureID": 11, "Code": "G"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 11,
                    "Code": "G"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 11,
                "Name": "G",
                "Base": "G",
                "FilePath": null,
                "StartingMaterialMW": 345.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 345.2000,
                "Formula": null,
                "DisplayColor": "#ff9f00",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 15, "OrdinalPosition": 13, "ModStructureID": 11
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 2, "Name": "RNA"},
                "ModStructureID": 16,
                "Name": "U",
                "Base": "U",
                "FilePath": null,
                "StartingMaterialMW": 306.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 306.2000,
                "Formula": null,
                "DisplayColor": "#56ac66",
                "Notes": null,
                "ModStructureTypeID": 2
            }, "StrandID": 15, "OrdinalPosition": 14, "ModStructureID": 16
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 2,
                    "Code": "A"
                }, {"InstrumentID": 2, "ModStructureID": 2, "Code": "A"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 2,
                    "Code": "A"
                }, {"InstrumentID": 4, "ModStructureID": 2, "Code": "A"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 2,
                    "Code": "A"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 2,
                "Name": "A",
                "Base": "A",
                "FilePath": null,
                "StartingMaterialMW": 329.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 329.2000,
                "Formula": null,
                "DisplayColor": "#ff1212",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 15, "OrdinalPosition": 15, "ModStructureID": 2
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 4,
                    "Code": "C"
                }, {"InstrumentID": 2, "ModStructureID": 4, "Code": "C"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 4,
                    "Code": "C"
                }, {"InstrumentID": 4, "ModStructureID": 4, "Code": "C"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 4,
                    "Code": "C"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 4,
                "Name": "C",
                "Base": "C",
                "FilePath": null,
                "StartingMaterialMW": 305.2000,
                "VendorName": "Glen",
                "VendorCatalogNumber": "12345",
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 305.2000,
                "Formula": null,
                "DisplayColor": "#e5ff00",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 15, "OrdinalPosition": 16, "ModStructureID": 4
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 2,
                    "Code": "A"
                }, {"InstrumentID": 2, "ModStructureID": 2, "Code": "A"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 2,
                    "Code": "A"
                }, {"InstrumentID": 4, "ModStructureID": 2, "Code": "A"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 2,
                    "Code": "A"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 2,
                "Name": "A",
                "Base": "A",
                "FilePath": null,
                "StartingMaterialMW": 329.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 329.2000,
                "Formula": null,
                "DisplayColor": "#ff1212",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 15, "OrdinalPosition": 17, "ModStructureID": 2
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 2,
                    "Code": "A"
                }, {"InstrumentID": 2, "ModStructureID": 2, "Code": "A"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 2,
                    "Code": "A"
                }, {"InstrumentID": 4, "ModStructureID": 2, "Code": "A"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 2,
                    "Code": "A"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 2,
                "Name": "A",
                "Base": "A",
                "FilePath": null,
                "StartingMaterialMW": 329.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 329.2000,
                "Formula": null,
                "DisplayColor": "#ff1212",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 15, "OrdinalPosition": 18, "ModStructureID": 2
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 2,
                    "Code": "A"
                }, {"InstrumentID": 2, "ModStructureID": 2, "Code": "A"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 2,
                    "Code": "A"
                }, {"InstrumentID": 4, "ModStructureID": 2, "Code": "A"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 2,
                    "Code": "A"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 2,
                "Name": "A",
                "Base": "A",
                "FilePath": null,
                "StartingMaterialMW": 329.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 329.2000,
                "Formula": null,
                "DisplayColor": "#ff1212",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 15, "OrdinalPosition": 19, "ModStructureID": 2
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 25,
                "Name": "T",
                "Base": "T",
                "FilePath": null,
                "StartingMaterialMW": 301.0000,
                "VendorName": "Glen",
                "VendorCatalogNumber": "G123",
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 301.0000,
                "Formula": null,
                "DisplayColor": "#fffb00",
                "Notes": "some notes",
                "ModStructureTypeID": 1
            }, "StrandID": 15, "OrdinalPosition": 20, "ModStructureID": 25
        }],
        "Target": {"TargetID": 1, "Name": "AATz", "IsActive": true},
        "StrandID": 15,
        "ArrowheadStrandID": "AM00015-SS",
        "TargetID": 1,
        "OrientationID": 1,
        "GenomeNumber": "",
        "GenomePosition": "",
        "ParentSequence": "",
        "Sequence": "TCUCUAAGACCUGUACAAAT",
        "BaseSequence": "TCUCUAAGACCUGUACAAAT",
        "Notes": "",
        "FirstPosition": 20,
        "MW": null,
        "ExtinctionCoefficient": null,
        "ColumnIdentity": null
    }, {
        "MaterialRequests": [],
        "Orientation": {"OrientationID": 1, "Name": "Sense"},
        "StrandModStructures": [{
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 3, "Name": "2'Ome"},
                "ModStructureID": 28,
                "Name": "Me-Alk-SS-C6",
                "Base": null,
                "FilePath": null,
                "StartingMaterialMW": 100.0000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 100.0000,
                "Formula": null,
                "DisplayColor": "#b4d0fd",
                "Notes": null,
                "ModStructureTypeID": 3
            }, "StrandID": 17, "OrdinalPosition": 1, "ModStructureID": 28
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 12,
                    "Code": "O"
                }, {"InstrumentID": 2, "ModStructureID": 12, "Code": "O"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 12,
                    "Code": "O"
                }, {"InstrumentID": 4, "ModStructureID": 12, "Code": "O"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 12,
                    "Code": "O"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 12,
                "Name": "Gf",
                "Base": "G",
                "FilePath": null,
                "StartingMaterialMW": 347.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 347.2000,
                "Formula": null,
                "DisplayColor": "#f4ff00",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 17, "OrdinalPosition": 2, "ModStructureID": 12
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 4, "Name": "2'F"},
                "ModStructureID": 20,
                "Name": "c",
                "Base": "C",
                "FilePath": null,
                "StartingMaterialMW": 319.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 319.2000,
                "Formula": null,
                "DisplayColor": "#d5ff00",
                "Notes": null,
                "ModStructureTypeID": 4
            }, "StrandID": 17, "OrdinalPosition": 3, "ModStructureID": 20
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 4, "Name": "2'F"},
                "ModStructureID": 17,
                "Name": "Uf",
                "Base": "U",
                "FilePath": null,
                "StartingMaterialMW": 320.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 320.2000,
                "Formula": null,
                "DisplayColor": "#3ec08c",
                "Notes": null,
                "ModStructureTypeID": 4
            }, "StrandID": 17, "OrdinalPosition": 4, "ModStructureID": 17
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 4, "Name": "2'F"},
                "ModStructureID": 20,
                "Name": "c",
                "Base": "C",
                "FilePath": null,
                "StartingMaterialMW": 319.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 319.2000,
                "Formula": null,
                "DisplayColor": "#d5ff00",
                "Notes": null,
                "ModStructureTypeID": 4
            }, "StrandID": 17, "OrdinalPosition": 5, "ModStructureID": 20
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 4, "Name": "2'F"},
                "ModStructureID": 17,
                "Name": "Uf",
                "Base": "U",
                "FilePath": null,
                "StartingMaterialMW": 320.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 320.2000,
                "Formula": null,
                "DisplayColor": "#3ec08c",
                "Notes": null,
                "ModStructureTypeID": 4
            }, "StrandID": 17, "OrdinalPosition": 6, "ModStructureID": 17
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 2, "Name": "RNA"},
                "ModStructureID": 26,
                "Name": "u",
                "Base": "U",
                "FilePath": null,
                "StartingMaterialMW": 100.0000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 100.0000,
                "Formula": null,
                "DisplayColor": "#66d700",
                "Notes": null,
                "ModStructureTypeID": 2
            }, "StrandID": 17, "OrdinalPosition": 7, "ModStructureID": 26
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 4, "Name": "2'F"},
                "ModStructureID": 17,
                "Name": "Uf",
                "Base": "U",
                "FilePath": null,
                "StartingMaterialMW": 320.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 320.2000,
                "Formula": null,
                "DisplayColor": "#3ec08c",
                "Notes": null,
                "ModStructureTypeID": 4
            }, "StrandID": 17, "OrdinalPosition": 8, "ModStructureID": 17
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 27,
                "Name": "g",
                "Base": "G",
                "FilePath": null,
                "StartingMaterialMW": 100.0000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 100.0000,
                "Formula": null,
                "DisplayColor": "#00ff4d",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 17, "OrdinalPosition": 9, "ModStructureID": 27
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 21,
                "Name": "Af",
                "Base": "A",
                "FilePath": null,
                "StartingMaterialMW": 331.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 331.2000,
                "Formula": null,
                "DisplayColor": "#1b848d",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 17, "OrdinalPosition": 10, "ModStructureID": 21
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 4, "Name": "2'F"},
                "ModStructureID": 20,
                "Name": "c",
                "Base": "C",
                "FilePath": null,
                "StartingMaterialMW": 319.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 319.2000,
                "Formula": null,
                "DisplayColor": "#d5ff00",
                "Notes": null,
                "ModStructureTypeID": 4
            }, "StrandID": 17, "OrdinalPosition": 11, "ModStructureID": 20
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 4, "Name": "2'F"},
                "ModStructureID": 5,
                "Name": "Cf",
                "Base": "C",
                "FilePath": null,
                "StartingMaterialMW": 307.2000,
                "VendorName": "Glen",
                "VendorCatalogNumber": "12457",
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 307.2000,
                "Formula": null,
                "DisplayColor": "#7aff00",
                "Notes": null,
                "ModStructureTypeID": 4
            }, "StrandID": 17, "OrdinalPosition": 12, "ModStructureID": 5
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 2, "Name": "RNA"},
                "ModStructureID": 26,
                "Name": "u",
                "Base": "U",
                "FilePath": null,
                "StartingMaterialMW": 100.0000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 100.0000,
                "Formula": null,
                "DisplayColor": "#66d700",
                "Notes": null,
                "ModStructureTypeID": 2
            }, "StrandID": 17, "OrdinalPosition": 13, "ModStructureID": 26
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 12,
                    "Code": "O"
                }, {"InstrumentID": 2, "ModStructureID": 12, "Code": "O"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 12,
                    "Code": "O"
                }, {"InstrumentID": 4, "ModStructureID": 12, "Code": "O"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 12,
                    "Code": "O"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 12,
                "Name": "Gf",
                "Base": "G",
                "FilePath": null,
                "StartingMaterialMW": 347.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 347.2000,
                "Formula": null,
                "DisplayColor": "#f4ff00",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 17, "OrdinalPosition": 14, "ModStructureID": 12
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 2, "Name": "RNA"},
                "ModStructureID": 26,
                "Name": "u",
                "Base": "U",
                "FilePath": null,
                "StartingMaterialMW": 100.0000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 100.0000,
                "Formula": null,
                "DisplayColor": "#66d700",
                "Notes": null,
                "ModStructureTypeID": 2
            }, "StrandID": 17, "OrdinalPosition": 15, "ModStructureID": 26
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 21,
                "Name": "Af",
                "Base": "A",
                "FilePath": null,
                "StartingMaterialMW": 331.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 331.2000,
                "Formula": null,
                "DisplayColor": "#1b848d",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 17, "OrdinalPosition": 16, "ModStructureID": 21
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 4, "Name": "2'F"},
                "ModStructureID": 20,
                "Name": "c",
                "Base": "C",
                "FilePath": null,
                "StartingMaterialMW": 319.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 319.2000,
                "Formula": null,
                "DisplayColor": "#d5ff00",
                "Notes": null,
                "ModStructureTypeID": 4
            }, "StrandID": 17, "OrdinalPosition": 17, "ModStructureID": 20
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 21,
                "Name": "Af",
                "Base": "A",
                "FilePath": null,
                "StartingMaterialMW": 331.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 331.2000,
                "Formula": null,
                "DisplayColor": "#1b848d",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 17, "OrdinalPosition": 18, "ModStructureID": 21
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 19,
                "Name": "a",
                "Base": "A",
                "FilePath": null,
                "StartingMaterialMW": 343.3000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 343.3000,
                "Formula": null,
                "DisplayColor": "#95d051",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 17, "OrdinalPosition": 19, "ModStructureID": 19
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 21,
                "Name": "Af",
                "Base": "A",
                "FilePath": null,
                "StartingMaterialMW": 331.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 331.2000,
                "Formula": null,
                "DisplayColor": "#1b848d",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 17, "OrdinalPosition": 20, "ModStructureID": 21
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 3, "Name": "2'Ome"},
                "ModStructureID": 30,
                "Name": "invdT",
                "Base": "T",
                "FilePath": null,
                "StartingMaterialMW": 100.0000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 100.0000,
                "Formula": null,
                "DisplayColor": "#5ccd44",
                "Notes": null,
                "ModStructureTypeID": 3
            }, "StrandID": 17, "OrdinalPosition": 21, "ModStructureID": 30
        }],
        "Target": {"TargetID": 1, "Name": "AATz", "IsActive": true},
        "StrandID": 17,
        "ArrowheadStrandID": "AM00017-SS",
        "TargetID": 1,
        "OrientationID": 1,
        "GenomeNumber": "",
        "GenomePosition": "",
        "ParentSequence": "",
        "Sequence": "Me-Alk-SS-C6GfcUfcUfuUfgAfcCfuGfuAfcAfaAfinvdT",
        "BaseSequence": "GCUCUUUGACCUGUACAAAT",
        "Notes": "",
        "FirstPosition": 21,
        "MW": null,
        "ExtinctionCoefficient": null,
        "ColumnIdentity": null
    }, {
        "MaterialRequests": [],
        "Orientation": {"OrientationID": 1, "Name": "Sense"},
        "StrandModStructures": [{
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 3, "Name": "2'Ome"},
                "ModStructureID": 28,
                "Name": "Me-Alk-SS-C6",
                "Base": null,
                "FilePath": null,
                "StartingMaterialMW": 100.0000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 100.0000,
                "Formula": null,
                "DisplayColor": "#b4d0fd",
                "Notes": null,
                "ModStructureTypeID": 3
            }, "StrandID": 18, "OrdinalPosition": 1, "ModStructureID": 28
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 31,
                "Name": "Tf",
                "Base": "T",
                "FilePath": null,
                "StartingMaterialMW": 100.0000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 100.0000,
                "Formula": null,
                "DisplayColor": "#ffbe00",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 18, "OrdinalPosition": 2, "ModStructureID": 31
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 4, "Name": "2'F"},
                "ModStructureID": 20,
                "Name": "c",
                "Base": "C",
                "FilePath": null,
                "StartingMaterialMW": 319.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 319.2000,
                "Formula": null,
                "DisplayColor": "#d5ff00",
                "Notes": null,
                "ModStructureTypeID": 4
            }, "StrandID": 18, "OrdinalPosition": 3, "ModStructureID": 20
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 4, "Name": "2'F"},
                "ModStructureID": 17,
                "Name": "Uf",
                "Base": "U",
                "FilePath": null,
                "StartingMaterialMW": 320.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 320.2000,
                "Formula": null,
                "DisplayColor": "#3ec08c",
                "Notes": null,
                "ModStructureTypeID": 4
            }, "StrandID": 18, "OrdinalPosition": 4, "ModStructureID": 17
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 4, "Name": "2'F"},
                "ModStructureID": 20,
                "Name": "c",
                "Base": "C",
                "FilePath": null,
                "StartingMaterialMW": 319.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 319.2000,
                "Formula": null,
                "DisplayColor": "#d5ff00",
                "Notes": null,
                "ModStructureTypeID": 4
            }, "StrandID": 18, "OrdinalPosition": 5, "ModStructureID": 20
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 4, "Name": "2'F"},
                "ModStructureID": 17,
                "Name": "Uf",
                "Base": "U",
                "FilePath": null,
                "StartingMaterialMW": 320.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 320.2000,
                "Formula": null,
                "DisplayColor": "#3ec08c",
                "Notes": null,
                "ModStructureTypeID": 4
            }, "StrandID": 18, "OrdinalPosition": 6, "ModStructureID": 17
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 19,
                "Name": "a",
                "Base": "A",
                "FilePath": null,
                "StartingMaterialMW": 343.3000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 343.3000,
                "Formula": null,
                "DisplayColor": "#95d051",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 18, "OrdinalPosition": 7, "ModStructureID": 19
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 21,
                "Name": "Af",
                "Base": "A",
                "FilePath": null,
                "StartingMaterialMW": 331.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 331.2000,
                "Formula": null,
                "DisplayColor": "#1b848d",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 18, "OrdinalPosition": 8, "ModStructureID": 21
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 27,
                "Name": "g",
                "Base": "G",
                "FilePath": null,
                "StartingMaterialMW": 100.0000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 100.0000,
                "Formula": null,
                "DisplayColor": "#00ff4d",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 18, "OrdinalPosition": 9, "ModStructureID": 27
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 21,
                "Name": "Af",
                "Base": "A",
                "FilePath": null,
                "StartingMaterialMW": 331.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 331.2000,
                "Formula": null,
                "DisplayColor": "#1b848d",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 18, "OrdinalPosition": 10, "ModStructureID": 21
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 4, "Name": "2'F"},
                "ModStructureID": 20,
                "Name": "c",
                "Base": "C",
                "FilePath": null,
                "StartingMaterialMW": 319.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 319.2000,
                "Formula": null,
                "DisplayColor": "#d5ff00",
                "Notes": null,
                "ModStructureTypeID": 4
            }, "StrandID": 18, "OrdinalPosition": 11, "ModStructureID": 20
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 4, "Name": "2'F"},
                "ModStructureID": 5,
                "Name": "Cf",
                "Base": "C",
                "FilePath": null,
                "StartingMaterialMW": 307.2000,
                "VendorName": "Glen",
                "VendorCatalogNumber": "12457",
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 307.2000,
                "Formula": null,
                "DisplayColor": "#7aff00",
                "Notes": null,
                "ModStructureTypeID": 4
            }, "StrandID": 18, "OrdinalPosition": 12, "ModStructureID": 5
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 2, "Name": "RNA"},
                "ModStructureID": 26,
                "Name": "u",
                "Base": "U",
                "FilePath": null,
                "StartingMaterialMW": 100.0000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 100.0000,
                "Formula": null,
                "DisplayColor": "#66d700",
                "Notes": null,
                "ModStructureTypeID": 2
            }, "StrandID": 18, "OrdinalPosition": 13, "ModStructureID": 26
        }, {
            "ModStructure": {
                "InstrumentModStructures": [{
                    "InstrumentID": 1,
                    "ModStructureID": 12,
                    "Code": "O"
                }, {"InstrumentID": 2, "ModStructureID": 12, "Code": "O"}, {
                    "InstrumentID": 3,
                    "ModStructureID": 12,
                    "Code": "O"
                }, {"InstrumentID": 4, "ModStructureID": 12, "Code": "O"}, {
                    "InstrumentID": 5,
                    "ModStructureID": 12,
                    "Code": "O"
                }],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 12,
                "Name": "Gf",
                "Base": "G",
                "FilePath": null,
                "StartingMaterialMW": 347.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 347.2000,
                "Formula": null,
                "DisplayColor": "#f4ff00",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 18, "OrdinalPosition": 14, "ModStructureID": 12
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 2, "Name": "RNA"},
                "ModStructureID": 26,
                "Name": "u",
                "Base": "U",
                "FilePath": null,
                "StartingMaterialMW": 100.0000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 100.0000,
                "Formula": null,
                "DisplayColor": "#66d700",
                "Notes": null,
                "ModStructureTypeID": 2
            }, "StrandID": 18, "OrdinalPosition": 15, "ModStructureID": 26
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 21,
                "Name": "Af",
                "Base": "A",
                "FilePath": null,
                "StartingMaterialMW": 331.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 331.2000,
                "Formula": null,
                "DisplayColor": "#1b848d",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 18, "OrdinalPosition": 16, "ModStructureID": 21
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 4, "Name": "2'F"},
                "ModStructureID": 20,
                "Name": "c",
                "Base": "C",
                "FilePath": null,
                "StartingMaterialMW": 319.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 319.2000,
                "Formula": null,
                "DisplayColor": "#d5ff00",
                "Notes": null,
                "ModStructureTypeID": 4
            }, "StrandID": 18, "OrdinalPosition": 17, "ModStructureID": 20
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 21,
                "Name": "Af",
                "Base": "A",
                "FilePath": null,
                "StartingMaterialMW": 331.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 331.2000,
                "Formula": null,
                "DisplayColor": "#1b848d",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 18, "OrdinalPosition": 18, "ModStructureID": 21
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 19,
                "Name": "a",
                "Base": "A",
                "FilePath": null,
                "StartingMaterialMW": 343.3000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 343.3000,
                "Formula": null,
                "DisplayColor": "#95d051",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 18, "OrdinalPosition": 19, "ModStructureID": 19
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 1, "Name": "DNA"},
                "ModStructureID": 21,
                "Name": "Af",
                "Base": "A",
                "FilePath": null,
                "StartingMaterialMW": 331.2000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 331.2000,
                "Formula": null,
                "DisplayColor": "#1b848d",
                "Notes": null,
                "ModStructureTypeID": 1
            }, "StrandID": 18, "OrdinalPosition": 20, "ModStructureID": 21
        }, {
            "ModStructure": {
                "InstrumentModStructures": [],
                "ModStructureAttachments": [],
                "ModStructureType": {"ModStructureTypeID": 3, "Name": "2'Ome"},
                "ModStructureID": 30,
                "Name": "invdT",
                "Base": "T",
                "FilePath": null,
                "StartingMaterialMW": 100.0000,
                "VendorName": null,
                "VendorCatalogNumber": null,
                "Coupling": null,
                "Deprotection": null,
                "IncorporatedMW": 100.0000,
                "Formula": null,
                "DisplayColor": "#5ccd44",
                "Notes": null,
                "ModStructureTypeID": 3
            }, "StrandID": 18, "OrdinalPosition": 21, "ModStructureID": 30
        }],
        "Target": {"TargetID": 1, "Name": "AATz", "IsActive": true},
        "StrandID": 18,
        "ArrowheadStrandID": "AM00018-SS",
        "TargetID": 1,
        "OrientationID": 1,
        "GenomeNumber": "",
        "GenomePosition": "",
        "ParentSequence": "",
        "Sequence": "Me-Alk-SS-C6TfcUfcUfaAfgAfcCfuGfuAfcAfaAfinvdT",
        "BaseSequence": "TCUCUAAGACCUGUACAAAT",
        "Notes": "",
        "FirstPosition": 21,
        "MW": null,
        "ExtinctionCoefficient": null,
        "ColumnIdentity": null
    }], "TotalItems": 5
}

export class SelectItemsModal {
    static $inject:string[] = [
        '$uibModal'
    ];

    constructor(private $uibModal:IModalService) {

    }

    open():IPromise<any[]> {
        return this.$uibModal.open({
            size: 'lg',
            template: `
                <div class="modal-body">
                    <div class="row" style="margin-bottom:20px;">
                        <div class="col-md-4">
                            <h5 style="margin-top:0px;">{{prompt}}</h5>
                        </div>
                        <div class="col-md-5">
                            <input class="form-control" ng-model='filterValue' ng-change="singleFilter()" ng-disabled="advancedFiltering" ng-init="advancedFiltering=false">
                        </div>
                        <div class="col-md-offset-10">
                            <button id='toggleFiltering' ng-click="toggleFiltering()" style="margin-top:5px;" class="btn-link">Advanced Filtering</button>
                        </div>
                    </div>
                    <div class="grid" style="height:345px" ui-grid="ctrl.gridOptions" ui-grid-pagination ui-grid-resize-columns ui-grid-selection></div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" type="button" ng-click="ok()">Select</button>
                    <button class="btn btn-warning" type="button" ng-click="cancel()">Cancel</button>
                </div>
            `,
            controllerAs: 'ctrl',
            controller: SelectItemsController,
            resolve: {
                resolve: function () {
                    return 'test';
                }
            }
        }).result;
    }
}

class SelectItemsController {
    text;
    gridOptions:IGridOptions;

    constructor() {
        this.text = 'Hello';
        this.gridOptions = {
            columnDefs: [
                { name: 'ArrowheadStrandID' },
                { name: 'Target.Name', displayName: 'Target' },
                { name: 'MW' }
            ],
            data: mockData.ItemList
        };
    }
}
