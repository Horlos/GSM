namespace App.Dashboard.Controllers {

    enum RequestStatus {
        Submitted = 1,
        Approved = 2,
        Pending = 3,
        InProgress = 4,
        NearCompletion = 5,
        Complete = 6,
        OnHold = 7,
        Canceled = 8
    }

    interface IMaterialsRequestsMap {
        [statusId: number]: Array<any>;
    }

    interface ISynthesisRequestsMap {
        [statusId: number]: Array<any>;
    }

    interface IDashboardScope {

    }

    class DashboardCtrl implements IDashboardScope {
        public materialsRequestsMap: IMaterialsRequestsMap;
        public synthesisRequestsMap: ISynthesisRequestsMap;

        public synthesisRequestsTitle: string;
        public materialRequestsTitle: string;
        public materialRequestSearch: string;
        public synthesisRequestSearch: string;
        public strandsSearch: string;
        public duplexesSearch: string;

        static $inject = ['$scope', '$window', 'dashboardService'];
        constructor(
            private $scope,
            private $window: ng.IWindowService,
            private dashboardService: App.Dashboard.Services.IDashboardService) {
            this.synthesisRequestsTitle = 'Synthesis Request';
            this.materialRequestsTitle = 'Materials Requests';

            this.initialize();
        }

        initialize(): void {
            this.materialsRequestsMap = {};
            this.initializeRequestsMap(this.materialsRequestsMap);
            this.getMaterialsRequests();

            this.synthesisRequestsMap = {};
            this.initializeRequestsMap(this.synthesisRequestsMap);
            this.getSynthesisRequests();
        }

        initializeRequestsMap(requestsMap): void {
            let keys = App.Common.EnumExtensions.getNames(RequestStatus);
            for (let i = 1; i < 5; i++) {
                requestsMap[i] = [];
            }
        }

        searchMaterialsRequests(): void {
            this.$window.location.href = '/MaterialRequest/#?search=' + this.materialRequestSearch;
        }

        searchSynthesisRequests(): void {
            this.$window.location.href = '/SynthesisRequest/#?search=' + this.synthesisRequestSearch;
        }

        searchStrands(): void {
            this.$window.location.href = '/Strand/#?search=' + this.strandsSearch;
        }

        searchDuplexes(): void {
            this.$window.location.href = '/Duplex/#?search=' + this.duplexesSearch;
        }

        getMaterialsRequests(): void {
            this.dashboardService.getMaterialsRequests()
                .then((data) => {
                    for (let i = 0; i < data.length; i++) {
                        let statusId = data[i].StatusId;
                        this.materialsRequestsMap[statusId] = data[i].ItemList;
                    }
                });
        }

        getSynthesisRequests(): void {
            this.dashboardService.getSynthesisRequests()
                .then((data) => {
                    for (let i = 0; i < data.length; i++) {
                        let statusId = data[i].StatusId;
                        this.synthesisRequestsMap[statusId] = data[i].ItemList;
                    }
                });
        }

        getRequestStatus(status: string): string {
            let statusId = parseInt(status);
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
        }
    }
    App.getAppContainer()
        .getSection('app.dashboard')
        .getInstance()
        .controller('DashboardCtrl', DashboardCtrl);
}