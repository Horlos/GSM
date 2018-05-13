var App;
(function (App) {
    var Lookup;
    (function (Lookup) {
        var Config;
        (function (Config) {
            var LookupRouteConfig = (function () {
                function LookupRouteConfig(routeHelper, lookupConfig) {
                    var routes = getRoutes(lookupConfig);
                    routeHelper.configureRoutes(routes);
                }
                LookupRouteConfig.$inject = ['routeHelper', 'lookupConfig'];
                return LookupRouteConfig;
            }());
            function getRoutes(lookupConfig) {
                var views = lookupConfig.views;
                return [
                    {
                        url: '/lookup',
                        config: {
                            controller: 'LookupCtrl',
                            controllerAs: 'vm',
                            templateUrl: '/Scripts/angular-app/lookup/lookupTemplate.html',
                            caseInsensitiveMatch: true,
                            resolve: {
                                lookupConfigService: function () {
                                    return views.targets;
                                }
                            }
                        }
                    },
                    {
                        url: views.targets.baseUrl,
                        config: {
                            controller: 'LookupCtrl',
                            controllerAs: 'vm',
                            templateUrl: '/Scripts/angular-app/lookup/lookupTemplate.html',
                            caseInsensitiveMatch: true,
                            resolve: {
                                lookupConfigService: function () {
                                    return views.targets;
                                }
                            }
                        }
                    },
                    {
                        url: views.modStructures.baseUrl,
                        config: {
                            controller: 'LookupCtrl',
                            controllerAs: 'vm',
                            templateUrl: '/Scripts/angular-app/lookup/lookupTemplate.html',
                            caseInsensitiveMatch: true,
                            resolve: {
                                lookupConfigService: function () {
                                    return views.modStructures;
                                }
                            }
                        }
                    },
                    {
                        url: views.species.baseUrl,
                        config: {
                            controller: 'LookupCtrl',
                            controllerAs: 'vm',
                            templateUrl: '/Scripts/angular-app/lookup/lookupTemplate.html',
                            caseInsensitiveMatch: true,
                            resolve: {
                                lookupConfigService: function () {
                                    return views.species;
                                }
                            }
                        }
                    },
                    {
                        url: views.strands.baseUrl,
                        config: {
                            controller: 'LookupCtrl',
                            controllerAs: 'vm',
                            templateUrl: '/Scripts/angular-app/lookup/lookupTemplate.html',
                            caseInsensitiveMatch: true,
                            resolve: {
                                lookupConfigService: function () {
                                    return views.strands;
                                }
                            }
                        }
                    },
                    {
                        url: views.duplexes.baseUrl,
                        config: {
                            controller: 'LookupCtrl',
                            controllerAs: 'vm',
                            templateUrl: '/Scripts/angular-app/lookup/lookupTemplate.html',
                            caseInsensitiveMatch: true,
                            resolve: {
                                lookupConfigService: function () {
                                    return views.duplexes;
                                }
                            }
                        }
                    },
                    {
                        url: views.instruments.baseUrl,
                        config: {
                            controller: 'LookupCtrl',
                            controllerAs: 'vm',
                            templateUrl: '/Scripts/angular-app/lookup/lookupTemplate.html',
                            caseInsensitiveMatch: true,
                            resolve: {
                                lookupConfigService: function () {
                                    return views.instruments;
                                }
                            }
                        }
                    }
                ];
            }
            App.getAppContainer()
                .getSection('app.lookup')
                .getInstance()
                .run(LookupRouteConfig);
        })(Config = Lookup.Config || (Lookup.Config = {}));
    })(Lookup = App.Lookup || (App.Lookup = {}));
})(App || (App = {}));
//# sourceMappingURL=routeConfig.js.map