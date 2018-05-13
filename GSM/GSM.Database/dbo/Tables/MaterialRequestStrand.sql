CREATE TABLE [dbo].[MaterialRequestStrand] (
    [MaterialRequestID] INT NOT NULL,
    [StrandID]          INT NOT NULL,
	[AmountRequested] DECIMAL(10, 2) NOT NULL DEFAULT 0, 
    CONSTRAINT [PK_MaterialRequestStrand] PRIMARY KEY CLUSTERED ([MaterialRequestID] ASC, [StrandID] ASC),
    CONSTRAINT [FK_MaterialRequestStrand_MaterialRequest] FOREIGN KEY ([MaterialRequestID]) REFERENCES [dbo].[MaterialRequest] ([MaterialRequestID]),
    CONSTRAINT [FK_MaterialRequestStrand_Strand] FOREIGN KEY ([StrandID]) REFERENCES [dbo].[Strand] ([ID])
);



