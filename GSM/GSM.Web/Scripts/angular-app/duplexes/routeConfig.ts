namespace App.Duplexes {
    class RouteConfig {
        static $inject = ['$stateProvider', '$urlRouterProvider', '$urlMatcherFactoryProvider', '$locationProvider'];
        constructor(
            private $stateProvider: ng.ui.IStateProvider,
            private $urlRouterProvider: ng.ui.IUrlRouterProvider,
            private $urlMatcherFactory: ng.ui.IUrlMatcherFactory,
            private $locationProvider: ng.ILocationProvider) {

            this.$urlMatcherFactory.caseInsensitive(true);

            this.$locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });

            this.$stateProvider
                .state('editImportedDuplex',
                {
                    templateUrl: '/duplex/editImportedDuplex',
                    controller: 'EditImportedDuplexCtrl',
                    controllerAs: 'vm',
                    params: {
                        duplex: null
                    }
                })
                .state('importDuplexes',
                {
                    url: '/duplex/import',
                    templateUrl: '/duplex/importDuplexes',
                    controller: 'ImportDuplexesCtrl',
                    controllerAs: 'vm',
                    params: {
                        duplex: null
                    }
                });
        }
    }

    App.getAppContainer()
        .getSection('app.duplexes')
        .getInstance()
        .config(RouteConfig);
}