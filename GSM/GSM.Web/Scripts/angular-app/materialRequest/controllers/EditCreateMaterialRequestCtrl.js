(function(){
    
    angular.module('materialRequestApp')
        .controller('EditCreateMaterialRequestController', EditCreateMaterialRequestController)
        .controller('SelectModalCtrl', App.Widgets.SelectModalCtrl);

    EditCreateMaterialRequestController.$inject = [
        '$scope',
        '$location',
        '$routeParams',
        '$uibModal',
        'strandResource',
        'duplexResource',
        'MaterialRequestService'
    ];

    function EditCreateMaterialRequestController($scope, $location, $routeParams, $uibModal, strandResource, duplexResource, MaterialRequestService) {

        var createMaterialRequest = this;

        createMaterialRequest.submitMessage = "";
        createMaterialRequest.canSubmit = false;
        createMaterialRequest.canReset = true;

        createMaterialRequest.RequestDateOptions = {
           
        };

        createMaterialRequest.formData = {
            Id : null,
            RequestDate: new Date(),
            NeedByDate: null,
            Notes: null
        };

        createMaterialRequest.StatusList = [];

        //createMaterialRequest.selectedTarget = {};

        //selected objects in grid to delete
        createMaterialRequest.selectedAntisenseStrand = null;

        //selected objects grid
        createMaterialRequest.selectedSenseStrands = {
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            enableColumnMenus: false,
            enableHorizontalScrollbar: 2,
            multiSelect: false,
            columnDefs: [
                {
                    name: 'ArrowheadStrandID',
                    displayName: 'Strand ID',
                    field: 'Strand.ArrowheadStrandId'
                },
                {
                    name: 'Target',
                    displayName: 'Target',
                    field: 'Strand.Target.Name'
                },
                {
                    name: 'AmountRequested',
                    displayName: 'Amount Requested (mg)',
                    field: 'AmountRequested',
                    cellTemplate: "AmountRequestedInput"
                }
            ],
            onRegisterApi: function(gridApi) {
                createMaterialRequest.gridApi = gridApi;
                gridApi.selection.on.rowSelectionChanged(null,
                    function(row) {
                        if (row.isSelected) {
                            createMaterialRequest.selectedAntisenseStrand = row.entity;
                        } else {
                            createMaterialRequest.selectedAntisenseStrand = null;
                        }
                    });
            }
        };

        //selected objects in grid to delete
        createMaterialRequest.selectedAntisenseDuplexes = null;

        createMaterialRequest.selectedSenseDuplexes = {
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            enableColumnMenus: false,
            enableHorizontalScrollbar: 2,
            multiSelect: false,
            columnDefs: [
                {
                    name: 'ArrowheadDuplexId',
                    displayName: 'Duplex ID',
                    field: 'Duplex.ArrowheadDuplexId'
                },
                {
                    name: 'Target',
                    displayName: 'Target',
                    field: 'Duplex.Target.Name'
                },
                {
                    name: 'AmountRequested',
                    displayName: 'Amount Requested (mg)',
                    field: 'AmountRequested',
                    cellTemplate: "AmountRequestedInput"
                }
            ],
            onRegisterApi: function(gridApi) {
                createMaterialRequest.gridApi = gridApi;
                gridApi.selection.on.rowSelectionChanged(null,
                    function(row) {
                        if (row.isSelected) {
                            createMaterialRequest.selectedAntisenseDuplexes = row.entity;
                        } else {
                            createMaterialRequest.selectedAntisenseDuplexes = null;
                        }
                    });
            }
        };
 
        function loadMaterialRequest(createMaterialRequestId) {

            if (isNaN(createMaterialRequestId))
                return false;

            loadAllStatus();

            disableSubmit();
            disableCancel();

            MaterialRequestService.get(createMaterialRequestId)
                .then(function (data) {
               
                    onLoadCompleted(data);
                }, function (e) {

                    enableCancel();
                    createMaterialRequest.submitMessage = "Error: !" + e;
                });
        }

        function onLoadCompleted(data) {

            createMaterialRequest.formData.Id = data.Id;
            createMaterialRequest.formData.RequestDate = new Date( data.RequestDate);
            createMaterialRequest.formData.NeedByDate = new Date(data.NeedByDate);
            createMaterialRequest.formData.Status = data.Status;
            createMaterialRequest.formData.Notes = data.Notes;

            createMaterialRequest.selectedSenseDuplexes.data = data.RequestedDuplexes;
            createMaterialRequest.selectedSenseStrands.data = data.RequestedStrands;

            validateCanSubmit();
            enableCancel();
        }

        function loadAllStatus() {

            MaterialRequestService.getAllStatus()
             .then(function (data) {
                 createMaterialRequest.StatusList = data;
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
                                        name: 'ArrowheadStrandID',
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
            var modalInstance = angular.bind(this,
                $uibModal.open(settings));
            modalInstance.result.then(angular.bind(this, function (result) {
                if (result !== 'cancel')
                {
                    //if there are selected records
                    if (result != null && result.length > 0) {
                        //createMaterialRequest.selectedSenseStrands.data = result;
                        var requestedStrands = result.map(function(strand) {
                            return { Strand: strand, AmountRequested: null }
                        });
                        AddRange(createMaterialRequest.selectedSenseStrands.data, requestedStrands);
                    }
                    validateCanSubmit();
                };
            }), function () { });
        }

        function addItemasDuplexes(gridName) {
            var settings = {
                templateUrl: '/Scripts/angular-app/widgets/selectModalTemplate.html',
                controller: 'SelectModalCtrl',
                size: 'lg',
                controllerAs: "vm",
                resolve: {
                    selectModalConfig: function () {
                        return {
                            gridOptions: {
                                multiSelect: true,
                                columnDefs: [
                                    {
                                        name: 'ArrowheadDuplexId',
                                        displayName: 'Duplex ID',
                                        field: 'ArrowheadDuplexId'
                                    },
                                    {
                                        name: 'Target.Name',
                                        displayName: 'Target',
                                        field: 'Target.Name'
                                    }
                                ]
                            },
                            prompt: 'Select Duplexes'
                        }
                    },
                    searchResource: function () {
                        return {
                            getData: function (query) {
                                return duplexResource.get(query).$promise;
                            }
                        }

                    }
                }
            };
            var modalInstance = angular.bind(this, $uibModal.open(settings));
            modalInstance.result.then(angular.bind(this, function (result) {
                if (result !== 'cancel') {
                    //if there are selected records
                    if (result != null && result.length > 0) {
                        var requestedDuplexes = result.map(function (duplex) {
                            return { Duplex: duplex, AmountRequested: null }
                        });
                        AddRange(createMaterialRequest.selectedSenseDuplexes.data, requestedDuplexes);
                    }
                    validateCanSubmit();
                };
            }), function () { });
        }

        function removeSelectedAntisenseStrand() {
            if (createMaterialRequest.selectedAntisenseStrand != null) {
                FindAndRemove(createMaterialRequest.selectedSenseStrands.data, createMaterialRequest.selectedAntisenseStrand);
                createMaterialRequest.selectedAntisenseStrand = null;
            }
            validateCanSubmit();
        }

        function removeSelectedAntisenseDuplexes(){
            if (createMaterialRequest.selectedAntisenseDuplexes != null) {
                FindAndRemove(createMaterialRequest.selectedSenseDuplexes.data, createMaterialRequest.selectedAntisenseDuplexes);
                createMaterialRequest.selectedAntisenseDuplexes = null;
            }
            validateCanSubmit();
        }

        function save() {
            //disable the save button to avoid multiple submit
            disableSubmit();
            disableCancel();

            if (createMaterialRequest.formData.Id == null ) {
                createMaterialRequest.formData.RequestedDuplexes = createMaterialRequest.selectedSenseDuplexes.data
                    .map(function(requestedDuplex) {
                        return {
                            DuplexId: requestedDuplex.Duplex.Id,
                            AmountRequested: requestedDuplex.AmountRequested
                        }
                    });
                createMaterialRequest.formData.RequestedStrands = createMaterialRequest.selectedSenseStrands.data
                    .map(function(requestedStrand) {
                        return {
                            StrandId: requestedStrand.Strand.Id,
                            AmountRequested: requestedStrand.AmountRequested
                        }
                    });

                MaterialRequestService.post(createMaterialRequest.formData)
                    .then(function (data) {
                        if (!data.HasErrors) {
                            onSaveCompleted(data);
                        }
                        else {
                            enableCancel();
                            enableSubmit();

                            var error = "";
                            angular.forEach(data.Errors, function (value, prop, obj) {
                                error += prop + " " + value;
                            });
                            createMaterialRequest.submitMessage = "Error: !" + error;
                        }
                    },
                    function (e) {
                        enableCancel();
                        enableSubmit();
                        editCreateSynthesisRequest.submitMessage = "Error: !" + e;
                    });

            } else {
                createMaterialRequest.formData.RequestedDuplexes = createMaterialRequest.selectedSenseDuplexes.data
                    .map(function(requestedDuplex) {
                        return {
                            DuplexId: requestedDuplex.Duplex.Id,
                            AmountRequested: requestedDuplex.AmountRequested
                        }
                    });
                createMaterialRequest.formData.RequestedStrands = createMaterialRequest.selectedSenseStrands.data
                    .map(function(requestedStrand) {
                        return {
                            StrandId: requestedStrand.Strand.Id,
                            AmountRequested: requestedStrand.AmountRequested
                        }
                    });

                MaterialRequestService.put(createMaterialRequest.formData)
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

                            createMaterialRequest.submitMessage = "Error: !" + error;
                        }

                    }, function (e) {
                        enableCancel();
                        enableSubmit();

                        createMaterialRequest.submitMessage = "Error: !" + e;
                    });

            }
        }

        function onSaveCompleted( data ) {
            createMaterialRequest.formData.Id = data.Id;

            //redirect to details
            window.location.pathname = '/MaterialRequest/Details/' + createMaterialRequest.formData.Id;

            //enableCancel();
            //enableSubmit();
            //createMaterialRequest.submitMessage = "Material Request saved successfully with ID: " + data.MaterialRequestID;
        }

        function onUpdateCompleted(data) {
            
            window.location.pathname = '/MaterialRequest/Details/' + createMaterialRequest.formData.Id;

            //enableCancel();
            //enableSubmit();
            //createMaterialRequest.submitMessage = "Material Request Updated successfully with ID: " + data.MaterialRequestID;
        }

        function cancelChanges() {
            if (createMaterialRequest.formData.Id == null) {
                window.location.pathname = '/MaterialRequest';
            } else {
                window.location.pathname = '/MaterialRequest/Details/' + createMaterialRequest.formData.Id;
            }
        }

        function validateCanSubmit() {
            if (createMaterialRequest.selectedSenseStrands.data.length == 0 &&
                createMaterialRequest.selectedSenseDuplexes.data.length == 0) {
                createMaterialRequest.canSubmit = false;
            } else {
                createMaterialRequest.canSubmit = true;
            }
        }

        function enableSubmit() {
            createMaterialRequest.canSubmit = true;
        }

        function disableSubmit() {
            createMaterialRequest.canSubmit = false;
        }

        function enableCancel() {
            createMaterialRequest.canReset = true;
        }

        function disableCancel() {
            createMaterialRequest.canReset = false;
        }

        loadMaterialRequest(LastUrlParam($location.absUrl()));

        createMaterialRequest.addItems = addItems;
        createMaterialRequest.addItemasDuplexes = addItemasDuplexes;
        createMaterialRequest.save = save;
        createMaterialRequest.cancelChanges = cancelChanges;
        createMaterialRequest.removeSelectedAntisenseStrand = removeSelectedAntisenseStrand;
        createMaterialRequest.removeSelectedAntisenseDuplexes = removeSelectedAntisenseDuplexes;
    }
})();