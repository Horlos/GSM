(function () {

    angular.module('triggerServiceDBApp')
        .factory('SynthesisRequestService', SynthesisRequestService);

    SynthesisRequestService.$inject = ['$resource', '$http', '$q', 'FileSaver', 'Blob'];

    function SynthesisRequestService($resource, $http, $q, FileSaver, Blob) {

        var restServiceUrl = '/api/synthesisrequests/';
        var restStatusServiceUrl = '/api/status/';

        return {

            exportFile: function () {
                //console.log("exportService");
                var text = "some data here...";
                var data = new Blob([text], { type: 'text/plain;charset=utf-8' });
                FileSaver.saveAs(data, 'text.txt');
            },
            getAll: function ( synthesisRequestParams) {

                var deferred = $q.defer();

                $http({
                    url: restServiceUrl + 'denormalized',
                    method: "GET",
                    params: synthesisRequestParams
                })
                 .success(function (data) {
                     deferred.resolve(data);
                 }).error(function (data) {
                     deferred.reject('There was an error.');
                 });

                return deferred.promise;
            },
             getAllStatus: function () {

                var deferred = $q.defer();

                $http.get(restStatusServiceUrl)
                 .success(function (data) {
                     deferred.resolve(data);
                 }).error(function (data) {
                     deferred.reject('There was an error.');
                 });

                return deferred.promise;
            },
            get: function( synthesisRequestID )
            {
                var deferred = $q.defer();

                $http.get(restServiceUrl + synthesisRequestID)
                 .success(function (data) {
                     deferred.resolve(data);
                 }).error(function (data) {
                     deferred.reject('There was an error.');
                 });

                return deferred.promise;
            },
            post: function (synthesisRequestData)
            {
                var deferred = $q.defer();

                $http.post(restServiceUrl, synthesisRequestData)
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (data) {
                    deferred.reject('There was an error.');
                });

                return deferred.promise;
            },
            put: function (synthesisRequestData)
            {
                var deferred = $q.defer();

                $http.put(restServiceUrl + synthesisRequestData.Id, synthesisRequestData)
                 .success(function (data) {
                     deferred.resolve(data);
                 }).error(function (data) {
                     deferred.reject('There was an error.');
                 });

                return deferred.promise;
            },
            delete: function (synthesisRequestData) {
                var deferred = $q.defer();

                $http.delete(restServiceUrl + synthesisRequestData)
                 .success(function (data) {
                     deferred.resolve(data);
                 }).error(function (data) {
                     deferred.reject('There was an error.');
                 });

                return deferred.promise;
            }
        }
    };

})();