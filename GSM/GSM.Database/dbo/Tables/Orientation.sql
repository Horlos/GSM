CREATE TABLE [dbo].[Orientation] (
    [OrientationID] INT           IDENTITY (1, 1) NOT NULL,
    [Name]          VARCHAR (255) NOT NULL,
    CONSTRAINT [PK_Orientation] PRIMARY KEY CLUSTERED ([OrientationID] ASC),
    CONSTRAINT [IX_Orientation] UNIQUE NONCLUSTERED ([Name] ASC)
);





