var App;
(function (App) {
    var Species;
    (function (Species) {
        var Services;
        (function (Services) {
            var SpeciesService = (function () {
                function SpeciesService($http, logger) {
                    this.$http = $http;
                    this.logger = logger;
                }
                SpeciesService.prototype.getSpecies = function (paginationOptions, sortOptions, searchOptions) {
                    var _this = this;
                    var url = '/api/species';
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
                        var exception = new App.Common.Logger.Exception(error);
                        _this.logger.error(exception);
                    });
                };
                SpeciesService.prototype.getSpeciesById = function (speciesId) {
                    var _this = this;
                    var url = "/api/species/" + speciesId;
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
                SpeciesService.prototype.createSpecies = function (species) {
                    var _this = this;
                    var url = '/api/species';
                    var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                    return dataSource.post(species)
                        .then(function (response) {
                        return response.data;
                    })
                        .catch(function (error) {
                        var exception = new App.Common.Logger.Exception(error);
                        _this.logger.error(exception);
                    });
                };
                SpeciesService.prototype.updateSpecies = function (speciesId, species) {
                    var _this = this;
                    var url = "/api/species/" + speciesId;
                    var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
                    return dataSource.post(species)
                        .then(function (response) {
                        return response.data;
                    })
                        .catch(function (error) {
                        var exception = new App.Common.Logger.Exception(error);
                        _this.logger.error(exception);
                    });
                };
                SpeciesService.prototype.deleteSpecies = function (speciesId) {
                    var _this = this;
                    var url = "/api/species/" + speciesId;
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
                SpeciesService.$inject = ['$http', 'logger'];
                return SpeciesService;
            }());
            App.getAppContainer()
                .getSection('app.species')
                .getInstance()
                .service('speciesService', SpeciesService);
        })(Services = Species.Services || (Species.Services = {}));
    })(Species = App.Species || (App.Species = {}));
})(App || (App = {}));
//# sourceMappingURL=speciesService.js.map