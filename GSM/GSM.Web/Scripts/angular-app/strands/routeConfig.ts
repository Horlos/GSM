namespace App.Strands {
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
                .state('split',
                {
                    templateUrl: '/Strand/SplitStrandBatch',
                    controller: 'SplitStrandBatchCtrl',
                    controllerAs: 'vm',
                    params: {
                        model: null
                    }
                })
                .state('createStrandBatch',
                {
                    url: '/strand/createStrandBatch',
                    templateUrl: '/Strand/CreateBatch',
                    controller: 'CreateStrandBatchCtrl',
                    controllerAs: 'vm'
                })
                .state('createStrand',
                {
                    templateUrl: '/strand/editImportedStrand',
                    controller: 'EditImportedStrandCtrl',
                    controllerAs: 'vm',
                    params: {
                        strand: null
                    }
                })
                .state('importStrand',
                {
                    url: '/strand/import',
                    templateUrl: '/strand/importStrands',
                    controller: 'ImportStrandsCtrl',
                    controllerAs: 'vm',
                    params: {
                        strand: null
                    }
                });
        }
    }

    App.getAppContainer()
        .getSection('app.strands')
        .getInstance()
        .config(RouteConfig);
}