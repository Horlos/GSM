CREATE TABLE [dbo].[SythesisRequestMaterialRequest] (
    [SynthesisRequestID] INT NOT NULL,
    [MaterialRequestID]  INT NOT NULL,
    CONSTRAINT [PK_SythesisRequestMaterialRequest] PRIMARY KEY CLUSTERED ([SynthesisRequestID] ASC, [MaterialRequestID] ASC),
    CONSTRAINT [FK_SythesisRequestMaterialRequest_MaterialRequest] FOREIGN KEY ([MaterialRequestID]) REFERENCES [dbo].[MaterialRequest] ([MaterialRequestID]),
    CONSTRAINT [FK_SythesisRequestMaterialRequest_SynthesisRequest] FOREIGN KEY ([SynthesisRequestID]) REFERENCES [dbo].[SynthesisRequest] ([SynthesisRequestID])
);

