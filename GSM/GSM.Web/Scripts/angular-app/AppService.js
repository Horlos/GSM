
var triggerServiceDBApp = angular.module('triggerServiceDBApp', [
        'ngRoute',
        'ngResource',
        'ngFileSaver'
])
  .factory('strandResource', ['$resource', function (resource) {
      return resource('/api/strands', null, {
          'query': { isArray: false }
      });
  }])
    .factory('duplexResource', ['$resource', function (resource) {
        return resource('/api/duplexes', null, {
            'query': { isArray: false }
        });
    }])
    .factory('instrumentsResource', ['$resource', function (resource) {
        return resource('/api/Instruments', null, {
            'query': { isArray: false }
        });
    }])
    .factory('materialRequestResource', ['$resource', function (resource) {
        return resource('/api/materialrequests', null, {
            'query': { isArray: false }
        });
    }]);

