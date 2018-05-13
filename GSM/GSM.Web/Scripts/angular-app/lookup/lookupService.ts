namespace App.Lookup.Services {

    export interface ILookupService {
        getData(url: string,
            paginationOptions: App.Common.IPaginationOptions,
            sortOptions: App.Common.ISortOptions,
            searchOptions: App.Common.ISearchOptions): ng.IPromise<any>;
    }

    class LookupService implements ILookupService {

        static $inject = ['$http', 'logger'];
        constructor(private $http: ng.IHttpService, private logger: App.Common.Logger.ILogger) {
        }

        getData(url: string,
            paginationOptions: App.Common.IPaginationOptions,
            sortOptions: App.Common.ISortOptions,
            searchOptions: App.Common.ISearchOptions): ng.IPromise<any> {
            let data = {
                filterText: searchOptions.filterText,
                pageNo: paginationOptions.pageNumber,
                pageSize: paginationOptions.pageSize,
                sortBy: sortOptions.sortBy,
                sortOrder: sortOptions.sortOrder
            };

            var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.get({ params: data })
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
        .getSection('app.lookup')
        .getInstance()
        .service('lookupService', LookupService);
}