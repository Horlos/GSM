CREATE TABLE [dbo].[Duplex] (
    [ID]          INT             IDENTITY (1, 1) NOT NULL,
    [DuplexID] VARCHAR (255)   NOT NULL,
    [SenseStrandID]     INT             NOT NULL,
    [AntiSenseStrandID] INT             NOT NULL,
    [TargetID]          INT             NOT NULL,
    [Notes]             VARCHAR (MAX)   NULL,
    [MW]                DECIMAL (10, 4) NULL,
    CONSTRAINT [PK_Duplex] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_Duplex_Strand_AS] FOREIGN KEY ([AntiSenseStrandID]) REFERENCES [dbo].[Strand] ([ID]),
    CONSTRAINT [FK_Duplex_Strand_SS] FOREIGN KEY ([SenseStrandID]) REFERENCES [dbo].[Strand] ([ID]),
    CONSTRAINT [FK_Duplex_Target] FOREIGN KEY ([TargetID]) REFERENCES [dbo].[Target] ([TargetID]),
    CONSTRAINT [AK_Duplex] UNIQUE NONCLUSTERED ([DuplexID] ASC)

);









