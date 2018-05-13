namespace App.Lookup.Config {
    class LookupRouteConfig {
        static $inject = ['routeHelper', 'lookupConfig'];
        constructor(routeHelper, lookupConfig) {
            var routes = getRoutes(lookupConfig);
            routeHelper.configureRoutes(routes);
        }
    }

    function getRoutes(lookupConfig) {
        var views: App.Lookup.ILookupViews = lookupConfig.views;
        return [
            {
                url: '/lookup',
                config: {
                    controller: 'LookupCtrl',
                    controllerAs: 'vm',
                    templateUrl: '/Scripts/angular-app/lookup/lookupTemplate.html',
                    caseInsensitiveMatch: true,
                    resolve: {
                        lookupConfigService: (): App.Lookup.IViewItem => {
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
                        lookupConfigService: (): App.Lookup.IViewItem => {
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
                        lookupConfigService: () => {
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
                        lookupConfigService: () => {
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
                        lookupConfigService: () => {
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
                        lookupConfigService: () => {
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
                        lookupConfigService: () => {
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
}