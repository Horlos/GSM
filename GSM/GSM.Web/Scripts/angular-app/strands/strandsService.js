var App;
(function (App) {
    var Strands;
    (function (Strands) {
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
                StrandsService.prototype.getStrandBatches = function (strandId, query) {
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
                StrandsService.prototype.getStrandBatch = function (strandId, strandBatchId) {
                    var _this = this;
                    var url = "/api/strands/batches/" + strandBatchId;
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
                StrandsService.prototype.createStrandBatch = function (strandId, strandBatch) {
                    var _this = this;
                    var url = "/api/strands/" + strandId + "/batches";
                    var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                    return dataSource.post(strandBatch)
                        .then(function (response) {
                        var result = response.data;
                        return result;
                    })
                        .catch(function (error) {
                        var exception = new App.Common.Logger.Exception(error);
                        _this.logger.error(exception);
                    });
                };
                StrandsService.prototype.updateStrandBatch = function (strandId, strandBatchId, strandBatch) {
                    var _this = this;
                    var url = "/api/strands/" + strandId + "/batches/" + strandBatchId;
                    var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                    return dataSource.post(strandBatch)
                        .then(function (response) {
                        var result = response.data;
                        return result;
                    })
                        .catch(function (error) {
                        var exception = new App.Common.Logger.Exception(error);
                        _this.logger.error(exception);
                    });
                };
                StrandsService.prototype.combineStrandBatches = function (strandId, strandBatch, combinedBatches) {
                    var _this = this;
                    var url = "/api/strands/" + strandId + "/batches/combine";
                    var model = {
                        strandBatch: strandBatch,
                        combinedBatches: combinedBatches
                    };
                    var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                    return dataSource.post(model)
                        .then(function (response) {
                        return response.data;
                    })
                        .catch(function (error) {
                        var exception = new App.Common.Logger.Exception(error);
                        _this.logger.error(exception);
                    });
                };
                StrandsService.prototype.splitStrandBatch = function (strandId, strandBatchId, splittedBatches) {
                    var _this = this;
                    var url = "/api/strands/" + strandId + "/batches/" + strandBatchId + "/split";
                    var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                    return dataSource.post(splittedBatches)
                        .then(function (response) {
                        return response.data;
                    })
                        .catch(function (error) {
                        var exception = new App.Common.Logger.Exception(error);
                        _this.logger.error(exception);
                    });
                };
                StrandsService.prototype.createStrand = function (strand) {
                    var _this = this;
                    var url = "/api/strands";
                    var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                    return dataSource.post(strand)
                        .then(function (response) {
                        var result = response.data;
                        return result;
                    })
                        .catch(function (error) {
                        var exception = new App.Common.Logger.Exception(error);
                        _this.logger.error(exception);
                    });
                };
                StrandsService.prototype.getStrandSpecies = function (strandId) {
                    var _this = this;
                    var url = "/api/strands/" + strandId + "/species";
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
                StrandsService.prototype.createStrands = function (strands) {
                    var _this = this;
                    var url = "/api/strands/multiple";
                    var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                    return dataSource.post(strands)
                        .then(function (response) {
                        var result = response.data;
                        return result;
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
                .getSection('app.strands')
                .getInstance()
                .service('strandsService', StrandsService);
        })(Services = Strands.Services || (Strands.Services = {}));
    })(Strands = App.Strands || (App.Strands = {}));
})(App || (App = {}));
//# sourceMappingURL=strandsService.js.map