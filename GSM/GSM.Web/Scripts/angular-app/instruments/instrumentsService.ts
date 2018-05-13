namespace App.Instruments.Services {

    export interface IInstrumentsService {
        getInstruments(paginationOptions: App.Common.IPaginationOptions,
            sortOptions: App.Common.ISortOptions,
            searchOptions: App.Common.ISearchOptions): ng.IPromise<any>;
        getInstrumentById(instrumentId: number): ng.IPromise<any>;
        createInstrument(instrument): ng.IPromise<any>;
        updateInstrument(instrumentId: number, instrument): ng.IPromise<any>;
        deleteInstrument(instrumentId: number): ng.IPromise<any>;
    }

    class InstrumentsService implements IInstrumentsService {

        static $inject = ['$http', 'logger'];
        constructor(
            private $http: ng.IHttpService,
            private logger: App.Common.Logger.ILogger) {
        }

        getInstruments(paginationOptions: App.Common.IPaginationOptions,
            sortOptions: App.Common.ISortOptions,
            searchOptions: App.Common.ISearchOptions): ng.IPromise<any> {
            let url = '/api/instruments';
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

        getInstrumentById(instrumentId: number): ng.IPromise<any> {
            let url = `/api/instruments/${instrumentId}`;
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

        createInstrument(instrument): ng.IPromise<any> {
            let url = '/api/instruments';
            let dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.post(instrument)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }

        updateInstrument(instrumentId, instrument): ng.IPromise<any> {
            let url = `/api/instruments/${instrumentId}`;
            let dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.post(instrument)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }

        deleteInstrument(instrumentId: number): ng.IPromise<any> {
            let url = `/api/instruments/${instrumentId}`;
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
        .getSection('app.instruments')
        .getInstance()
        .service('instrumentsService', InstrumentsService);
}