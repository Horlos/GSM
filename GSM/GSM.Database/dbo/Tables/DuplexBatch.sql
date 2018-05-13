CREATE TABLE [dbo].[DuplexBatch] (
    [DuplexBatchID]              INT            IDENTITY (1, 1) NOT NULL,
    [DuplexID]                   INT            NOT NULL,
    [DuplexBatchNumber] VARCHAR (50)   NOT NULL,
    [Purity]                     FLOAT (53)     NULL,
    [PreparedVolume]             FLOAT (53)     NULL,
    [DatePrepared]               DATE           CONSTRAINT [DF_DuplexBatch_DatePrepared] DEFAULT (getdate()) NOT NULL,
    [RunID]                      VARCHAR (50)   NOT NULL,
    [Position]                   VARCHAR (50)   NOT NULL,
    [Concentration]              FLOAT (53)     NULL,
    [MiscVolumeUsed]             FLOAT (53)     NULL,
    [Notes]                      NVARCHAR (MAX) NULL,
    [Unavailable]                BIT            CONSTRAINT [DF_DuplexBatch_Unavailable] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_DuplexBatch] PRIMARY KEY CLUSTERED ([DuplexBatchID] ASC),
    CONSTRAINT [FK_DuplexBatch_Duplex] FOREIGN KEY ([DuplexID]) REFERENCES [dbo].[Duplex] ([ID])
);



