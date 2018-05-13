CREATE TABLE [dbo].[MaterialRequestDuplex] (
    [MaterialRequestID] INT NOT NULL,
    [DuplexID]          INT NOT NULL,
    [AmountRequested] DECIMAL(10, 2) NOT NULL DEFAULT 0, 
    CONSTRAINT [PK_MaterialRequestDuplex] PRIMARY KEY CLUSTERED ([MaterialRequestID] ASC, [DuplexID] ASC),
    CONSTRAINT [FK_MaterialRequestDuplex_Duplex] FOREIGN KEY ([DuplexID]) REFERENCES [dbo].[Duplex] ([ID]),
    CONSTRAINT [FK_MaterialRequestDuplex_MaterialRequest] FOREIGN KEY ([MaterialRequestID]) REFERENCES [dbo].[MaterialRequest] ([MaterialRequestID])
);



