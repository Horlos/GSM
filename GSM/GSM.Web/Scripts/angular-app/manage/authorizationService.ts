namespace App.Manage.Services {

    export interface IAuthorizationService {
        getAllRoles(): ng.IPromise<any>;
        getAllPermissions(): ng.IPromise<any>;
        getRoleUsers(roleId: number): ng.IPromise<any>;
        searchForUser(userName: string): ng.IPromise<any>;
        searchForRole(roleName: string): ng.IPromise<any>;
        addUser(user: any): ng.IPromise<any>;
        addRole(role: any): ng.IPromise<any>;
        updateRole(roleId: number, role: any): ng.IPromise<any>;
        removeRole(roleId: number): ng.IPromise<any>;
    }

    class AuthorizationService implements IAuthorizationService {
        static $inject = ['$http', 'logger'];
        constructor(private $http, private logger) {

        }

        getAllRoles(): angular.IPromise<any> {
            let url = '/api/authorization/roles/';
            let dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.get()
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }

        getAllPermissions(): angular.IPromise<any> {
            let url = '/api/authorization/permissions/';
            let dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.get()
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }

        getRoleUsers(roleId: number): angular.IPromise<any> {
            let url = `api/authorization/roles/${roleId}/users`;
            let dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.get()
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }

        searchForUser(userName: string): angular.IPromise<any> {
            let url = `/api/authorization/users/${userName}`;
            let dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.get()
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }

        addRole(role: any): angular.IPromise<any> {
            let url = '/api/authorization/roles/';
            let dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.post(role)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }

        removeRole(roleId: number): angular.IPromise<any> {
            let url = `/api/authorization/roles/${roleId}`;
            let dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.delete()
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }

        addUser(user: any): angular.IPromise<any> {
            let url = '/api/authorization/users/';
            let dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.post(user)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }

        updateRole(roleId: number, role): angular.IPromise<any> {
            let url = `/api/authorization/roles/${roleId}`;
            let dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.post(role)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }

        searchForRole(roleName: string): angular.IPromise<any> {
            let url = `/api/authorization/roles/${roleName}`;
            let dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.get()
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }
    }
    App.getAppContainer()
        .getSection('app.manage')
        .getInstance()
        .service('authorizationService', AuthorizationService);
}