CREATE TABLE [dbo].[Species] (
    [SpeciesID] INT          IDENTITY (1, 1) NOT NULL,
    [Name]      VARCHAR (50) NOT NULL,
    [IsActive]  BIT          CONSTRAINT [DF_Species_IsActive] DEFAULT ((1)) NOT NULL,
    CONSTRAINT [PK_Species] PRIMARY KEY CLUSTERED ([SpeciesID] ASC),
    CONSTRAINT [IX_Species] UNIQUE NONCLUSTERED ([Name] ASC)
);





