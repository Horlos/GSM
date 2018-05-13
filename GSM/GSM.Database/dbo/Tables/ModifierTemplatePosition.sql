CREATE TABLE [dbo].[ModifierTemplatePosition] (
    [ModifierTemplatePositionID] INT           IDENTITY (1, 1) NOT NULL,
    [ModifierTemplateID]         INT           NOT NULL,
    [Position]                   INT           NOT NULL,
    [Mod]                        VARCHAR (255) NOT NULL,
    CONSTRAINT [PK_ModifierTemplatePostion] PRIMARY KEY CLUSTERED ([ModifierTemplatePositionID] ASC),
    CONSTRAINT [FK_ModifierTemplatePostion_ModifierTemplate] FOREIGN KEY ([ModifierTemplateID]) REFERENCES [dbo].[ModifierTemplate] ([ModifierTemplateID])
);





