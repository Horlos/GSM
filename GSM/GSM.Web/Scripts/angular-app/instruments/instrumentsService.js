var App;
(function (App) {
    var Instruments;
    (function (Instruments) {
        var Services;
        (function (Services) {
            var InstrumentsService = (function () {
                function InstrumentsService($http, logger) {
                    this.$http = $http;
                    this.logger = logger;
                }
                InstrumentsService.prototype.getInstruments = function (paginationOptions, sortOptions, searchOptions) {
                    var _this = this;
                    var url = '/api/instruments';
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
                InstrumentsService.prototype.getInstrumentById = function (instrumentId) {
                    var _this = this;
                    var url = "/api/instruments/" + instrumentId;
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
                InstrumentsService.prototype.createInstrument = function (instrument) {
                    var _this = this;
                    var url = '/api/instruments';
                    var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                    return dataSource.post(instrument)
                        .then(function (response) {
                        return response.data;
                    })
                        .catch(function (error) {
                        var exception = new App.Common.Logger.Exception(error);
                        _this.logger.error(exception);
                    });
                };
                InstrumentsService.prototype.updateInstrument = function (instrumentId, instrument) {
                    var _this = this;
                    var url = "/api/instruments/" + instrumentId;
                    var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                    return dataSource.post(instrument)
                        .then(function (response) {
                        return response.data;
                    })
                        .catch(function (error) {
                        var exception = new App.Common.Logger.Exception(error);
                        _this.logger.error(exception);
                    });
                };
                InstrumentsService.prototype.deleteInstrument = function (instrumentId) {
                    var _this = this;
                    var url = "/api/instruments/" + instrumentId;
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
                InstrumentsService.$inject = ['$http', 'logger'];
                return InstrumentsService;
            }());
            App.getAppContainer()
                .getSection('app.instruments')
                .getInstance()
                .service('instrumentsService', InstrumentsService);
        })(Services = Instruments.Services || (Instruments.Services = {}));
    })(Instruments = App.Instruments || (App.Instruments = {}));
})(App || (App = {}));
//# sourceMappingURL=instrumentsService.js.map