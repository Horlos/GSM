CREATE TABLE [dbo].[Status] (
    [StatusID]    INT          IDENTITY (1, 1) NOT NULL,
    [Description] VARCHAR (50) NOT NULL,
    CONSTRAINT [PK_Status] PRIMARY KEY CLUSTERED ([StatusID] ASC),
    CONSTRAINT [IX_Status] UNIQUE NONCLUSTERED ([Description] ASC)
);



