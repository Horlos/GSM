CREATE TABLE [dbo].[SynthesisRequest] (
    [SynthesisRequestID] INT           IDENTITY (1, 1) NOT NULL,
    [SynthesisStatusID]  INT           NOT NULL,
    [RequestDate]        DATE          NULL,
    [RequestedBy]        VARCHAR (255) NULL,
    [Needed]             DATE          NULL,
    [DateCompleted]      DATE          NULL,
    [Notes]              VARCHAR (MAX) NULL,
    [SetDetail]          VARCHAR (50)  NULL,
    CONSTRAINT [PK_SynthesisRequest] PRIMARY KEY CLUSTERED ([SynthesisRequestID] ASC)
);



