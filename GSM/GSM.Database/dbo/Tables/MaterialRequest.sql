CREATE TABLE [dbo].[MaterialRequest] (
    [MaterialRequestID] INT            IDENTITY (1, 1) NOT NULL,
    [RequestDate]       DATE           NOT NULL,
    [NeedByDate]        DATE           NULL,
    [StatusID]          INT            NOT NULL,
    [SubmittedBy]       INT            NOT NULL,
    [Notes]             NVARCHAR (MAX) NULL,
    [SetDetail]         VARCHAR (50)   NULL,
    CONSTRAINT [PK_MaterialRequest] PRIMARY KEY CLUSTERED ([MaterialRequestID] ASC),
    CONSTRAINT [FK_MaterialRequest_Status] FOREIGN KEY ([StatusID]) REFERENCES [dbo].[Status] ([StatusID]),
    CONSTRAINT [FK_MaterialRequest_User] FOREIGN KEY ([SubmittedBy]) REFERENCES [dbo].[User] ([UserID])
);







