CREATE TABLE [dbo].[Permissions]
(
	[PermissionID] INT NOT NULL PRIMARY KEY, 
    [Description] NVARCHAR(MAX) NULL, 
    [Name] NVARCHAR(MAX) NOT NULL
)
