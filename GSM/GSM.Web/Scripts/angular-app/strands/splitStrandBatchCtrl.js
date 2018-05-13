var App;
(function (App) {
    var Strands;
    (function (Strands) {
        var Controllers;
        (function (Controllers) {
            var SplitStrandBatchCtrl = (function () {
                function SplitStrandBatchCtrl($scope, $window, $state, $stateParams, strandsService) {
                    var _this = this;
                    this.$scope = $scope;
                    this.$window = $window;
                    this.$state = $state;
                    this.strandsService = strandsService;
                    this.strand = $stateParams.model.strand;
                    this.sourceStrandBatch = $stateParams.model.sourceStrandBatch;
                    this.$scope.registerFormScope = function (form, id) {
                        _this.$scope.parentForm['form' + id] = form;
                    };
                    this.initialize();
                }
                SplitStrandBatchCtrl.prototype.initialize = function () {
                    this.splittedBatches = [
                        {
                            InitiatedDate: new Date(),
                            Position: '',
                            RunId: '',
                            Unavailable: false,
                            SynthesisScale: '',
                            Purity: '',
                            AmountPrepared: '',
                            PreparedVolume: '',
                            MiscVolumeUsed: 0,
                            Notes: ''
                        },
                        {
                            InitiatedDate: new Date(),
                            Position: '',
                            RunId: '',
                            Unavailable: false,
                            SynthesisScale: '',
                            Purity: '',
                            AmountPrepared: '',
                            PreparedVolume: '',
                            MiscVolumeUsed: 0,
                            Notes: ''
                        }
                    ];
                    this.isFormSubmitted = false;
                };
                SplitStrandBatchCtrl.prototype.saveSplittedBatches = function () {
                    var _this = this;
                    var strandId = this.strand.Id;
                    var sourceBatchId = this.sourceStrandBatch.Id;
                    this.strandsService.splitStrandBatch(strandId, sourceBatchId, this.splittedBatches)
                        .then(function (data) {
                        var hasErrors = false;
                        for (var i = 0; i < data.length; i++) {
                            var batch = data[i];
                            _this.splittedBatches[i].Error = batch.Errors;
                            if (batch.HasErrors) {
                                hasErrors = true;
                            }
                        }
                        if (!hasErrors) {
                            _this.$window.location.href = '/Strand/Batches';
                        }
                    })
                        .catch(function (exception) {
                    });
                };
                SplitStrandBatchCtrl.prototype.onSubmit = function () {
                    this.isFormSubmitted = true;
                    this.$scope.parentForm.$setPristine();
                };
                SplitStrandBatchCtrl.prototype.submitForm = function () {
                    if (this.$scope.parentForm.$valid) {
                        this.saveSplittedBatches();
                    }
                };
                SplitStrandBatchCtrl.prototype.cancelChanges = function () {
                    this.$state.go('createStrandBatch');
                };
                SplitStrandBatchCtrl.$inject = ['$scope', '$window', '$state', '$stateParams', 'strandsService'];
                return SplitStrandBatchCtrl;
            }());
            App.getAppContainer()
                .getSection('app.strands')
                .getInstance()
                .controller('SplitStrandBatchCtrl', SplitStrandBatchCtrl);
        })(Controllers = Strands.Controllers || (Strands.Controllers = {}));
    })(Strands = App.Strands || (App.Strands = {}));
})(App || (App = {}));
//# sourceMappingURL=splitStrandBatchCtrl.js.map