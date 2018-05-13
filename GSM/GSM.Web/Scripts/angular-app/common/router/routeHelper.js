var App;
(function (App) {
    var Common;
    (function (Common) {
        var Router;
        (function (Router) {
            var RouteHelper = (function () {
                function RouteHelper($location, $rootScope, $route, logger, routeHelperConfig) {
                    this.$location = $location;
                    this.$rootScope = $rootScope;
                    this.$route = $route;
                    this.logger = logger;
                    this.routeHelperConfig = routeHelperConfig;
                    this.handlingRouteChangeError = false;
                    this.routeCounts = {
                        errors: 0,
                        changes: 0
                    };
                    this.routes = [];
                    this.$routeProvider = routeHelperConfig.config.$routeProvider;
                    this.init();
                }
                RouteHelper.prototype.configureRoutes = function (routes) {
                    var _this = this;
                    routes.forEach(function (route) {
                        route.config.resolve =
                            angular.extend(route.config.resolve || {}, _this.routeHelperConfig.config.resolveAlways);
                        _this.$routeProvider.when(route.url, route.config);
                    });
                    this.$routeProvider.otherwise({ redirectTo: this.$location.path() });
                };
                RouteHelper.prototype.handleRoutingErrors = function () {
                    var _this = this;
                    this.$rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
                        if (_this.handlingRouteChangeError) {
                            return;
                        }
                        _this.routeCounts.errors++;
                        _this.handlingRouteChangeError = true;
                        var destination = (current && (current.title || current.name || current.loadedTemplateUrl)) ||
                            'unknown target';
                        var msg = 'Error routing to ' + destination + '. ' + (rejection.msg || '');
                        _this.logger.warning(msg, [current]);
                        _this.$location.path('/');
                    });
                };
                RouteHelper.prototype.init = function () {
                    this.handleRoutingErrors();
                    this.updateDocTitle();
                };
                RouteHelper.prototype.getRoutes = function () {
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
                };
                RouteHelper.prototype.getRouteCounts = function () {
                    return this.routeCounts;
                };
                RouteHelper.prototype.updateDocTitle = function () {
                    var _this = this;
                    this.$rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
                        _this.routeCounts.changes++;
                        _this.handlingRouteChangeError = false;
                        var title = _this.routeHelperConfig.config.title + ' ' + (current.title || '');
                        _this.$rootScope.title = title;
                    });
                };
                RouteHelper.$inject = ['$location', '$rootScope', '$route', 'logger', 'routeHelperConfig'];
                return RouteHelper;
            }());
            var RouteHelperConfigProvider = (function () {
                function RouteHelperConfigProvider($routeProvider, $locationProvider) {
                    this.$routeProvider = $routeProvider;
                    this.$locationProvider = $locationProvider;
                    this.config = {
                        $routeProvider: $routeProvider,
                        title: '',
                        resolveAlways: function () {
                        }
                    };
                    this.$locationProvider.html5Mode(true);
                    this.$locationProvider.html5Mode({
                        enabled: true,
                        requireBase: false
                    });
                }
                RouteHelperConfigProvider.prototype.$get = function () {
                    return {
                        config: this.config
                    };
                };
                ;
                RouteHelperConfigProvider.$inject = ['$routeProvider', '$locationProvider'];
                return RouteHelperConfigProvider;
            }());
            routeHelperFactory.$inject = ['$location', '$rootScope', '$route', 'logger', 'routeHelperConfig'];
            function routeHelperFactory($location, $rootScope, $route, logger, routeHelperConfig) {
                var routeHelper = new RouteHelper($location, $rootScope, $route, logger, routeHelperConfig);
                return routeHelper;
            }
            App.getAppContainer()
                .getSection('common.router')
                .getInstance()
                .provider('routeHelperConfig', RouteHelperConfigProvider)
                .factory('routeHelper', routeHelperFactory);
        })(Router = Common.Router || (Common.Router = {}));
    })(Common = App.Common || (App.Common = {}));
})(App || (App = {}));
//# sourceMappingURL=routeHelper.js.map