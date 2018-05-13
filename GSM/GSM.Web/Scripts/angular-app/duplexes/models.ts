namespace App.Duplexes.Models {
    export interface DuplexModel {
        Id: number;
        MW?: number;
        Target: any;
        SenseStrand: any;
        AntiSenseStrand: any;
    }
}