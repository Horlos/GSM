(function () {

    angular.module('triggerServiceDBApp')
        .factory('MaterialRequestService', MaterialRequestService)

    MaterialRequestService.$inject = ['$resource','$http', '$q'];

    function MaterialRequestService($resource, $http, $q) {

        var restServiceUrl = '/api/materialrequests/';
        var restStatusServiceUrl = '/api/status/';
        return {
            getAll: function (MaterialRequestParams) {

                var deferred = $q.defer();

                //$http({
                //    url: restServiceUrl,
                //    method: "GET",
                //    params: JSON.stringify(MaterialRequestParams)
                //})
                $http({
                    url: restServiceUrl + 'denormalized',
                    method: "GET",
                    //params: { listOptions: MaterialRequestParams }
                    params:  MaterialRequestParams
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
            get: function(materialRequestId)
            {
                var deferred = $q.defer();

                $http.get(restServiceUrl + materialRequestId)
                 .success(function (data) {
                     deferred.resolve(data);
                 }).error(function (data) {
                     deferred.reject('There was an error.');
                 });

                return deferred.promise;
            },
            post: function( materialRequestData )
            {
                var deferred = $q.defer();

                $http.post(restServiceUrl, materialRequestData)
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (data) {
                    deferred.reject('There was an error.');
                });

                return deferred.promise;
            },
            put: function (materialRequestData)
            {
                var deferred = $q.defer();

                $http.put(restServiceUrl + materialRequestData.Id, materialRequestData)
                 .success(function (data) {
                     deferred.resolve(data);
                 }).error(function (data) {
                     deferred.reject('There was an error.');
                 });

                return deferred.promise;
            },
            delete: function (materialRequestId) {
                var deferred = $q.defer();

                $http.delete(restServiceUrl + materialRequestId)
                 .success(function (data) {
                     deferred.resolve(data);
                 }).error(function (data) {
                     deferred.reject('There was an error.');
                 });

                return deferred.promise;
            },
        }
    };

})();