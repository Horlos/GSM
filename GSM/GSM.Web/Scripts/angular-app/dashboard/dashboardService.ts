namespace App.Dashboard.Services {

    export interface IDashboardService {
        getMaterialsRequests(): ng.IPromise<any>;
        getSynthesisRequests(): ng.IPromise<any>;
    }

    class DashboardService implements IDashboardService {
        static $inject = ['$http', 'logger'];
        constructor(
            private $http: ng.IHttpService,
            private logger: App.Common.Logger.ILogger) { 
        }

        getMaterialsRequests(): ng.IPromise<any> {
            let url = '/api/materialrequestsbystatus';
            let dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.get()
                .then((response: any): any => {
                    return response.data;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }

        getSynthesisRequests(): ng.IPromise<any> {
            let url = '/api/synthesisrequestsbystatus';
            let dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.get()
                .then((response: any): any => {
                    return response.data;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }
    }

    App.getAppContainer()
        .getSection('app.dashboard')
        .getInstance()
        .service('dashboardService', DashboardService);
}