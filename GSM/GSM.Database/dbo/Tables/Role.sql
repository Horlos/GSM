CREATE TABLE [dbo].[Role] (
    [RoleID]         INT           IDENTITY (1, 1) NOT NULL,
    [Name]      NVARCHAR (50) NOT NULL,
    CONSTRAINT [PK_dbo.Role] PRIMARY KEY CLUSTERED ([RoleID] ASC),
    CONSTRAINT [IX_Role] UNIQUE NONCLUSTERED ([Name] ASC)
);



