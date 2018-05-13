var App;
(function (App) {
    var Dashboard;
    (function (Dashboard) {
        var Services;
        (function (Services) {
            var DashboardService = (function () {
                function DashboardService($http, logger) {
                    this.$http = $http;
                    this.logger = logger;
                }
                DashboardService.prototype.getMaterialsRequests = function () {
                    var _this = this;
                    var url = '/api/materialrequestsbystatus';
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
                DashboardService.prototype.getSynthesisRequests = function () {
                    var _this = this;
                    var url = '/api/synthesisrequestsbystatus';
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
                DashboardService.$inject = ['$http', 'logger'];
                return DashboardService;
            }());
            App.getAppContainer()
                .getSection('app.dashboard')
                .getInstance()
                .service('dashboardService', DashboardService);
        })(Services = Dashboard.Services || (Dashboard.Services = {}));
    })(Dashboard = App.Dashboard || (App.Dashboard = {}));
})(App || (App = {}));
//# sourceMappingURL=dashboardService.js.map