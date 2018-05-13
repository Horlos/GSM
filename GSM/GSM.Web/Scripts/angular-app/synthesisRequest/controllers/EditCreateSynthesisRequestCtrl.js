(function(){
    
    angular.module('synthesisRequestApp')
        .controller('EditCreateSynthesisRequestCtrl', EditCreateSynthesisRequestCtrl)
        .controller('SelectModalCtrl', App.Widgets.SelectModalCtrl);
        
    EditCreateSynthesisRequestCtrl.$inject = [
        '$scope',
        '$location',
        '$routeParams',
        '$uibModal',
        'strandResource',
        'materialRequestResource',
        'SynthesisRequestService'
    ];

    function EditCreateSynthesisRequestCtrl($scope, $location, $routeParams, $uibModal, strandResource, materialRequestResource, SynthesisRequestService) {

        var editCreateSynthesisRequest = this;

        editCreateSynthesisRequest.submitMessage = "";
        editCreateSynthesisRequest.canSubmit = false;
        editCreateSynthesisRequest.canReset = true;
        editCreateSynthesisRequest.ScaleUnitDefault = "µmol";

        editCreateSynthesisRequest.RequestDateOptions = {
           
        };

        
        editCreateSynthesisRequest.NeededMinDate = new Date();

        var NeededDate = new Date();
        NeededDate.setDate((new Date()).getDate() + 28); //add 4 weeks 

        editCreateSynthesisRequest.formData = {
            Id: null,
            Needed: NeededDate
        };

        editCreateSynthesisRequest.StatusList = [];

        //selected objects in grid to delete
        editCreateSynthesisRequest.selectedAntisenseStrand = null;

        //selected objects grid
        editCreateSynthesisRequest.selectedSenseStrands = {
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            enableColumnMenus: false,
            enableHorizontalScrollbar: true,
            multiSelect: false,
            columnDefs: [
                {
                    name: 'ArrowheadStrandId',
                    displayName: 'Strand ID', 
                    field: 'Strand.ArrowheadStrandId'
                },
                {
                    name: 'Scale', displayName: 'Scale',
                    cellTemplate: "ScaleInput"
                },
                {
                    name: 'ScaleUnit', displayName: 'Unit',
                    cellTemplate: 'unitSelect',
                    editDropdownOptionsArray: [
                      'µmol',
                      'mg'
                    ]
                }
            ],
            onRegisterApi: function (gridApi) {
                editCreateSynthesisRequest.gridApi = gridApi;
                gridApi.selection.on.rowSelectionChanged(null, function (row) {
                    if (row.isSelected) {
                        editCreateSynthesisRequest.selectedAntisenseStrand = row.entity;
                    } else {
                        editCreateSynthesisRequest.selectedAntisenseStrand = null;
                    }
                });
            }
        };

        //selected objects in grid to delete
        editCreateSynthesisRequest.selectedMaterialRequestoRemove = null;

        editCreateSynthesisRequest.selectedMaterialRequest = {
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            enableColumnMenus: false,
            enableHorizontalScrollbar: true,
            multiSelect: false,
            columnDefs: [
                { name: 'Id', displayName: 'Material Request ID' },
                { name: 'RequestDate', displayName: 'Date', cellFilter: 'date:"MM-dd-yyyy\"', type: 'date' }
            ], 
            onRegisterApi: function (gridApi) {
                editCreateSynthesisRequest.gridApi = gridApi;
                gridApi.selection.on.rowSelectionChanged(null, function (row) {
                    if (row.isSelected) {
                        editCreateSynthesisRequest.selectedMaterialRequestoRemove = row.entity;
                    } else {
                        editCreateSynthesisRequest.selectedMaterialRequestoRemove = null;
                    }
                });
            }
        };

        function loadSynthesisRequest(editCreateSynthesisRequestId) {

            if (isNaN(editCreateSynthesisRequestId))
                return false;

            loadAllStatus();
            disableSubmit();
            disableCancel();

            SynthesisRequestService.get(editCreateSynthesisRequestId)
                .then(function (data) {
               
                    onLoadCompleted(data);
                }, function (e) {

                    enableCancel();
                    editCreateSynthesisRequest.submitMessage = "Error: !" + e;
                });
        }


        function onLoadCompleted(data) {

            editCreateSynthesisRequest.formData = data; 
            editCreateSynthesisRequest.formData.RequestDate = new Date(data.RequestDate);
            if (data.Needed != null)
                editCreateSynthesisRequest.formData.Needed = new Date(data.Needed); //data.Needed != null ? new Date(data.Needed) : null;
            
            editCreateSynthesisRequest.selectedSenseStrands.data = data.SynthesisRequestStrands;
            editCreateSynthesisRequest.selectedMaterialRequest.data = data.MaterialRequests;

            validateCanSubmit();
            enableCancel();
        }


        function loadAllStatus() {
            SynthesisRequestService.getAllStatus()
             .then(function (data) {
                 editCreateSynthesisRequest.StatusList = data;
             }, function (e) {

             });
        }

        function addItems(gridName) {
        var settings = {
                templateUrl: '/Scripts/angular-app/widgets/selectModalTemplate.html',
                controller: 'SelectModalCtrl',
                controllerAs: "vm",
                size: 'lg',
                resolve: {
                    selectModalConfig: function () {
                        return {
                            gridOptions: {
                                multiSelect: true,
                                columnDefs: [
                                    {
                                        name: 'ArrowheadStrandId',
                                        displayName: 'Strand ID',
                                        field: 'ArrowheadStrandId'
                                    },
                                    {
                                        name: 'Target.Name',
                                        displayName: 'Target',
                                        field: 'Target.Name'
                                    }
                                ]
                            },
                            collectionName: 'ItemList',
                            prompt: 'Select Strands'
                        }
                    },
                    searchResource: function () {
                        return {
                            getData: function (query) {
                                return strandResource.get(query).$promise;
                            }
                        }

                    }
                }
            };
            var modalInstance = angular.bind(this,$uibModal.open(settings));
            modalInstance.result.then(angular.bind(this, function (result) {
                if (result !== 'cancel')
                {
                    //if there are selected records
                    if (result != null && result.length > 0) {
                        //editCreateSynthesisRequest.selectedSenseStrands.data = result;

                        $.each(result, function (index, strand ) {
                            var syntesisRequestStrand = {
                                Strand: strand,
                                StrandId: strand.Id,
                                Scale: 0,
                                ScaleUnit: editCreateSynthesisRequest.ScaleUnitDefault
                            };
                            editCreateSynthesisRequest.selectedSenseStrands.data.push(syntesisRequestStrand);
                        });
                    }
                    validateCanSubmit();
                };
            }), function () { });
        }

        function addItemasMaterialRequests() {
            var settings = {
                templateUrl: '/Scripts/angular-app/widgets/selectModalTemplate.html',
                controller: 'SelectModalCtrl',
                controllerAs: "vm",
                size: 'lg',
                resolve: {
                    selectModalConfig: function () {
                        return {
                            gridOptions: {
                                multiSelect: true,
                                columnDefs: [
                                    {
                                        name: 'Id',
                                        displayName: 'Material Request ID',
                                        field: 'Id'
                                    },
                                    {
                                        name: 'RequestDate',
                                        displayName: 'Date',
                                        cellFilter: 'date:"MM-dd-yyyy\"',
                                        type: 'date',
                                        field: 'RequestDate'
                                    }
                                ]
                            },
                            prompt: 'Select Material Requests'
                        }
                    },
                    searchResource: function () {
                        return {
                            getData: function (query) {
                                return materialRequestResource.get(query).$promise;
                            }
                        }

                    }
                }
            };
            var modalInstance = $uibModal.open(settings);
            modalInstance.result.then(angular.bind(this, function (result) {
                if (result !== 'cancel') {
                    //if there are selected records
                    if (result != null && result.length > 0) {
                        AddRange(editCreateSynthesisRequest.selectedMaterialRequest.data, result);
                    }
                    validateCanSubmit();
                };
            }), function () { });
        }

        function removeSelectedAntisenseStrand() {
            if (editCreateSynthesisRequest.selectedAntisenseStrand != null) {
                FindAndRemove(editCreateSynthesisRequest.selectedSenseStrands.data, editCreateSynthesisRequest.selectedAntisenseStrand);
                editCreateSynthesisRequest.selectedAntisenseStrand = null;
            }
            validateCanSubmit();
        }

        function removeSelectedMaterialRequest(){
            if (editCreateSynthesisRequest.selectedMaterialRequestoRemove != null) {
                FindAndRemove(editCreateSynthesisRequest.selectedMaterialRequest.data, editCreateSynthesisRequest.selectedMaterialRequestoRemove);
                editCreateSynthesisRequest.selectedMaterialRequestoRemove = null;
            }
            validateCanSubmit();
        }

        function save() {
            //disable the save button to avoid multiple submit
            disableSubmit();
            disableCancel();

            if (editCreateSynthesisRequest.formData.Id == null ) {
                editCreateSynthesisRequest.formData.SynthesisRequestStrands = editCreateSynthesisRequest.selectedSenseStrands.data;
                editCreateSynthesisRequest.formData.MaterialRequests = editCreateSynthesisRequest.selectedMaterialRequest.data;

                SynthesisRequestService.post(editCreateSynthesisRequest.formData)
                    .then(function (data) {
                        if (!data.HasErrors)
                        {
                            onSaveCompleted(data);
                        }
                        else
                        {
                            enableCancel();
                            enableSubmit();

                            var error = "";
                            angular.forEach(data.Errors, function (value, prop, obj) {
                                error += prop + " " + value;
                            });
                            editCreateSynthesisRequest.submitMessage = "Error: !" + error ;
                        }

                    }, function (e) {
                        enableCancel();
                        enableSubmit();

                        editCreateSynthesisRequest.submitMessage = "Error: !" + e;
                    });

            } else {
                editCreateSynthesisRequest.formData.SynthesisRequestStrands = editCreateSynthesisRequest.selectedSenseStrands.data;
                editCreateSynthesisRequest.formData.MaterialRequests = editCreateSynthesisRequest.selectedMaterialRequest.data;

                //update synthesis Request
                SynthesisRequestService.put(editCreateSynthesisRequest.formData)
                    .then(function (data) {
                        if (!data.HasErrors)
                        {
                            onUpdateCompleted(data);
                        }
                        else
                        {
                            enableCancel();
                            enableSubmit();

                            var error = "";
                            angular.forEach(data.Errors, function (value, prop, obj) {
                                error += prop + " " + value;
                            });

                            editCreateSynthesisRequest.submitMessage = "Error: !" + error;
                        }

                    }, function (e) {
                        enableCancel();
                        enableSubmit();
                        editCreateSynthesisRequest.submitMessage = "Error: !" + e;
                    });

            }
        }


        function onSaveCompleted( data ) {
            editCreateSynthesisRequest.formData.Id = data.Id;

            //redirect to details
            window.location.pathname = '/SynthesisRequest/Details/' + editCreateSynthesisRequest.formData.Id;

            //enableCancel();
            //enableSubmit();
            //editCreateSynthesisRequest.submitMessage = "Material Request saved successfully with ID: " + data.SynthesisRequestID;
        }

        function onUpdateCompleted(data) {
            
            window.location.pathname = '/SynthesisRequest/Details/' + editCreateSynthesisRequest.formData.Id;

            //enableCancel();
            //enableSubmit();
            //editCreateSynthesisRequest.submitMessage = "Material Request Updated successfully with ID: " + data.SynthesisRequestID;
        }


        function cancelChanges() {
            if (editCreateSynthesisRequest.formData.Id == null) {
                window.location.pathname = '/SynthesisRequest';
            } else {
                window.location.pathname = '/SynthesisRequest/Details/' + editCreateSynthesisRequest.formData.Id;
            }
        }

        function validateCanSubmit() {
            if (editCreateSynthesisRequest.selectedSenseStrands.data.length == 0 ) {
                editCreateSynthesisRequest.canSubmit = false;
            } else {
                editCreateSynthesisRequest.canSubmit = true;
            }
        }

        function validateCanSave() {
            for (var i = 0; i < this.selectedSenseStrands.data.length; i++) {
                if (this.selectedSenseStrands.data[i].Scale === 0) {
                    return false;
                }
            }

            return true;
        }

        function enableSubmit() {
            editCreateSynthesisRequest.canSubmit = true;
        }

        function disableSubmit() {
            editCreateSynthesisRequest.canSubmit = false;
        }

        function enableCancel() {
            editCreateSynthesisRequest.canReset = true;
        }

        function disableCancel() {
            editCreateSynthesisRequest.canReset = false;
        }

        loadSynthesisRequest(LastUrlParam($location.absUrl()));

        editCreateSynthesisRequest.addItems = addItems;
        editCreateSynthesisRequest.addItemasMaterialRequests = addItemasMaterialRequests;
        editCreateSynthesisRequest.validateCanSave = validateCanSave;
        editCreateSynthesisRequest.save = save;
        editCreateSynthesisRequest.cancelChanges = cancelChanges;
        editCreateSynthesisRequest.removeSelectedMaterialRequest = removeSelectedMaterialRequest;
        editCreateSynthesisRequest.removeSelectedAntisenseStrand = removeSelectedAntisenseStrand;
    }

})();