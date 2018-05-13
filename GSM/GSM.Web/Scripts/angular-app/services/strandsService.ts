namespace App.Services {
    export interface IStrandsService {
        getStrands(query: any): ng.IPromise<any>;
    }

    class StrandsService {
        static $inject = ['$http', 'logger'];
        constructor(private $http, private logger: App.Common.Logger.ILogger) {

        }

        getStrands(query: any): angular.IPromise<any> {
            let url = "/api/strands";
            var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.get({ params: query })
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
        .service('strandsService', StrandsService);
}