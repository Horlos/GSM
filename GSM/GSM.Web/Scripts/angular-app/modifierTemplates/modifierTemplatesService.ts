namespace App.ModifierTemplates.Services {
    export interface IModifierTemplatesService {
        getModofierTemplates(paginationOptions: App.Common.IPaginationOptions,
            sortOptions: App.Common.ISortOptions,
            searchOptions: App.Common.ISearchOptions): ng.IPromise<any>;
        getModofierTemplate(modifierTemplateId: number): ng.IPromise<any>;
        createModifierTemplate(modifierTemplate): ng.IPromise<any>;
        updateModifierTemplate(modifierTemplateId: number, modifierTemplate): ng.IPromise<any>;
        deleteModifierTemplate(modifierTemplateId: number): ng.IPromise<any>;
        isModStructureValid(modStructure): ng.IPromise<any>;
    }

    class ModifierTemplatesService implements IModifierTemplatesService {

        static $inject = ['$http', 'logger'];
        constructor(private $http: ng.IHttpService, private logger: App.Common.Logger.ILogger) {
        }

        getModofierTemplates(paginationOptions: App.Common.IPaginationOptions,
            sortOptions: App.Common.ISortOptions,
            searchOptions: App.Common.ISearchOptions): angular.IPromise<any> {
            let url = '/api/modifiertemplates/';
            let data = {
                filterText: searchOptions.filterText,
                sortBy: sortOptions.sortBy,
                sortOrder: sortOptions.sortOrder,
                pageNo: paginationOptions.pageNumber,
                pageSize: paginationOptions.pageSize
            };
            var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.get({ params: data})
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }

        getModofierTemplate(modifierTemplateId: number): angular.IPromise<any> {
            let url = `/api/modifiertemplates/${modifierTemplateId}`;
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

        createModifierTemplate(modifierTemplate): angular.IPromise<any> {
            let url = '/api/modifierTemplates';
            let dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.post(modifierTemplate)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }
        updateModifierTemplate(modifierTemplateId: number, modifierTemplate): ng.IPromise<any> {
            let url = `/api/modifiertemplates/${modifierTemplateId}`;
            let dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.post(modifierTemplate)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }

        deleteModifierTemplate(modifierTemplateId: number): angular.IPromise<any> {
            let url = `/api/modifiertemplates/${modifierTemplateId}`;
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

        isModStructureValid(modStructure): angular.IPromise<any> {
            let url = `/api/modstructures/${modStructure}/validate`;
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
    }

    App.getAppContainer()
        .getSection('app.modifierTemplates')
        .getInstance()
        .service('modifierTemplatesService', ModifierTemplatesService);
}