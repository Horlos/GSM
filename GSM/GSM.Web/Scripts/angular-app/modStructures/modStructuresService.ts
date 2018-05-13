namespace App.ModStructures.Services {

    export interface IModStructuresService {
        getModStructures(paginationOptions: App.Common.IPaginationOptions,
            sortOptions: App.Common.ISortOptions,
            searchOptions: App.Common.ISearchOptions): ng.IPromise<any>;
        getModStructureById(modStructureId: number): ng.IPromise<any>;
        createModStructure(modStructure): ng.IPromise<any>;
        updateModStructure(modStructureId: number, modStructure): ng.IPromise<any>;
        deleteModStructure(modStructureId: number): ng.IPromise<any>;
    }

    class ModStructuresService implements IModStructuresService {

        static $inject = ['$http', 'logger'];
        constructor(private $http: ng.IHttpService,
            private logger: App.Common.Logger.ILogger) {
        }

        getModStructures(paginationOptions: App.Common.IPaginationOptions,
            sortOptions: App.Common.ISortOptions,
            searchOptions: App.Common.ISearchOptions): ng.IPromise<any> {
            let url = '/api/modStructures';
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

                });
        }

        getModStructureById(modStructureId: number): ng.IPromise<any> {
            let url = `/api/modStructures/${modStructureId}`;
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

        createModStructure(modStructure): ng.IPromise<any> {
            let url = '/api/modStructures';
            let dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.post(modStructure)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }

        updateModStructure(modStructureId, modStructure): ng.IPromise<any> {
            let url = `/api/modStructures/${modStructureId}`;
            let dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.post(modStructure)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }

        deleteModStructure(modStructureId: number): ng.IPromise<any> {
            let url = `/api/modStructures/${modStructureId}`;
            let dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.delete()
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {

                });
        }

        saveAttachement(fileInfo: any): ng.IPromise<any> {
            let url = `/api/modStructures/${fileInfo.Id}`;
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
        .getSection('app.modStructures')
        .getInstance()
        .service('modStructuresService', ModStructuresService);
}