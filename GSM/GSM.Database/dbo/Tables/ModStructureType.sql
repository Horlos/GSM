CREATE TABLE [dbo].[ModStructureType] (
    [ModStructureTypeID] INT           IDENTITY (1, 1) NOT NULL,
    [Name]               VARCHAR (255) NOT NULL,
    CONSTRAINT [PK_ModStructureTypeID] PRIMARY KEY CLUSTERED ([ModStructureTypeID] ASC),
    CONSTRAINT [IX_ModStructureType] UNIQUE NONCLUSTERED ([Name] ASC)
);



