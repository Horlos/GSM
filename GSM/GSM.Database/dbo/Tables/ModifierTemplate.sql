CREATE TABLE [dbo].[ModifierTemplate] (
    [ModifierTemplateID] INT           IDENTITY (1, 1) NOT NULL,
    [Name]               VARCHAR (255) NOT NULL,
    [OrientationID]      INT           NOT NULL,
    [FirstPosition]      INT           CONSTRAINT [DF_ModifierTemplate_FirstPosition] DEFAULT ((1)) NOT NULL,
    CONSTRAINT [PK_ModifierTemplate] PRIMARY KEY CLUSTERED ([ModifierTemplateID] ASC),
    CONSTRAINT [FK_ModifierTemplate_Orientation] FOREIGN KEY ([OrientationID]) REFERENCES [dbo].[Orientation] ([OrientationID])
);







