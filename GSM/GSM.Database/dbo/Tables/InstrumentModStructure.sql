CREATE TABLE [dbo].[InstrumentModStructure] (
    [InstrumentID]   INT          NOT NULL,
    [ModStructureID] INT          NOT NULL,
    [Code]           VARCHAR (50) NOT NULL,
    CONSTRAINT [PK_InstrumentModStructure] PRIMARY KEY CLUSTERED ([InstrumentID] ASC, [ModStructureID] ASC),
    CONSTRAINT [FK_InstrumentModStructure_Instrument] FOREIGN KEY ([InstrumentID]) REFERENCES [dbo].[Instrument] ([InstrumentID]),
    CONSTRAINT [FK_InstrumentModStructure_ModStructure] FOREIGN KEY ([ModStructureID]) REFERENCES [dbo].[ModStructure] ([ModStructureID])
);

