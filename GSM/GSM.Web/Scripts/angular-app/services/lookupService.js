var App;
(function (App) {
    var Services;
    (function (Services) {
        var LookupService = (function () {
            function LookupService($http, logger) {
                this.$http = $http;
                this.logger = logger;
            }
            LookupService.prototype.get = function () {
                var _this = this;
                var url = "/api/lookup";
                var data = { table: ['Targets', 'Orientations', 'SpeciesList', 'ModStructures'] };
                var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                return dataSource.get({ params: data })
                    .then(function (response) {
                    return response.data;
                })
                    .catch(function (error) {
                    var exception = new App.Common.Logger.Exception(error);
                    _this.logger.error(exception);
                });
            };
            LookupService.prototype.getTable = function (tableName) {
                var _this = this;
                var url = "/api/lookup";
                var data = { table: [tableName] };
                var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                return dataSource.get({ params: data })
                    .then(function (response) {
                    return response.data;
                })
                    .catch(function (error) {
                    var exception = new App.Common.Logger.Exception(error);
                    _this.logger.error(exception);
                });
            };
            LookupService.$inject = ['$http', 'logger'];
            return LookupService;
        }());
        App.getAppContainer()
            .getSection('app.services')
            .getInstance()
            .service('lookupService', LookupService);
    })(Services = App.Services || (App.Services = {}));
})(App || (App = {}));
//# sourceMappingURL=lookupService.js.map