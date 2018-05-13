namespace App.Duplexes.Controllers {

	class CreateDuplexBatchCtrl {
		public duplexBatch: any;
		public strandbatches: Array<any>;

		public isFormSubmitted: boolean;
		public isDatePickerOpened: boolean;

		static $inject = ['$scope', '$window', '$uibModal', 'duplexesService'];
		constructor(
			private $scope,
			private $window: ng.IWindowService,
			private $uibModal: ng.ui.bootstrap.IModalService,
			private duplexesService: App.Duplexes.Services.IDuplexesService) {
			this.isFormSubmitted = false;
			this.isDatePickerOpened = false;
			this.duplexBatch = {
				PreparedDate: new Date(),
				Duplex: {},
				SenseStrandBatches: [],
				AntiSenseStrandBatches: []
			}
		}

		permitSave(): boolean {
			if (this.$scope.form.$valid &&
				this.isDuplexSelected() &&
				this.isAntiSenseStrandBatchSelected() &&
				this.isSenseStrandBatchSelected()) {
				return true;
			}

			return false;
		}

		onSubmit(): void {
			this.isFormSubmitted = true;
		}

		submitForm(): void {
			if (this.permitSave()) {
				this.createDuplexBatch();
			}
		}

		createDuplexBatch() {
			let duplexId = this.duplexBatch.DuplexId;
			var strandBatches = [];
			for (let i = 0; i < this.duplexBatch.SenseStrandBatches.length; i++) {
				strandBatches.push(this.duplexBatch.SenseStrandBatches[i]);
			}
			for (let i = 0; i < this.duplexBatch.AntiSenseStrandBatches.length; i++) {
				strandBatches.push(this.duplexBatch.AntiSenseStrandBatches[i]);
			}
			this.duplexBatch.StrandBatches = strandBatches;

			this.duplexesService.createDuplexBatch(duplexId, this.duplexBatch)
				.then((response) => {
					this.duplexBatch.Error = response.Errors;
					this.$scope.form.$setPristine();
					if (!response.HasErrors) {
						this.$window.location.href = `/Duplex/EditDuplexBatch/${response.Id}`;
					}
				});
		}

		cancelChanges(): void {
			this.$window.location.href = '/Duplex/Batches';
		}

		isDuplexSelected(): boolean {
			if (this.duplexBatch.DuplexId)
				return true;

			return false;
		}

		isAntiSenseStrandBatchSelected(): boolean {
			if (this.duplexBatch.AntiSenseStrandBatches.length >= 1)
				return true;

			return false;
		}

		isSenseStrandBatchSelected(): boolean {
			if (this.duplexBatch.SenseStrandBatches.length >= 1)
				return true;

			return false;
		}

		selectDate(): void {
			this.onSelectDate();
		}

		onSelectDate(): void {
			this.isDatePickerOpened = !this.isDatePickerOpened;
		}


		getSenseStrandBatches(strandBatches: Array<any>): Array<any> {
			return strandBatches.filter((value) => {
				return value.Orientation === "Sense";
			});
		}

		getAntiSenseStrandBatches(strandBatches: Array<any>): Array<any> {
			return strandBatches.filter((value) => {
				return value.Orientation === "Antisense";
			});
		}

		removeSenseStrandBatch(index: number): void {
			this.duplexBatch.SenseStrandBatches.splice(index, 1);
		}

		removeAntiSenseStrandBatch(index: number): void {
			this.duplexBatch.AntiSenseStrandBatches.splice(index, 1);
		}

		clearStrandBatches() {
			this.duplexBatch.SenseStrandBatches = [];
			this.duplexBatch.AntiSenseStrandBatches = [];
		}

		containsStrandBatch(id: number): boolean {
			return this.duplexBatch.SenseStrandBatches.some((item) => { return item.Id === id; });
		}

		selectDuplex(): void {
			let modalSettings: ng.ui.bootstrap.IModalSettings = {
				templateUrl: '/Scripts/angular-app/widgets/selectModalTemplate.html',
				controller: 'SelectModalCtrl',
				controllerAs: 'vm',
				size: 'lg',
				resolve: {
					selectModalConfig: (): App.Widgets.ISelectModalConfig => {
						return {
							gridOptions: {
								multiSelect: false,
								columnDefs: [
									{
										name: 'ArrowheadDuplexId',
										displayName: ' Duplex ID',
										field: 'ArrowheadDuplexId'
									},
									{
										name: 'SenseStrandId',
										displayName: 'Sense Strand ID',
										field: 'SenseStrand.ArrowheadStrandId'
									},
									{
										name: 'SenseStrandSequence',
										displayName: 'Sense Sequence 5 -> 3 ',
										field: 'SenseStrand.Sequence'
									},
									{
										name: 'AntiSenseStrandId',
										displayName: 'Anti Sense Strand ID',
										field: 'AntiSenseStrand.ArrowheadStrandId'
									},
									{
										name: 'AntiSenseStrandSequence',
										displayName: 'Anti Sense Sequence 5',
										field: 'AntiSenseStrand.Sequence'
									},
									{
										name: 'Target',
										displayName: 'Target',
										field: 'Target.Name'
									}
								]
							},
							collectionName: 'ItemList',
							prompt: 'Select Duplex'
						}
					},
					searchResource: (): App.Widgets.ISearchResource => {
						return {
							getData: (query): ng.IPromise<any> => {
								return this.duplexesService.getDuplexes(query);
							}
						}
					}
				}
			};
			let modalInstance = this.$uibModal.open(modalSettings);
			modalInstance.result.then((result) => {
				if (result != null && result !== 'cancel') {
					this.clearStrandBatches();
					this.duplexBatch.Duplex = {
						ArrowheadDuplexId: result.ArrowheadDuplexId,
						AntiSenseStrand: {
							Id: result.AntiSenseStrand.Id,
							ArrowheadStrandId: result.AntiSenseStrand.ArrowheadStrandId,
							Sequence: result.AntiSenseStrand.Sequence
						},
						SenseStrand: {
							Id: result.SenseStrand.Id,
							ArrowheadStrandId: result.SenseStrand.ArrowheadStrandId,
							Sequence: result.SenseStrand.Sequence
						},
						Target: {
							Id: result.Target.Id,
							Name: result.Target.Name
						}
					};
					this.duplexBatch.DuplexId = result.Id;
				};
			});
		}

		selectSenseStrandBatches(): void {
			var orientation = "Sense";
			let prompt = 'Select Sense Strand Batches';
			var searchResource: App.Widgets.ISearchResource = {
				getData: (query): ng.IPromise<any> => {
					let strandId = this.duplexBatch.Duplex.SenseStrand.Id;
					return this.duplexesService.getStrandBatches(strandId, query);
				}
			};
			this.selectStrandBatches(prompt, searchResource).then((result) => {
				if (result != null && result !== 'cancel') {
					for (let i = 0; i < result.length; i++) {
						if (!this.containsStrandBatch(result[0].Id)) {
							this.duplexBatch.SenseStrandBatches.push({
								StrandBatch: {
									Id: result[i].Id,
									ArrowHeadBatchNumber: result[i].ArrowHeadBatchNumber
								}
							});
						}
					}
				};
			});
		}

		selectAntiSenseStrandBatches(): void {
			var orientation = "Antisense";
			let prompt = 'Select Anti Sense Strand Batches';
			var searchResource: App.Widgets.ISearchResource = {
				getData: (query): ng.IPromise<any> => {
					let strandId = this.duplexBatch.Duplex.AntiSenseStrand.Id;
					return this.duplexesService.getStrandBatches(strandId, query);
				}
			};
			this.selectStrandBatches(prompt, searchResource).then((result) => {
				if (result != null && result !== 'cancel') {
					for (let i = 0; i < result.length; i++) {
						if (!this.containsStrandBatch(result[0].Id)) {
							this.duplexBatch.AntiSenseStrandBatches.push({
								StrandBatch: {
									Id: result[i].Id,
									ArrowHeadBatchNumber: result[i].ArrowHeadBatchNumber
								}
							});
						}
					}
				};
			});
		}

		selectStrandBatches(promt: string, searchResource: App.Widgets.ISearchResource) {
			let modalSettings: ng.ui.bootstrap.IModalSettings = {
				templateUrl: '/Scripts/angular-app/widgets/selectModalTemplate.html',
				controller: 'SelectModalCtrl',
				controllerAs: 'vm',
				size: 'lg',
				resolve: {
					selectModalConfig: (): App.Widgets.ISelectModalConfig => {
						return {
							gridOptions: {
								multiSelect: true,
								columnDefs: [
									{
										name: 'ArrowheadBatchNumber',
										displayName: 'Batch Number',
										field: 'ArrowHeadBatchNumber'
									},
									{
										name: 'RemainingVolume',
										displayName: 'Remaining Volume (ul)',
										field: 'RemainingVolume',
										cellFilter: 'number: 1'
									},
									{
										name: 'AmountRemaining',
										displayName: 'Amount Remaining (mg)',
										field: 'AmountRemaining',
										cellFilter: 'number: 1'
									},
									{
										name: 'Purity',
										displayName: '% FLP',
										field: 'Purity',
										cellFilter: 'number: 2'
									},
									{
										name: 'Unavailable',
										displayName: 'Unavailable',
										field: 'Unavailable',
										visible: true,
										type: 'boolean',
										cellTemplate: '<input type="checkbox" ng-model="row.entity.Unavailable" disabled>'
									},
								]
							},
							collectionName: 'ItemList',
							prompt: promt
						}
					},
					searchResource: searchResource
				}
			};
			let modalInstance = this.$uibModal.open(modalSettings);
			return modalInstance.result;
		}
	}

	App.getAppContainer()
		.getSection('app.duplexes')
		.getInstance()
		.controller('CreateDuplexBatchCtrl', CreateDuplexBatchCtrl)
		.controller('SelectModalCtrl', App.Widgets.SelectModalCtrl);
}