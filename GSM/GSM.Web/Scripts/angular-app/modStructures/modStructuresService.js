var App;
(function (App) {
    var ModStructures;
    (function (ModStructures) {
        var Services;
        (function (Services) {
            var ModStructuresService = (function () {
                function ModStructuresService($http, logger) {
                    this.$http = $http;
                    this.logger = logger;
                }
                ModStructuresService.prototype.getModStructures = function (paginationOptions, sortOptions, searchOptions) {
                    var url = '/api/modStructures';
                    var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                    var data = {
                        filterText: searchOptions.filterText,
                        pageNo: paginationOptions.pageNumber,
                        pageSize: paginationOptions.pageSize,
                        sortBy: sortOptions.sortBy,
                        sortOrder: sortOptions.sortOrder
                    };
                    return dataSource.get({ params: data })
                        .then(function (response) {
                        return response.data;
                    })
                        .catch(function (error) {
                    });
                };
                ModStructuresService.prototype.getModStructureById = function (modStructureId) {
                    var _this = this;
                    var url = "/api/modStructures/" + modStructureId;
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
                ModStructuresService.prototype.createModStructure = function (modStructure) {
                    var _this = this;
                    var url = '/api/modStructures';
                    var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                    return dataSource.post(modStructure)
                        .then(function (response) {
                        return response.data;
                    })
                        .catch(function (error) {
                        var exception = new App.Common.Logger.Exception(error);
                        _this.logger.error(exception);
                    });
                };
                ModStructuresService.prototype.updateModStructure = function (modStructureId, modStructure) {
                    var _this = this;
                    var url = "/api/modStructures/" + modStructureId;
                    var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                    return dataSource.post(modStructure)
                        .then(function (response) {
                        return response.data;
                    })
                        .catch(function (error) {
                        var exception = new App.Common.Logger.Exception(error);
                        _this.logger.error(exception);
                    });
                };
                ModStructuresService.prototype.deleteModStructure = function (modStructureId) {
                    var url = "/api/modStructures/" + modStructureId;
                    var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                    return dataSource.delete()
                        .then(function (response) {
                        return response.data;
                    })
                        .catch(function (error) {
                    });
                };
                ModStructuresService.prototype.saveAttachement = function (fileInfo) {
                    var _this = this;
                    var url = "/api/modStructures/" + fileInfo.Id;
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
                ModStructuresService.$inject = ['$http', 'logger'];
                return ModStructuresService;
            }());
            App.getAppContainer()
                .getSection('app.modStructures')
                .getInstance()
                .service('modStructuresService', ModStructuresService);
        })(Services = ModStructures.Services || (ModStructures.Services = {}));
    })(ModStructures = App.ModStructures || (App.ModStructures = {}));
})(App || (App = {}));
//# sourceMappingURL=modStructuresService.js.map