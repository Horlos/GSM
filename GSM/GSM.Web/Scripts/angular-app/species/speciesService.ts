namespace App.Species.Services {

    export interface ISpeciesService {
        getSpecies(paginationOptions: App.Common.IPaginationOptions,
            sortOptions: App.Common.ISortOptions,
            searchOptions: App.Common.ISearchOptions): ng.IPromise<any>;
        getSpeciesById(speciesId: number): ng.IPromise<any>;
        createSpecies(species): ng.IPromise<any>;
        updateSpecies(speciesId: number, species): ng.IPromise<any>;
        deleteSpecies(speciesId: number): ng.IPromise<any>;
    }

    class SpeciesService implements ISpeciesService {

        static $inject = ['$http', 'logger'];

        constructor(private $http: ng.IHttpService, private logger: App.Common.Logger.ILogger) {
        }

        getSpecies(paginationOptions: App.Common.IPaginationOptions,
                sortOptions: App.Common.ISortOptions,
                searchOptions: App.Common.ISearchOptions): ng.IPromise<any> {
            let url = '/api/species';
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

        getSpeciesById(speciesId: number): ng.IPromise<any> {
            let url = `/api/species/${speciesId}`;
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

        createSpecies(species): angular.IPromise<any> {
            let url = '/api/species';
            let dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.post(species)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }

        updateSpecies(speciesId, species): ng.IPromise<any> {
            let url = `/api/species/${speciesId}`;
            let dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.post(species)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }

        deleteSpecies(speciesId: number): angular.IPromise<any> {
            let url = `/api/species/${speciesId}`;
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
        .getSection('app.species')
        .getInstance()
        .service('speciesService', SpeciesService);
}