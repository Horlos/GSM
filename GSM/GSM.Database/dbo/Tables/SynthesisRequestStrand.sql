CREATE TABLE [dbo].[SynthesisRequestStrand] (
    [SynthesisRequestID] INT            NOT NULL,
    [StrandID]           INT            NOT NULL,
    [Scale]              DECIMAL (9, 1) NOT NULL,
    [ScaleUnit]          VARCHAR (4)    NOT NULL,
    CONSTRAINT [PK_SynthesisRequestStrand] PRIMARY KEY CLUSTERED ([SynthesisRequestID] ASC, [StrandID] ASC),
    CONSTRAINT [FK_SynthesisRequestStrand_Strand] FOREIGN KEY ([StrandID]) REFERENCES [dbo].[Strand] ([ID]),
    CONSTRAINT [FK_SynthesisRequestStrand_SynthesisRequest] FOREIGN KEY ([SynthesisRequestID]) REFERENCES [dbo].[SynthesisRequest] ([SynthesisRequestID])
);

