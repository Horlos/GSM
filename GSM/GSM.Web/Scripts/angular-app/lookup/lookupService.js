var App;
(function (App) {
    var Lookup;
    (function (Lookup) {
        var Services;
        (function (Services) {
            var LookupService = (function () {
                function LookupService($http, logger) {
                    this.$http = $http;
                    this.logger = logger;
                }
                LookupService.prototype.getData = function (url, paginationOptions, sortOptions, searchOptions) {
                    var _this = this;
                    var data = {
                        filterText: searchOptions.filterText,
                        pageNo: paginationOptions.pageNumber,
                        pageSize: paginationOptions.pageSize,
                        sortBy: sortOptions.sortBy,
                        sortOrder: sortOptions.sortOrder
                    };
                    var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                    return dataSource.get({ params: data })
                        .then(function (response) {
                        var result = response.data;
                        return result;
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
                .getSection('app.lookup')
                .getInstance()
                .service('lookupService', LookupService);
        })(Services = Lookup.Services || (Lookup.Services = {}));
    })(Lookup = App.Lookup || (App.Lookup = {}));
})(App || (App = {}));
//# sourceMappingURL=lookupService.js.map