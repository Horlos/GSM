namespace App.Common.Router {
    export interface IRouteHelperConfig {
        $routeProvider: ng.route.IRouteProvider;
        resolveAlways();
        title: string;
    }

    export interface IRouteHelperConfigProvider {
        config: IRouteHelperConfig;
    }

    class RouteHelper {
        private $routeProvider: ng.route.IRouteProvider;
        private routes: Array<any>;
        private handlingRouteChangeError: boolean;
        private routeCounts: any;

        static $inject = ['$location', '$rootScope', '$route', 'logger', 'routeHelperConfig'];
        constructor(
            private $location,
            private $rootScope,
            private $route,
            private logger,
            private routeHelperConfig: IRouteHelperConfigProvider) {
            this.handlingRouteChangeError = false;
            this.routeCounts = {
                errors: 0,
                changes: 0
            };
            this.routes = [];
            this.$routeProvider = routeHelperConfig.config.$routeProvider;
            this.init();
        }

        configureRoutes(routes) {
            routes.forEach((route) => {
                route.config.resolve =
                    angular.extend(route.config.resolve || {}, this.routeHelperConfig.config.resolveAlways);
                this.$routeProvider.when(route.url, route.config);
            });
            this.$routeProvider.otherwise({ redirectTo: this.$location.path() });
        }

        handleRoutingErrors() {
            this.$rootScope.$on('$routeChangeError',
                (event, current, previous, rejection) => {
                    if (this.handlingRouteChangeError) {
                        return;
                    }
                    this.routeCounts.errors++;
                    this.handlingRouteChangeError = true;
                    var destination = (current && (current.title || current.name || current.loadedTemplateUrl)) ||
                        'unknown target';
                    var msg = 'Error routing to ' + destination + '. ' + (rejection.msg || '');
                    this.logger.warning(msg, [current]);
                    this.$location.path('/');
                }
            );
        }

        init() {
            this.handleRoutingErrors();
            this.updateDocTitle();
            
        }

        getRoutes() {
            for (var prop in this.$route.routes) {
                if (this.$route.routes.hasOwnProperty(prop)) {
                    var route = this.$route.routes[prop];
                    var isRoute = !!route.title;
                    if (isRoute) {
                        this.routes.push(route);
                    }
                }
            }
            return this.routes;
        }

        getRouteCounts() {
            return this.routeCounts;
        }

        updateDocTitle() {
            this.$rootScope.$on('$routeChangeSuccess',
                (event, current, previous) => {
                    this.routeCounts.changes++;
                    this.handlingRouteChangeError = false;
                    var title = this.routeHelperConfig.config.title + ' ' + (current.title || '');
                    this.$rootScope.title = title;
                }
            );
        }
    }

    class RouteHelperConfigProvider implements ng.IServiceProvider {
        private config: IRouteHelperConfig;
        static $inject = ['$routeProvider','$locationProvider'];
        constructor(private $routeProvider, private $locationProvider) {
            this.config = {
                $routeProvider: $routeProvider,
                title: '',
                resolveAlways: () => {

                }
            };
            this.$locationProvider.html5Mode(true);
            this.$locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
        }

        $get(): IRouteHelperConfigProvider {
            return {
                config: this.config
            };
        };
    }

    routeHelperFactory.$inject = ['$location', '$rootScope', '$route', 'logger', 'routeHelperConfig'];
    function routeHelperFactory($location, $rootScope, $route, logger, routeHelperConfig) {
        let routeHelper = new RouteHelper($location, $rootScope, $route, logger, routeHelperConfig);
        return routeHelper;
    }

    App.getAppContainer()
        .getSection('common.router')
        .getInstance()
        .provider('routeHelperConfig', RouteHelperConfigProvider)
        .factory('routeHelper', routeHelperFactory);
}