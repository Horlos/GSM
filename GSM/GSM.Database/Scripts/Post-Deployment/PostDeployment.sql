SET XACT_ABORT ON;
BEGIN TRY

BEGIN TRANSACTION

INSERT INTO [dbo].[Permissions] (PermissionID, Description, Name) 
VALUES 	(1,	'Manage Roles',	'ManageRoles'),
		(2,	'Create Strand',	'CreateStrand'),
		(3,	'Import Strand',	'ImportStrand'),
		(4,	'Manage Modifier Templates',	'ManageModifierTemplates'),
		(5,	'Create Duplex',	'CreateDuplex'),
		(6,	'Import Duplexes',	'ImportDuplexes'),
		(7,	'Manage Mod Structure',	'ManageModStructure'),
		(8,	'Create/Edit Targets',	'CreateEditTargets'),
		(9, 'Create/Edit Species',	'CreateEditSpecies'),
		(10,'Create Material Request',	'CreateMaterialRequest'),
		(11,'Update Material Request Status',	'UpdateMaterialRequestStatus'),
		(12,'Create Synthesis Request',	'CreateSynthesisRequest'),
		(13,'Update Synthesis Request Status',	'UpdateSynthesisRequestStatus'),
		(14,'Create Strand Batch',	'CreateStrandBatch'),
		(15,'Create Duplex Batch',	'CreateDuplexBatch'),
		(16,'Create/Edit Instruments',	'CreateEditInstruments');
	

-- End of entire script. Everything else must be added above this in order to be wrapped in the transaction
COMMIT TRANSACTION

END TRY
BEGIN CATCH

	ROLLBACK TRANSACTION

	DECLARE @ErrorMessage NVARCHAR(MAX), 
			@ErrorSeverity INT,
			@ErrorState INT;

    SELECT @ErrorMessage = ERROR_MESSAGE() + ' Line ' + cast(ERROR_LINE() as nvarchar(5)), 
	       @ErrorSeverity = ERROR_SEVERITY(), 
		   @ErrorState = ERROR_STATE();

    RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);

END CATCH