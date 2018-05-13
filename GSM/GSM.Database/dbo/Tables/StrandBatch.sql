CREATE TABLE [dbo].[StrandBatch] (
    [StrandBatchID]        INT            IDENTITY (1, 1) NOT NULL,
    [StrandID]             INT            NOT NULL,
    [BatchNumber] VARCHAR (50)   NOT NULL,
    [Purity]               FLOAT (53)     NULL,
    [PreparedVolume_ul]    FLOAT (53)     NULL,
    [MiscVolumeUsed]       FLOAT (53)     NULL,
    [Notes]                NVARCHAR (MAX) NULL,
    [Unavailable]          BIT            CONSTRAINT [DF_StrandBatch_Unavailable] DEFAULT ((0)) NOT NULL,
    [InitiatedDate]        DATE           CONSTRAINT [DF_StrandBatch_CreateDate] DEFAULT (getdate()) NOT NULL,
    [Position]             VARCHAR (50)   NULL,
    [RunID]                VARCHAR (50)   NOT NULL,
    [SynthesisScale]       FLOAT (53)     NULL,
    [AmountPrepared]       FLOAT (53)     NULL,
    CONSTRAINT [PK_StrandBatch] PRIMARY KEY CLUSTERED ([StrandBatchID] ASC),
    CONSTRAINT [FK_StrandBatch_Strand] FOREIGN KEY ([StrandID]) REFERENCES [dbo].[Strand] ([ID]),
    CONSTRAINT [IX_StrandBatch] UNIQUE NONCLUSTERED ([BatchNumber] ASC)
);







