CREATE TABLE [dbo].[RoleUser] (
    [RoleUserID]           INT IDENTITY (1, 1) NOT NULL,
    [UserID] INT NOT NULL,
    [RoleID]       INT NOT NULL,
    CONSTRAINT [PK_dbo.RoleUser] PRIMARY KEY CLUSTERED ([RoleUserID] ASC),
    CONSTRAINT [FK_dbo.RoleUser_dbo.User_UserId] FOREIGN KEY ([UserID]) REFERENCES [dbo].[User] ([UserID]),
    CONSTRAINT [FK_dbo.RoleUser_dbo.Role_RoleId] FOREIGN KEY ([RoleID]) REFERENCES [dbo].[Role] ([RoleID]) ON DELETE CASCADE
);
