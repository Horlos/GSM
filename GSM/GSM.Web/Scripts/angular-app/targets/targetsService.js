var App;
(function (App) {
    var Targets;
    (function (Targets) {
        var Services;
        (function (Services) {
            var TargetsService = (function () {
                function TargetsService($http, logger) {
                    this.$http = $http;
                    this.logger = logger;
                }
                TargetsService.prototype.getTargets = function (paginationOptions, sortOptions, searchOptions) {
                    var _this = this;
                    var url = '/api/targets';
                    var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                    var data = {
                        filterText: searchOptions.filterText,
                        pageNo: paginationOptions.pageNumber,
                        pageSize: paginationOptions.pageSize,
                        sortBy: sortOptions.sortBy,
                        sortOrder: sortOptions.sortOrder
                    };
                    return dataSource.get({ params: data })
                        .then(function (response) {
                        return response.data;
                    })
                        .catch(function (error) {
                        var exception = new App.Common.Logger.Exception(error);
                        _this.logger.error(exception);
                    });
                };
                TargetsService.prototype.getTargetById = function (targetId) {
                    var _this = this;
                    var url = "/api/targets/" + targetId;
                    var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                    return dataSource.get()
                        .then(function (response) {
                        return response.data;
                    })
                        .catch(function (error) {
                        var exception = new App.Common.Logger.Exception(error);
                        _this.logger.error(exception);
                    });
                };
                TargetsService.prototype.createTarget = function (target) {
                    var _this = this;
                    var url = '/api/targets';
                    var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                    return dataSource.post(target)
                        .then(function (response) {
                        return response.data;
                    })
                        .catch(function (error) {
                        var exception = new App.Common.Logger.Exception(error);
                        _this.logger.error(exception);
                    });
                };
                TargetsService.prototype.updateTarget = function (targetId, target) {
                    var _this = this;
                    var url = "/api/targets/" + targetId;
                    var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                    return dataSource.post(target)
                        .then(function (response) {
                        return response.data;
                    })
                        .catch(function (error) {
                        var exception = new App.Common.Logger.Exception(error);
                        _this.logger.error(exception);
                    });
                };
                TargetsService.prototype.deleteTarget = function (targetId) {
                    var _this = this;
                    var url = "/api/targets/" + targetId;
                    var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                    return dataSource.delete()
                        .then(function (response) {
                        return response.data;
                    })
                        .catch(function (error) {
                        var exception = new App.Common.Logger.Exception(error);
                        _this.logger.error(exception);
                    });
                };
                TargetsService.$inject = ['$http', 'logger'];
                return TargetsService;
            }());
            App.getAppContainer()
                .getSection('app.targets')
                .getInstance()
                .service('targetsService', TargetsService);
        })(Services = Targets.Services || (Targets.Services = {}));
    })(Targets = App.Targets || (App.Targets = {}));
})(App || (App = {}));
//# sourceMappingURL=targetsService.js.map