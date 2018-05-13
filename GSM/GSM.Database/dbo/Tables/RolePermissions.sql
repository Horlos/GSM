CREATE TABLE [dbo].[RolePermissions]
(
	[RoleID] INT NOT NULL , 
    [PermissionID] INT NOT NULL, 
	CONSTRAINT [PK_RolePermissions] PRIMARY KEY CLUSTERED ([RoleID] ASC, [PermissionID] ASC),
	CONSTRAINT [FK_RolePermissions_Role] FOREIGN KEY ([RoleID]) REFERENCES [dbo].Role ([RoleID]),
    CONSTRAINT [FK_RolePermissions_Permissions] FOREIGN KEY ([PermissionID]) REFERENCES [dbo].[Permissions] ([PermissionID])
)
