CREATE TABLE [dbo].[ModStructure] (
    [ModStructureID]      INT             IDENTITY (1, 1) NOT NULL,
    [Name]                VARCHAR (255)   COLLATE SQL_Latin1_General_CP1_CS_AS NOT NULL,
    [Base]                VARCHAR (255)   NULL,
    [StartingMaterialMW]  DECIMAL (10, 4) NOT NULL,
    [VendorName]          VARCHAR (255)   NULL,
    [VendorCatalogNumber] VARCHAR (255)   NULL,
    [Coupling]            VARCHAR (255)   NULL,
    [Deprotection]        VARCHAR (255)   NULL,
    [IncorporatedMW]      DECIMAL (10, 4) NOT NULL,
    [Formula]             VARCHAR (255)   NULL,
    [DisplayColor]        VARCHAR (255)   NOT NULL,
    [Notes]               VARCHAR (MAX)   NULL,
    [ModStructureTypeID]  INT             NOT NULL,
    CONSTRAINT [PK_ModStructure] PRIMARY KEY CLUSTERED ([ModStructureID] ASC),
    CONSTRAINT [FK_ModStructure_ModStructureTypeID] FOREIGN KEY ([ModStructureTypeID]) REFERENCES [dbo].[ModStructureType] ([ModStructureTypeID]),
    CONSTRAINT [IX_ModStructure] UNIQUE NONCLUSTERED ([Name] ASC)
);

















