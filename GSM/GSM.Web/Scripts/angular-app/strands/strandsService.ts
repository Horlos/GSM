namespace App.Strands.Services {
    export interface IStrandsService {
        getStrands(query: any): ng.IPromise<any>;
        createStrand(strand: any): ng.IPromise<any>;
        createStrands(strands: Array<any>): ng.IPromise<any>;
        getStrandSpecies(strandId: number): ng.IPromise<any>;

        getStrandBatch(strandId: number, strandBatchId: number): ng.IPromise<any>;
        getStrandBatches(strandId: number, query: any): ng.IPromise<any>;
        createStrandBatch(strandId: number, strandBatch: any): ng.IPromise<any>;
        updateStrandBatch(strandId: number, strandBatchId: number, strandBatch: any): ng.IPromise<any>;
        combineStrandBatches(strandId: number, strandBatch, combinedBatches: Array<number>): ng.IPromise<any>;
        splitStrandBatch(strandId: number, strandBatchId: number, splittedBatches: Array<any>): ng.IPromise<any>;
    }

    class StrandsService implements IStrandsService {
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

        getStrandBatches(strandId: number, query: any): angular.IPromise<any> {
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

        getStrandBatch(strandId: number, strandBatchId: number): angular.IPromise<any> {
            let url = `/api/strands/batches/${strandBatchId}`;
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

        createStrandBatch(strandId: number, strandBatch): angular.IPromise<any> {
            let url = `/api/strands/${strandId}/batches`;
            var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.post(strandBatch)
                .then((response: any) => {
                    var result = response.data;
                    return result;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }

        updateStrandBatch(strandId: number, strandBatchId: number, strandBatch: any): angular.IPromise<any> {
            let url = `/api/strands/${strandId}/batches/${strandBatchId}`;
            var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.post(strandBatch)
                .then((response: any) => {
                    var result = response.data;
                    return result;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }

        combineStrandBatches(strandId: number, strandBatch, combinedBatches: Array<number>): angular.IPromise<any> {
            let url = `/api/strands/${strandId}/batches/combine`;
            let model = {
                strandBatch: strandBatch,
                combinedBatches: combinedBatches
            };
            var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.post(model)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }

        splitStrandBatch(strandId: number, strandBatchId: number, splittedBatches: Array<any>): angular.IPromise<any> {
            let url = `/api/strands/${strandId}/batches/${strandBatchId}/split`;
            var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.post(splittedBatches)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }

        createStrand(strand): angular.IPromise<any> {
            let url = `/api/strands`;
            var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.post(strand)
                .then((response: any) => {
                    var result = response.data;
                    return result;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }

        getStrandSpecies(strandId: number): angular.IPromise<any> {
            let url = `/api/strands/${strandId}/species`;
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

        createStrands(strands: Array<any>): angular.IPromise<any> {
            let url = `/api/strands/multiple`;
            var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.post(strands)
                .then((response: any) => {
                    var result = response.data;
                    return result;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }
    }

    App.getAppContainer()
        .getSection('app.strands')
        .getInstance()
        .service('strandsService', StrandsService);
}