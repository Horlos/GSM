namespace App.Duplexes.Services {

    export interface IDuplexesService {
        getDuplexBatches(paginationOptions: App.Common.IPaginationOptions, sortOptions: App.Common.ISortOptions, searchOptions: App.Common.ISearchOptions): ng.IPromise<any>;
        createDuplexBatch(duplexId: number, duplexBatch: any): ng.IPromise<any>;
        updateDuplexBatch(duplexId: number, duplexBatchId: number, duplexBatch: any): ng.IPromise<any>;
        getDuplexBatch(duplexId: number, duplexBatchId: number): ng.IPromise<any>;

        getDuplexes(query: any): ng.IPromise<any>;

        getStrands(orientation: string, targetId: number, query: any): ng.IPromise<any>;
        getStrandBatches(strandId: number, query: any): ng.IPromise<any>;
        createDuplexes(duplexes: Array<any>): ng.IPromise<any>;

        getTargets(): ng.IPromise<any>;
    }

    class DuplexesService implements IDuplexesService {
        static $inject = ['$http', 'logger'];
        constructor(private $http, private logger: App.Common.Logger.ILogger) {

        }

        getDuplexBatches(paginationOptions: App.Common.IPaginationOptions, sortOptions: App.Common.ISortOptions, searchOptions: App.Common.ISearchOptions): angular.IPromise<any> {
            let url = "/api/duplexes/batches/denormalized";
            let query = {
                filterText: searchOptions.filterText,
                pageNo: paginationOptions.pageNumber,
                pageSize: paginationOptions.pageSize,
                sortBy: sortOptions.sortBy,
                sortOrder: sortOptions.sortOrder
            };
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

        createDuplexBatch(duplexId: number, duplexBatch: any): angular.IPromise<any> {
            let url = `/api/duplexes/${duplexId}/batches`;
            var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.post(duplexBatch)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }

        updateDuplexBatch(duplexId, duplexBatchId, duplexBatch): angular.IPromise<any> {
            let url = `/api/duplexes/${duplexId}/batches/${duplexBatchId}`;
            var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.post(duplexBatch)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }

        getDuplexes(query: any): angular.IPromise<any> {
            let url = "/api/duplexes";
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

        getStrandBatches(strandId: number, query): angular.IPromise<any> {
            let url = `/api/strands/${strandId}/batches`;
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

        getDuplexBatch(duplexId: number, duplexBatchId: number): angular.IPromise<any> {
            let url = `/api/duplexes/batches/${duplexBatchId}`;
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

        createDuplexes(duplexes: any[]): angular.IPromise<any> {
            let url = `/api/duplexes/multiple`;
            var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.post(duplexes)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }

        getStrands(orientation: string, targetId: number, query): angular.IPromise<any> {
            let url = `/api/strands/${orientation}/${targetId}`;
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

        getTargets(): angular.IPromise<any> {
            let url = `/api/lookup`;
            let data = { table: ['Targets', 'Orientations', 'SpeciesList', 'ModStructures'] };
            var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.get({ params: data })
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
        .getSection('app.duplexes')
        .getInstance()
        .service('duplexesService', DuplexesService);
}