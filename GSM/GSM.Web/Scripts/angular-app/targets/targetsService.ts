namespace App.Targets.Services {

    export interface ITargetsService {
        getTargets(paginationOptions: App.Common.IPaginationOptions,
            sortOptions: App.Common.ISortOptions,
            searchOptions: App.Common.ISearchOptions): ng.IPromise<any>;

        getTargetById(targetId: number): ng.IPromise<any>;
        createTarget(target): ng.IPromise<any>;
        updateTarget(targetId: number, target): ng.IPromise<any>;
        deleteTarget(targetId: number): ng.IPromise<any>;
    }

    class TargetsService implements ITargetsService {

        static $inject = ['$http', 'logger'];
        constructor(private $http: ng.IHttpService,
            private logger: App.Common.Logger.ILogger) {
        }

        getTargets(paginationOptions: App.Common.IPaginationOptions,
            sortOptions: App.Common.ISortOptions,
            searchOptions: App.Common.ISearchOptions): ng.IPromise<any> {
            let url = '/api/targets';
            let dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            let data = {
                filterText: searchOptions.filterText,
                pageNo: paginationOptions.pageNumber,
                pageSize: paginationOptions.pageSize,
                sortBy: sortOptions.sortBy,
                sortOrder: sortOptions.sortOrder
            };
            return dataSource.get({ params: data })
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }

        getTargetById(targetId: number): ng.IPromise<any> {
            let url = `/api/targets/${targetId}`;
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

        createTarget(target): angular.IPromise<any> {
            let url = '/api/targets';
            let dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.post(target)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }

        updateTarget(targetId, target): ng.IPromise<any> {
            let url = `/api/targets/${targetId}`;
            let dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.post(target)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }

        deleteTarget(targetId: number): angular.IPromise<any> {
            let url = `/api/targets/${targetId}`;
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
    }

    App.getAppContainer()
        .getSection('app.targets')
        .getInstance()
        .service('targetsService', TargetsService);
}