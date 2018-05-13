CREATE TABLE [dbo].[DuplexBatchStrandBatch] (
    [DuplexBatchID] INT        NOT NULL,
    [StrandBatchID] INT        NOT NULL,
    [TotalUsed]     FLOAT (53) NULL,
    CONSTRAINT [PK_DuplexBatchStrandBatch] PRIMARY KEY CLUSTERED ([DuplexBatchID] ASC, [StrandBatchID] ASC),
    CONSTRAINT [FK_DuplexBatchStrandBatch_DuplexBatch] FOREIGN KEY ([DuplexBatchID]) REFERENCES [dbo].[DuplexBatch] ([DuplexBatchID]),
    CONSTRAINT [FK_DuplexBatchStrandBatch_StrandBatch] FOREIGN KEY ([StrandBatchID]) REFERENCES [dbo].[StrandBatch] ([StrandBatchID])
);

