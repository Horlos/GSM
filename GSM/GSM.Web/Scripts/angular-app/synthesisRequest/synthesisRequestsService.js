var App;
(function (App) {
    var SynthesisRequests;
    (function (SynthesisRequests) {
        var SynthesisRequestsService = (function () {
            function SynthesisRequestsService($http, $q, logger, fileSaver, blob) {
                this.$http = $http;
                this.$q = $q;
                this.logger = logger;
                this.fileSaver = fileSaver;
                this.blob = blob;
            }
            SynthesisRequestsService.prototype.getAll = function (query) {
                var _this = this;
                var url = "/api/synthesisrequests";
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
            SynthesisRequestsService.prototype.getAllStatus = function () {
                var _this = this;
                var url = "/api/status";
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
            SynthesisRequestsService.prototype.getSynthesisRequest = function (synthesisRequestId) {
                var _this = this;
                var url = "/api/synthesisrequests/" + synthesisRequestId;
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
            SynthesisRequestsService.prototype.createSynthesisRequest = function (synthesisRequest) {
                var _this = this;
                var url = "/api/synthesisrequests";
                var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                return dataSource.post(synthesisRequest)
                    .then(function (response) {
                    return response.data;
                })
                    .catch(function (error) {
                    var exception = new App.Common.Logger.Exception(error);
                    _this.logger.error(exception);
                });
            };
            SynthesisRequestsService.prototype.updateSynthesisRequest = function (synthesisRequestId, synthesisRequest) {
                var _this = this;
                var url = "/api/synthesisrequests/" + synthesisRequestId;
                var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                return dataSource.put(synthesisRequest)
                    .then(function (response) {
                    return response.data;
                })
                    .catch(function (error) {
                    var exception = new App.Common.Logger.Exception(error);
                    _this.logger.error(exception);
                });
            };
            SynthesisRequestsService.prototype.deleteSynthesisRequest = function (synthesisRequestId) {
                var _this = this;
                var url = "/api/synthesisrequests/" + synthesisRequestId;
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
            SynthesisRequestsService.prototype.exportFile = function (strands, instrument) {
                var text = "some data here...";
                var data = new Blob([text], { type: 'text/plain;charset=utf-8' });
                this.fileSaver.saveAs(data, 'text.txt');
            };
            SynthesisRequestsService.$inject = ['$http', '$q', 'logger', 'FileSaver', 'Blob'];
            return SynthesisRequestsService;
        }());
        App.getAppContainer()
            .getSection('app.synthesisRequests')
            .getInstance()
            .service('synthesisRequestsService', SynthesisRequestsService);
    })(SynthesisRequests = App.SynthesisRequests || (App.SynthesisRequests = {}));
})(App || (App = {}));
//# sourceMappingURL=synthesisRequestsService.js.map