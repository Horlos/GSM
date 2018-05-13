var App;
(function (App) {
    var Strands;
    (function (Strands) {
        var RouteConfig = (function () {
            function RouteConfig($stateProvider, $urlRouterProvider, $urlMatcherFactory, $locationProvider) {
                this.$stateProvider = $stateProvider;
                this.$urlRouterProvider = $urlRouterProvider;
                this.$urlMatcherFactory = $urlMatcherFactory;
                this.$locationProvider = $locationProvider;
                this.$urlMatcherFactory.caseInsensitive(true);
                this.$locationProvider.html5Mode({
                    enabled: true,
                    requireBase: false
                });
                this.$stateProvider
                    .state('split', {
                    templateUrl: '/Strand/SplitStrandBatch',
                    controller: 'SplitStrandBatchCtrl',
                    controllerAs: 'vm',
                    params: {
                        model: null
                    }
                })
                    .state('createStrandBatch', {
                    url: '/strand/createStrandBatch',
                    templateUrl: '/Strand/CreateBatch',
                    controller: 'CreateStrandBatchCtrl',
                    controllerAs: 'vm'
                })
                    .state('createStrand', {
                    templateUrl: '/strand/editImportedStrand',
                    controller: 'EditImportedStrandCtrl',
                    controllerAs: 'vm',
                    params: {
                        strand: null
                    }
                })
                    .state('importStrand', {
                    url: '/strand/import',
                    templateUrl: '/strand/importStrands',
                    controller: 'ImportStrandsCtrl',
                    controllerAs: 'vm',
                    params: {
                        strand: null
                    }
                });
            }
            RouteConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$urlMatcherFactoryProvider', '$locationProvider'];
            return RouteConfig;
        }());
        App.getAppContainer()
            .getSection('app.strands')
            .getInstance()
            .config(RouteConfig);
    })(Strands = App.Strands || (App.Strands = {}));
})(App || (App = {}));
//# sourceMappingURL=routeConfig.js.map