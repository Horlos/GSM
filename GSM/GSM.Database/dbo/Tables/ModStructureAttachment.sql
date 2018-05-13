CREATE TABLE [dbo].[ModStructureAttachment] (
    [ModStructureAttachmentID] INT             IDENTITY (1, 1) NOT NULL,
    [ModStructureID]           INT             NOT NULL,
    [Data]                     VARBINARY (MAX) NOT NULL,
    [FileName]                 VARCHAR (255)   NOT NULL,
    CONSTRAINT [PK_ModStructureAttachment] PRIMARY KEY CLUSTERED ([ModStructureAttachmentID] ASC),
    CONSTRAINT [FK_ModStructureAttachment_ModStructure] FOREIGN KEY ([ModStructureID]) REFERENCES [dbo].[ModStructure] ([ModStructureID])
);

