var App;
(function (App) {
    var Manage;
    (function (Manage) {
        var Services;
        (function (Services) {
            var AuthorizationService = (function () {
                function AuthorizationService($http, logger) {
                    this.$http = $http;
                    this.logger = logger;
                }
                AuthorizationService.prototype.getAllRoles = function () {
                    var _this = this;
                    var url = '/api/authorization/roles/';
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
                AuthorizationService.prototype.getAllPermissions = function () {
                    var _this = this;
                    var url = '/api/authorization/permissions/';
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
                AuthorizationService.prototype.getRoleUsers = function (roleId) {
                    var _this = this;
                    var url = "api/authorization/roles/" + roleId + "/users";
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
                AuthorizationService.prototype.searchForUser = function (userName) {
                    var _this = this;
                    var url = "/api/authorization/users/" + userName;
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
                AuthorizationService.prototype.addRole = function (role) {
                    var _this = this;
                    var url = '/api/authorization/roles/';
                    var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                    return dataSource.post(role)
                        .then(function (response) {
                        return response.data;
                    })
                        .catch(function (error) {
                        var exception = new App.Common.Logger.Exception(error);
                        _this.logger.error(exception);
                    });
                };
                AuthorizationService.prototype.removeRole = function (roleId) {
                    var _this = this;
                    var url = "/api/authorization/roles/" + roleId;
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
                AuthorizationService.prototype.addUser = function (user) {
                    var _this = this;
                    var url = '/api/authorization/users/';
                    var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                    return dataSource.post(user)
                        .then(function (response) {
                        return response.data;
                    })
                        .catch(function (error) {
                        var exception = new App.Common.Logger.Exception(error);
                        _this.logger.error(exception);
                    });
                };
                AuthorizationService.prototype.updateRole = function (roleId, role) {
                    var _this = this;
                    var url = "/api/authorization/roles/" + roleId;
                    var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                    return dataSource.post(role)
                        .then(function (response) {
                        return response.data;
                    })
                        .catch(function (error) {
                        var exception = new App.Common.Logger.Exception(error);
                        _this.logger.error(exception);
                    });
                };
                AuthorizationService.prototype.searchForRole = function (roleName) {
                    var _this = this;
                    var url = "/api/authorization/roles/" + roleName;
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
                AuthorizationService.$inject = ['$http', 'logger'];
                return AuthorizationService;
            }());
            App.getAppContainer()
                .getSection('app.manage')
                .getInstance()
                .service('authorizationService', AuthorizationService);
        })(Services = Manage.Services || (Manage.Services = {}));
    })(Manage = App.Manage || (App.Manage = {}));
})(App || (App = {}));
//# sourceMappingURL=authorizationService.js.map