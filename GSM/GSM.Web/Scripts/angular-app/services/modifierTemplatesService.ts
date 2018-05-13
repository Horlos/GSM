namespace App.Services {
    export interface IModifierTemplatesService {
        getModifierTemplate(modifierTemplateId: number, baseSequence: string, firstPosition: number): ng.IPromise<any>;
        getModifierTemplates(query: any): ng.IPromise<any>;
    }

    class ModifierTemplatesService implements IModifierTemplatesService {

        static $inject = ['$http', 'logger'];
        constructor(private $http: ng.IHttpService, private logger: App.Common.Logger.ILogger) {
        }

        getModifierTemplate(modifierTemplateId: number, baseSequence: string, firstPosition: number): angular.IPromise<any> {
            let url = `/api/modifiers/${modifierTemplateId}/:${baseSequence}/${firstPosition}`;
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

        getModifierTemplates(query): angular.IPromise<any> {
            let url = "/api/modifiertemplates";
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
        .service('modifierTemplatesService', ModifierTemplatesService);
}