var App;
(function (App) {
    var Services;
    (function (Services) {
        var UserSettingsService = (function () {
            function UserSettingsService($http, logger) {
                this.$http = $http;
                this.logger = logger;
            }
            UserSettingsService.prototype.getSettings = function () {
                var _this = this;
                var url = "/api/usersettings";
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
            UserSettingsService.prototype.getSettingsByKey = function (key) {
                var _this = this;
                var url = "/api/usersettings/" + key;
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
            UserSettingsService.prototype.saveSettings = function (key, newColumnDisplayOrder) {
                var _this = this;
                var url = "/api/usersettings/" + key;
                var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                return dataSource.post(newColumnDisplayOrder)
                    .then(function (response) {
                    return response.data;
                })
                    .catch(function (error) {
                    var exception = new App.Common.Logger.Exception(error);
                    _this.logger.error(exception);
                });
            };
            UserSettingsService.$inject = ['$http', 'logger'];
            return UserSettingsService;
        }());
        App.getAppContainer()
            .getSection('app.services')
            .getInstance()
            .service('userSettingsService', UserSettingsService);
    })(Services = App.Services || (App.Services = {}));
})(App || (App = {}));
//# sourceMappingURL=userSettingsService.js.map