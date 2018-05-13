
var app = angular.module('dashboardApp', ['ngResource','angular.filter','angularMoment']);

app.factory('purificationWorkOrderResource', ['$resource', function (resource) {
    return resource('/api/workorders/purification', null, {
        'query': { isArray: false }
    });
}]);
//app.service('purificationDataService', ['purificationWorkOrderResource', OrderDataService]);
//app.controller('purificationWorkOrdersController', ['$scope', 'purificationDataService', OrdersController]);

app.factory('orderResource', ['$resource', function (resource) {
    return resource('/api/materialrequestsbystatus', null, {
        'query': { isArray: true }
    });
}]);

app.factory('synthesisWorkOrderResource', ['$resource', function (resource) {
    return resource('/api/workorders/synthesis', null, {
        'query': { isArray: false }
    });
}]);

app.service('orderDataService',['orderResource', OrderDataService]);
app.service('synthesisDataService', ['synthesisWorkOrderResource', synthesisDataService]);
app.controller('ordersController', ['$scope', '$filter', 'orderDataService', OrdersController]);
app.controller('synthesisWorkOrdersController', ['$scope', '$filter','synthesisDataService', synthesisWorkOrdersController ]);
app.controller('quickSearchController', ['$scope', QuickSearchController]);

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

function QuickSearchController(scope) {
    this.scope = scope;
    scope.searchCompounds = angular.bind(this, this.searchCompounds);
}

QuickSearchController.prototype.searchCompounds = function () {
    window.location.href = '/Compound?search=' + this.scope.searchCompoundsFor;
}


function OrderDataService(orderResource) {
    OrderDataService = this;
    this.orderResource = orderResource;

    function GetOrderCount(desiredStatus, onSuccess) {
        var proxy = this.orderResource.query({
            status: desiredStatus,
            fields: 'id'
        });
        proxy.$promise.then(angular.bind(this, function (data) {
            if (proxy.$resolved) {
                onSuccess(data);
            }
        }));
    }

    OrderDataService.GetOrderCount = GetOrderCount;
};


function synthesisDataService(orderResource) {
    OrderDataService = this;
    this.orderResource = orderResource;

    function GetOrderCount(desiredStatus, onSuccess) {
        var proxy = this.orderResource.query({
            status: desiredStatus,
            fields: 'id'
        });
        proxy.$promise.then(angular.bind(this, function (data) {
            if (proxy.$resolved) {
                onSuccess(data);
            }
        }));
    }

    OrderDataService.GetOrderCount = GetOrderCount;
};


function synthesisWorkOrdersController(scope, $filter, svc) {
    controller = this;
    this.scope = scope;

    scope.newOrders = [];
    scope.submittedOrders = [];
    scope.approvedOrders = [];
    scope.pendingOrders = [];
    scope.inprogressOrders = [];
}


function OrdersController(scope, $filter, svc) {
    controller = this;
    this.scope = scope;

    scope.newOrders = [];
    scope.submittedOrders = [];
    scope.approvedOrders = [];
    scope.pendingOrders = [];
    scope.inprogressOrders = [];
    scope.gotoSearch = this.gotoSearch;
    scope.searchOrders = angular.bind(this, this.searchOrders);
    scope.searchSynthesisWorkOrders = angular.bind(this, this.searchSynthesisWorkOrders);
     
    svc.GetOrderCount('new,submitted,approved,pending,inprogress', angular.bind(this, updateSummaries));
    
        
    function updateSummaries(summaries) {

        //Submitted
        var found = $filter('filter')(summaries, { StatusId: 1 }, true);

        if (found.length) {
            this.scope.submittedOrders = found[0].ItemList;
        }

        //Approved
        var found = $filter('filter')(summaries, { StatusId: 2 }, true);
        if (found.length) {
            this.scope.approvedOrders = found[0].ItemList;
        }

        //Pending
        var found = $filter('filter')(summaries, { StatusId: 3 }, true);
        if (found.length) {
            this.scope.pendingOrders = found[0].ItemList;
        }

        //In Progress
        var found = $filter('filter')(summaries, { StatusId: 4 }, true);
        if (found.length) {
            this.scope.inprogressOrders = found[0].ItemList;
        }
    }
     
    controller.updateSummaries = updateSummaries;
}

OrdersController.prototype.gotoSearch = function (statusFilter) {
    alert(statusFilter);
}

OrdersController.prototype.searchOrders = function () {
    window.location.href = '/Orders?search=' + this.scope.searchOrdersFor;
}

OrdersController.prototype.searchSynthesisWorkOrders = function () {
    window.location.href = '/SynthesisWorkOrder?search=' + this.scope.searchSynthesisWorkOrdersFor;
}