var App;
(function (App) {
    var Duplexes;
    (function (Duplexes) {
        var Services;
        (function (Services) {
            var DuplexesService = (function () {
                function DuplexesService($http, logger) {
                    this.$http = $http;
                    this.logger = logger;
                }
                DuplexesService.prototype.getDuplexBatches = function (paginationOptions, sortOptions, searchOptions) {
                    var _this = this;
                    var url = "/api/duplexes/batches/denormalized";
                    var query = {
                        filterText: searchOptions.filterText,
                        pageNo: paginationOptions.pageNumber,
                        pageSize: paginationOptions.pageSize,
                        sortBy: sortOptions.sortBy,
                        sortOrder: sortOptions.sortOrder
                    };
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
                DuplexesService.prototype.createDuplexBatch = function (duplexId, duplexBatch) {
                    var _this = this;
                    var url = "/api/duplexes/" + duplexId + "/batches";
                    var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                    return dataSource.post(duplexBatch)
                        .then(function (response) {
                        return response.data;
                    })
                        .catch(function (error) {
                        var exception = new App.Common.Logger.Exception(error);
                        _this.logger.error(exception);
                    });
                };
                DuplexesService.prototype.updateDuplexBatch = function (duplexId, duplexBatchId, duplexBatch) {
                    var _this = this;
                    var url = "/api/duplexes/" + duplexId + "/batches/" + duplexBatchId;
                    var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                    return dataSource.post(duplexBatch)
                        .then(function (response) {
                        return response.data;
                    })
                        .catch(function (error) {
                        var exception = new App.Common.Logger.Exception(error);
                        _this.logger.error(exception);
                    });
                };
                DuplexesService.prototype.getDuplexes = function (query) {
                    var _this = this;
                    var url = "/api/duplexes";
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
                DuplexesService.prototype.getStrandBatches = function (strandId, query) {
                    var _this = this;
                    var url = "/api/strands/" + strandId + "/batches";
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
                DuplexesService.prototype.getDuplexBatch = function (duplexId, duplexBatchId) {
                    var _this = this;
                    var url = "/api/duplexes/batches/" + duplexBatchId;
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
                DuplexesService.prototype.createDuplexes = function (duplexes) {
                    var _this = this;
                    var url = "/api/duplexes/multiple";
                    var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                    return dataSource.post(duplexes)
                        .then(function (response) {
                        return response.data;
                    })
                        .catch(function (error) {
                        var exception = new App.Common.Logger.Exception(error);
                        _this.logger.error(exception);
                    });
                };
                DuplexesService.prototype.getStrands = function (orientation, targetId, query) {
                    var _this = this;
                    var url = "/api/strands/" + orientation + "/" + targetId;
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
                DuplexesService.prototype.getTargets = function () {
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
                DuplexesService.$inject = ['$http', 'logger'];
                return DuplexesService;
            }());
            App.getAppContainer()
                .getSection('app.duplexes')
                .getInstance()
                .service('duplexesService', DuplexesService);
        })(Services = Duplexes.Services || (Duplexes.Services = {}));
    })(Duplexes = App.Duplexes || (App.Duplexes = {}));
})(App || (App = {}));
//# sourceMappingURL=duplexesService.js.map