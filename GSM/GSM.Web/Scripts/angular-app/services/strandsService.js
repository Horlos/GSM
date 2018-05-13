var App;
(function (App) {
    var Services;
    (function (Services) {
        var StrandsService = (function () {
            function StrandsService($http, logger) {
                this.$http = $http;
                this.logger = logger;
            }
            StrandsService.prototype.getStrands = function (query) {
                var _this = this;
                var url = "/api/strands";
                var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                return dataSource.get({ params: query })
                    .then(function (response) {
                    return response.data;
                })
                    .catch(function (error) {
                    var exception = new App.Common.Logger.Exception(error);
                    _this.logger.error(exception);
                });
            };
            StrandsService.$inject = ['$http', 'logger'];
            return StrandsService;
        }());
        App.getAppContainer()
            .getSection('app.services')
            .getInstance()
            .service('strandsService', StrandsService);
    })(Services = App.Services || (App.Services = {}));
})(App || (App = {}));
//# sourceMappingURL=strandsService.js.map