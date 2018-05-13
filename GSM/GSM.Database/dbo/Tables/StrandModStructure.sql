CREATE TABLE [dbo].[StrandModStructure] (
    [StrandID]        INT NOT NULL,
    [OrdinalPosition] INT NOT NULL,
    [ModStructureID]  INT NOT NULL,
    CONSTRAINT [PK_StrandModStructure_1] PRIMARY KEY CLUSTERED ([StrandID] ASC, [OrdinalPosition] ASC),
    CONSTRAINT [FK_StrandModStructure_ModStructure] FOREIGN KEY ([ModStructureID]) REFERENCES [dbo].[ModStructure] ([ModStructureID]),
    CONSTRAINT [FK_StrandModStructure_Strand] FOREIGN KEY ([StrandID]) REFERENCES [dbo].[Strand] ([ID])
);



