CREATE TABLE [dbo].[Target] (
    [TargetID] INT          IDENTITY (1, 1) NOT NULL,
    [Name]     VARCHAR (50) NOT NULL,
    [IsActive] BIT          CONSTRAINT [DF_Target_IsActive] DEFAULT ((1)) NOT NULL,
    CONSTRAINT [PK_Target] PRIMARY KEY CLUSTERED ([TargetID] ASC),
    CONSTRAINT [IX_Target] UNIQUE NONCLUSTERED ([Name] ASC)
);







