var App;
(function (App) {
    var Services;
    (function (Services) {
        var ModifierTemplatesService = (function () {
            function ModifierTemplatesService($http, logger) {
                this.$http = $http;
                this.logger = logger;
            }
            ModifierTemplatesService.prototype.getModifierTemplate = function (modifierTemplateId, baseSequence, firstPosition) {
                var _this = this;
                var url = "/api/modifiers/" + modifierTemplateId + "/:" + baseSequence + "/" + firstPosition;
                var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                return dataSource.get()
                    .then(function (response) {
                    return response.data;
                })
                    .catch(function (error) {
                    var exception = new App.Common.Logger.Exception(error);
                    _this.logger.error(exception);
                });
            };
            ModifierTemplatesService.prototype.getModifierTemplates = function (query) {
                var _this = this;
                var url = "/api/modifiertemplates";
                var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                return dataSource.get({ params: query })
                    .then(function (response) {
                    return response.data;
                })
                    .catch(function (error) {
                    var exception = new App.Common.Logger.Exception(error);
                    _this.logger.error(exception);
                });
            };
            ModifierTemplatesService.$inject = ['$http', 'logger'];
            return ModifierTemplatesService;
        }());
        App.getAppContainer()
            .getSection('app.services')
            .getInstance()
            .service('modifierTemplatesService', ModifierTemplatesService);
    })(Services = App.Services || (App.Services = {}));
})(App || (App = {}));
//# sourceMappingURL=modifierTemplatesService.js.map