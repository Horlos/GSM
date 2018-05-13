export interface IMaterialRequestModel {
    MaterialRequestID?;
    RequestDate?;
    NeedByDate?;
    StatusID?;
    SubmittedBy?;
    Status?;
    User?;
    Duplexes?:any[];
    Strands?:any[];
}

export class MaterialRequestModel implements IMaterialRequestModel {
    MaterialRequestID;
    RequestDate;
    NeedByDate;
    StatusID;
    SubmittedBy;
    Status;
    User;
    Duplexes:any[];
    Strands:any[];

    /**
     * Crete MaterialRequestModel instance from input object
     * @param obj
     */
    constructor(obj:IMaterialRequestModel) {
        Object.keys(obj).forEach(prop => this[prop] = obj[prop]);
    }
}
