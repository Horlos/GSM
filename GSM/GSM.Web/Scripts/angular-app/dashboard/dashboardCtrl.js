var App;
(function (App) {
    var Dashboard;
    (function (Dashboard) {
        var Controllers;
        (function (Controllers) {
            var RequestStatus;
            (function (RequestStatus) {
                RequestStatus[RequestStatus["Submitted"] = 1] = "Submitted";
                RequestStatus[RequestStatus["Approved"] = 2] = "Approved";
                RequestStatus[RequestStatus["Pending"] = 3] = "Pending";
                RequestStatus[RequestStatus["InProgress"] = 4] = "InProgress";
                RequestStatus[RequestStatus["NearCompletion"] = 5] = "NearCompletion";
                RequestStatus[RequestStatus["Complete"] = 6] = "Complete";
                RequestStatus[RequestStatus["OnHold"] = 7] = "OnHold";
                RequestStatus[RequestStatus["Canceled"] = 8] = "Canceled";
            })(RequestStatus || (RequestStatus = {}));
            var DashboardCtrl = (function () {
                function DashboardCtrl($scope, $window, dashboardService) {
                    this.$scope = $scope;
                    this.$window = $window;
                    this.dashboardService = dashboardService;
                    this.synthesisRequestsTitle = 'Synthesis Request';
                    this.materialRequestsTitle = 'Materials Requests';
                    this.initialize();
                }
                DashboardCtrl.prototype.initialize = function () {
                    this.materialsRequestsMap = {};
                    this.initializeRequestsMap(this.materialsRequestsMap);
                    this.getMaterialsRequests();
                    this.synthesisRequestsMap = {};
                    this.initializeRequestsMap(this.synthesisRequestsMap);
                    this.getSynthesisRequests();
                };
                DashboardCtrl.prototype.initializeRequestsMap = function (requestsMap) {
                    var keys = App.Common.EnumExtensions.getNames(RequestStatus);
                    for (var i = 1; i < 5; i++) {
                        requestsMap[i] = [];
                    }
                };
                DashboardCtrl.prototype.searchMaterialsRequests = function () {
                    this.$window.location.href = '/MaterialRequest/#?search=' + this.materialRequestSearch;
                };
                DashboardCtrl.prototype.searchSynthesisRequests = function () {
                    this.$window.location.href = '/SynthesisRequest/#?search=' + this.synthesisRequestSearch;
                };
                DashboardCtrl.prototype.searchStrands = function () {
                    this.$window.location.href = '/Strand/#?search=' + this.strandsSearch;
                };
                DashboardCtrl.prototype.searchDuplexes = function () {
                    this.$window.location.href = '/Duplex/#?search=' + this.duplexesSearch;
                };
                DashboardCtrl.prototype.getMaterialsRequests = function () {
                    var _this = this;
                    this.dashboardService.getMaterialsRequests()
                        .then(function (data) {
                        for (var i = 0; i < data.length; i++) {
                            var statusId = data[i].StatusId;
                            _this.materialsRequestsMap[statusId] = data[i].ItemList;
                        }
                    });
                };
                DashboardCtrl.prototype.getSynthesisRequests = function () {
                    var _this = this;
                    this.dashboardService.getSynthesisRequests()
                        .then(function (data) {
                        for (var i = 0; i < data.length; i++) {
                            var statusId = data[i].StatusId;
                            _this.synthesisRequestsMap[statusId] = data[i].ItemList;
                        }
                    });
                };
                DashboardCtrl.prototype.getRequestStatus = function (status) {
                    var statusId = parseInt(status);
                    switch (statusId) {
                        case RequestStatus.Submitted:
                            return 'Submitted';
                        case RequestStatus.Approved:
                            return 'Approved';
                        case RequestStatus.NearCompletion:
                            return 'Near Completion';
                        case RequestStatus.Pending:
                            return 'Pending';
                        case RequestStatus.InProgress:
                            return 'In Progress';
                        case RequestStatus.Complete:
                            return 'Complete';
                        case RequestStatus.OnHold:
                            return 'On Hold';
                        case RequestStatus.Canceled:
                            return 'Canceled';
                    }
                    return '';
                };
                DashboardCtrl.$inject = ['$scope', '$window', 'dashboardService'];
                return DashboardCtrl;
            }());
            App.getAppContainer()
                .getSection('app.dashboard')
                .getInstance()
                .controller('DashboardCtrl', DashboardCtrl);
        })(Controllers = Dashboard.Controllers || (Dashboard.Controllers = {}));
    })(Dashboard = App.Dashboard || (App.Dashboard = {}));
})(App || (App = {}));
//# sourceMappingURL=dashboardCtrl.js.map