CREATE TABLE [dbo].[Strand] (
    [ID]              INT             IDENTITY (1, 1) NOT NULL,
    [StrandID]     VARCHAR (255)   NOT NULL,
    [TargetID]              INT             NOT NULL,
    [OrientationID]         INT             NOT NULL,
    [GenomeNumber]          VARCHAR (255)   NULL,
    [GenomePosition]        VARCHAR (255)   NULL,
    [ParentSequence]        VARCHAR (255)   NULL,
    [Sequence]              VARCHAR (2000)  NOT NULL,
    [FirstPosition]         INT             NOT NULL DEFAULT 1,
    [BaseSequence]          VARCHAR (2000)  NOT NULL,
    [MW]                    DECIMAL (10, 4) NULL,
    [ExtinctionCoefficient] DECIMAL (10, 4) NULL,
    [Notes]                 VARCHAR (MAX)   NULL,
    CONSTRAINT [PK_Strand] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_Strand_Orientation] FOREIGN KEY ([OrientationID]) REFERENCES [dbo].[Orientation] ([OrientationID]),
    CONSTRAINT [FK_Strand_Target] FOREIGN KEY ([TargetID]) REFERENCES [dbo].[Target] ([TargetID]),
    CONSTRAINT [IX_Strand] UNIQUE NONCLUSTERED ([StrandID] ASC)

);





















