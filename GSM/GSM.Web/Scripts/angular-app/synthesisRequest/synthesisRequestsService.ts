namespace App.SynthesisRequests {
    export interface ISynthesisRequestsService {
        exportFile(strands, instrument);
        getAll(query): ng.IPromise<any>;
        getAllStatus(): ng.IPromise<any>;
        getSynthesisRequest(synthesisRequestId: number): ng.IPromise<any>;
        createSynthesisRequest(synthesisRequest: any): ng.IPromise<any>;
        updateSynthesisRequest(synthesisRequestId, synthesisRequest: any): ng.IPromise<any>;
        deleteSynthesisRequest(synthesisRequestId: number): ng.IPromise<any>;
    }

    class SynthesisRequestsService implements ISynthesisRequestsService {
        static $inject = ['$http', '$q', 'logger', 'FileSaver', 'Blob'];

        constructor(private $http,
            private $q: ng.IQService,
            private logger: App.Common.Logger.ILogger,
            private fileSaver,
            private blob) {
        }

        getAll(query): angular.IPromise<any> {
            let url = "/api/synthesisrequests";
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

        getAllStatus(): angular.IPromise<any> {
            let url = "/api/status";
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

        getSynthesisRequest(synthesisRequestId: number): angular.IPromise<any> {
            let url = `/api/synthesisrequests/${synthesisRequestId}`;
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

        createSynthesisRequest(synthesisRequest): angular.IPromise<any> {
            let url = `/api/synthesisrequests`;
            var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.post(synthesisRequest)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }

        updateSynthesisRequest(synthesisRequestId, synthesisRequest): angular.IPromise<any> {
            let url = `/api/synthesisrequests/${synthesisRequestId}`;
            var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.put(synthesisRequest)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }

        deleteSynthesisRequest(synthesisRequestId: number): angular.IPromise<any> {
            let url = `/api/synthesisrequests/${synthesisRequestId}`;
            var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.delete()
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }

        exportFile(strands, instrument){
            var text = "some data here...";
            var data = new Blob([text], { type: 'text/plain;charset=utf-8' });
            this.fileSaver.saveAs(data, 'text.txt');

        }
    }

    App.getAppContainer()
        .getSection('app.synthesisRequests')
        .getInstance()
        .service('synthesisRequestsService', SynthesisRequestsService);
}