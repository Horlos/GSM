namespace App.Services {
    export interface IUserSettingsService {
        getSettings(): ng.IPromise<any>;
        getSettingsByKey(key: string): ng.IPromise<any>;
        saveSettings(key: string, newColumnDisplayOrder: any): ng.IPromise<any>;
    }

    class UserSettingsService implements IUserSettingsService {
        static $inject = ['$http', 'logger'];
        constructor(private $http: ng.IHttpService, private logger: App.Common.Logger.ILogger) {
            
        }

        getSettings(): angular.IPromise<any> {
            let url = "/api/usersettings";
            var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.get()
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }

        getSettingsByKey(key: string): angular.IPromise<any> {
            let url = `/api/usersettings/${key}`;
            var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.get()
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }

        saveSettings(key: string, newColumnDisplayOrder: any): angular.IPromise<any> {
            let url = `/api/usersettings/${key}`;
            var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.post(newColumnDisplayOrder)
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
        .getSection('app.services')
        .getInstance()
        .service('userSettingsService', UserSettingsService);
}