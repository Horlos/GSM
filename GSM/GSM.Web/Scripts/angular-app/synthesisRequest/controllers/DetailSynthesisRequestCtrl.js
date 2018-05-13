(function(){
    
    angular.module('synthesisRequestApp')
        .controller('DetailSynthesisRequestCtrl', DetailSynthesisRequestCtrl);
        
    DetailSynthesisRequestCtrl.$inject = [
        '$scope',
        '$location',
        '$routeParams',
        '$uibModal',
        'strandResource',
        'materialRequestResource',
        'SynthesisRequestService'
    ];

    function DetailSynthesisRequestCtrl($scope, $location, $routeParams, $uibModal, strandResource, materialRequestResource, SynthesisRequestService) {

        var detailsSynthesisRequest = this;

        detailsSynthesisRequest.submitMessage = "";
        detailsSynthesisRequest.canEdit = false;


        detailsSynthesisRequest.formData = {
           
        };

        //selected objects grid
        detailsSynthesisRequest.selectedSenseStrands = {
            enableRowSelection: false,
            enableRowHeaderSelection: false,
            enableColumnMenus: false,
            enableHorizontalScrollbar: true,
            multiSelect: false,
            columnDefs: [
                { name: 'ArrowheadStrandId', displayName: 'Strand ID', field: 'Strand.ArrowheadStrandId' },
                { name: 'Scale', displayName: 'Scale' },
                { name: 'ScaleUnit', displayName: 'Unit' }
            ]
        };

        detailsSynthesisRequest.selectedMaterialRequest = {
            enableRowSelection: false,
            enableRowHeaderSelection: false,
            enableColumnMenus: false,
            enableHorizontalScrollbar: true,
            multiSelect: false,
            columnDefs: [
                { name: 'Id', displayName: 'Material Request ID' },
                { name: 'RequestDate', displayName: 'Date', cellFilter: 'date:"MM-dd-yyyy\"', type: 'date' }
            ]
        };
    
        function loadSynthesisRequest(detailsSynthesisRequestId) {

            if (isNaN(detailsSynthesisRequestId))
                return false;

            SynthesisRequestService.get(detailsSynthesisRequestId)
                .then(function (data) {
                    onLoadCompleted(data);
                }, function (e) {
                     
                    detailsSynthesisRequest.submitMessage = "Error: !" + e;
                });
        }


        function onLoadCompleted(data) {

            detailsSynthesisRequest.formData = data;
            detailsSynthesisRequest.formData.RequestDate = new moment(new Date( data.RequestDate)).format('MM/DD/YYYY'); // new Date( data.RequestDate);
            detailsSynthesisRequest.formData.NeedByDate = new moment(new Date(data.NeedByDate)).format('MM/DD/YYYY'); //new Date(data.NeedByDate);
           
            detailsSynthesisRequest.selectedSenseStrands.data = data.SynthesisRequestStrands;
            detailsSynthesisRequest.selectedMaterialRequest.data = data.MaterialRequests;

            detailsSynthesisRequest.canEdit = true;
        }
  
        function editRequest() {
            window.location.pathname = '/SynthesisRequest/Edit/' + detailsSynthesisRequest.formData.Id;
        }

        function deleteRequest() {
            if (detailsSynthesisRequest.formData.Id != null ) {

                /*if (!confirm("Are you sure you want to delete this Synthesis Request?."))
                    return false;

                SynthesisRequestService.delete(detailsSynthesisRequest.formData.SynthesisRequestID)
                    .then(function (data) {
                        window.location.pathname = '/MaterialRequest';
                    }, function (e) {

                        detailsSynthesisRequest.submitMessage = "Error: !" + e;
                    });
                */
            }
        }

        function cancelChanges() {
            window.location.pathname = '/SynthesisRequest';
        }
         
        loadSynthesisRequest(LastUrlParam($location.absUrl()));
        detailsSynthesisRequest.editRequest = editRequest;
        detailsSynthesisRequest.cancelChanges = cancelChanges;
        detailsSynthesisRequest.deleteRequest = deleteRequest;


    }

})();