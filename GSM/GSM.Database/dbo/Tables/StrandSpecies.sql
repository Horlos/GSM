CREATE TABLE [dbo].[StrandSpecies] (
    [StrandID]  INT NOT NULL,
    [SpeciesID] INT NOT NULL,
    CONSTRAINT [PK_StrandSpecies] PRIMARY KEY CLUSTERED ([StrandID] ASC, [SpeciesID] ASC),
    CONSTRAINT [FK_StrandSpecies_Species] FOREIGN KEY ([SpeciesID]) REFERENCES [dbo].[Species] ([SpeciesID]),
    CONSTRAINT [FK_StrandSpecies_Strand] FOREIGN KEY ([StrandID]) REFERENCES [dbo].[Strand] ([ID])
);



