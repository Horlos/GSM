namespace GSM.Infrastructure.Filters
{
    public enum Permission
    {
        None = 0,
        ManageRoles = 1,
        CreateStrand = 2,
        ImportStrand = 3,
        ManageModifierTemplates = 4,
        CreateDuplex = 5,
        ImportDuplexes = 6,
        ManageModStructure = 7,
        CreateEditTargets = 8,
        CreateEditSpecies = 9,
        CreateMaterialRequest = 10,
        UpdateMaterialRequestStatus = 11,
        CreateSynthesisRequest = 12,
        UpdateSynthesisRequestStatus = 13,
        CreateStrandBatch = 14,
        CreateDuplexBatch = 15,
        CreateEditInstruments = 16
    }
}