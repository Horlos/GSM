namespace App.Strands.Models {
    export interface StrandModel {
        Id: number;
        FirstPosition: number;
        Name:string;
        Notes: string;
        GenomeNumber: string;
        GenomePosition: string;
        ParentSequence: string;
        Target: TargetModel;
        Orientation: OrientationModel;
        StrandModStructures: Array<StrandModStructureModel>;
        Species: Array<SpeciesModel>;
    }   

    export interface TargetModel {
        Id: number;
        Name: string;
        HasErrors: boolean;
    }

    export interface OrientationModel {
        Id: number;
        Name: string;
        HasErrors: boolean;
    }

    export interface ModStructureModel {
        Base: string;
        Name: string;
        OrdinalPosition: number;
        HasErrors: boolean;
    }

    export interface StrandModStructureModel {
        ModStructure: ModStructureModel;
        OrdinalPosition: number;
        HasErrors: boolean;
    }

    export interface SpeciesModel {
        Id:number;
        Name: string;
    }

    export interface ModifierTemplateModel {
        ModifiedSequence:string;
    }
}