CREATE TABLE [dbo].[Instrument] (
    [InstrumentID] INT           IDENTITY (1, 1) NOT NULL,
    [Name]         VARCHAR (255) NOT NULL,
    [IsActive]     BIT           CONSTRAINT [DF_Instrument_IsActive] DEFAULT ((1)) NOT NULL,
    [MaxAmidites]  INT           DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_Instrument] PRIMARY KEY CLUSTERED ([InstrumentID] ASC),
    CONSTRAINT [IX_Instrument] UNIQUE NONCLUSTERED ([Name] ASC)
);







