var App;
(function (App) {
    var ModifierTemplates;
    (function (ModifierTemplates) {
        var Services;
        (function (Services) {
            var ModifierTemplatesService = (function () {
                function ModifierTemplatesService($http, logger) {
                    this.$http = $http;
                    this.logger = logger;
                }
                ModifierTemplatesService.prototype.getModofierTemplates = function (paginationOptions, sortOptions, searchOptions) {
                    var _this = this;
                    var url = '/api/modifiertemplates/';
                    var data = {
                        filterText: searchOptions.filterText,
                        sortBy: sortOptions.sortBy,
                        sortOrder: sortOptions.sortOrder,
                        pageNo: paginationOptions.pageNumber,
                        pageSize: paginationOptions.pageSize
                    };
                    var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                    return dataSource.get({ params: data })
                        .then(function (response) {
                        return response.data;
                    })
                        .catch(function (error) {
                        var exception = new App.Common.Logger.Exception(error);
                        _this.logger.error(exception);
                    });
                };
                ModifierTemplatesService.prototype.getModofierTemplate = function (modifierTemplateId) {
                    var _this = this;
                    var url = "/api/modifiertemplates/" + modifierTemplateId;
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
                ModifierTemplatesService.prototype.createModifierTemplate = function (modifierTemplate) {
                    var _this = this;
                    var url = '/api/modifierTemplates';
                    var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                    return dataSource.post(modifierTemplate)
                        .then(function (response) {
                        return response.data;
                    })
                        .catch(function (error) {
                        var exception = new App.Common.Logger.Exception(error);
                        _this.logger.error(exception);
                    });
                };
                ModifierTemplatesService.prototype.updateModifierTemplate = function (modifierTemplateId, modifierTemplate) {
                    var _this = this;
                    var url = "/api/modifiertemplates/" + modifierTemplateId;
                    var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                    return dataSource.post(modifierTemplate)
                        .then(function (response) {
                        return response.data;
                    })
                        .catch(function (error) {
                        var exception = new App.Common.Logger.Exception(error);
                        _this.logger.error(exception);
                    });
                };
                ModifierTemplatesService.prototype.deleteModifierTemplate = function (modifierTemplateId) {
                    var _this = this;
                    var url = "/api/modifiertemplates/" + modifierTemplateId;
                    var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                    return dataSource.delete()
                        .then(function (response) {
                        return response.data;
                    })
                        .catch(function (error) {
                        var exception = new App.Common.Logger.Exception(error);
                        _this.logger.error(exception);
                    });
                };
                ModifierTemplatesService.prototype.isModStructureValid = function (modStructure) {
                    var _this = this;
                    var url = "/api/modstructures/" + modStructure + "/validate";
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
                ModifierTemplatesService.$inject = ['$http', 'logger'];
                return ModifierTemplatesService;
            }());
            App.getAppContainer()
                .getSection('app.modifierTemplates')
                .getInstance()
                .service('modifierTemplatesService', ModifierTemplatesService);
        })(Services = ModifierTemplates.Services || (ModifierTemplates.Services = {}));
    })(ModifierTemplates = App.ModifierTemplates || (App.ModifierTemplates = {}));
})(App || (App = {}));
//# sourceMappingURL=modifierTemplatesService.js.map