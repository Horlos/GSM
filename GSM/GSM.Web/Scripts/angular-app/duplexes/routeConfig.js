var App;
(function (App) {
    var Duplexes;
    (function (Duplexes) {
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
                    .state('editImportedDuplex', {
                    templateUrl: '/duplex/editImportedDuplex',
                    controller: 'EditImportedDuplexCtrl',
                    controllerAs: 'vm',
                    params: {
                        duplex: null
                    }
                })
                    .state('importDuplexes', {
                    url: '/duplex/import',
                    templateUrl: '/duplex/importDuplexes',
                    controller: 'ImportDuplexesCtrl',
                    controllerAs: 'vm',
                    params: {
                        duplex: null
                    }
                });
            }
            RouteConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$urlMatcherFactoryProvider', '$locationProvider'];
            return RouteConfig;
        }());
        App.getAppContainer()
            .getSection('app.duplexes')
            .getInstance()
            .config(RouteConfig);
    })(Duplexes = App.Duplexes || (App.Duplexes = {}));
})(App || (App = {}));
//# sourceMappingURL=routeConfig.js.map