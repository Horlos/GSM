(function () {

    angular.module('materialRequestApp')
        .controller('DetailMaterialRequestCtrl', DetailMaterialRequestCtrl);

    DetailMaterialRequestCtrl.$inject = [
        '$scope',
        '$location',
        '$routeParams',
        '$uibModal',
        'strandResource',
        'duplexResource',
        'MaterialRequestService'
    ];

    function DetailMaterialRequestCtrl($scope, $location, $routeParams, $uibModal, strandResource, duplexResource, MaterialRequestService) {

        var detailsMaterialRequest = this;

        detailsMaterialRequest.submitMessage = "";
        detailsMaterialRequest.canEdit = false;
        detailsMaterialRequest.formData = {
            Id: null,
            RequestDate: new Date(),
            NeedByDate: null,
        };

        //selected objects grid
        detailsMaterialRequest.selectedSenseStrands = {
            enableRowSelection: false,
            enableRowHeaderSelection: false,
            enableColumnMenus: false,
            enableHorizontalScrollbar: 0,
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
                    field: 'AmountRequested'
                }
            ]
        };

        //selected objects in grid to delete
        detailsMaterialRequest.selectedAntisenseDuplexes = null;

        detailsMaterialRequest.selectedSenseDuplexes = {
            enableRowSelection: false,
            enableRowHeaderSelection: false,
            enableColumnMenus: false,
            enableHorizontalScrollbar: 0,
            enableOrder: false,
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
                    field: 'AmountRequested'
                }
            ]
        };

        function loadMaterialRequest(detailsMaterialRequestId) {

            if (isNaN(detailsMaterialRequestId))
                return false;

            MaterialRequestService.get(detailsMaterialRequestId)
                .then(function (data) {

                    onLoadCompleted(data);
                }, function (e) {

                    detailsMaterialRequest.submitMessage = "Error: !" + e;
                });
        }

        function onLoadCompleted(data) {

            detailsMaterialRequest.formData.Id = data.Id;
            detailsMaterialRequest.formData.RequestDate = new moment(new Date(data.RequestDate)).format('MM/DD/YYYY'); // new Date( data.RequestDate);
            detailsMaterialRequest.formData.NeedByDate = new moment(new Date(data.NeedByDate)).format('MM/DD/YYYY'); //new Date(data.NeedByDate);
            detailsMaterialRequest.formData.Status = data.Status;
            detailsMaterialRequest.formData.Notes = data.Notes;
            detailsMaterialRequest.selectedSenseDuplexes.data = data.RequestedDuplexes;
            detailsMaterialRequest.selectedSenseStrands.data = data.RequestedStrands;

            detailsMaterialRequest.canEdit = true;
        }

        function editRequest() {
            window.location.pathname = '/MaterialRequest/Edit/' + detailsMaterialRequest.formData.Id;
        }

        function deleteRequest() {
            if (detailsMaterialRequest.formData.Id != null) {

                if (!confirm("Are you sure you want to delete this Material Request?."))
                    return false;

                MaterialRequestService.delete(detailsMaterialRequest.formData.Id)
                    .then(function (data) {
                        window.location.pathname = '/MaterialRequest';
                    }, function (e) {

                        detailsMaterialRequest.submitMessage = "Error: !" + e;
                    });

            }
        }

        function cancelChanges() {
            window.location.pathname = '/MaterialRequest';
        }

        loadMaterialRequest(LastUrlParam($location.absUrl()));
        detailsMaterialRequest.editRequest = editRequest;
        detailsMaterialRequest.cancelChanges = cancelChanges;
        detailsMaterialRequest.deleteRequest = deleteRequest;
    }
})();