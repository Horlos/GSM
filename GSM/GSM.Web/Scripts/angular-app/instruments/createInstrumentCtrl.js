var App;
(function (App) {
    var Instruments;
    (function (Instruments) {
        var Controllers;
        (function (Controllers) {
            var CreateInstrumentCtrl = (function () {
                function CreateInstrumentCtrl($scope, $window, instrumentsService) {
                    this.$scope = $scope;
                    this.$window = $window;
                    this.instrumentsService = instrumentsService;
                    this.initialize();
                }
                CreateInstrumentCtrl.prototype.initialize = function () {
                    this.instrument = {
                        Name: '',
                        IsActive: true,
                        MasAmidities: 0,
                        Error: {}
                    };
                };
                CreateInstrumentCtrl.prototype.permitSubmit = function () {
                    return this.$scope.form.$valid && this.$scope.form.$dirty;
                };
                CreateInstrumentCtrl.prototype.submit = function () {
                    var _this = this;
                    if (this.permitSubmit()) {
                        this.instrumentsService.createInstrument(this.instrument)
                            .then(function (response) {
                            if (!response.HasErrors) {
                                _this.$window.location.href = '/Instrument/Edit/' + response.Id;
                            }
                            _this.instrument.Error = response.Errors;
                            _this.$scope.form.$setPristine();
                        });
                    }
                };
                CreateInstrumentCtrl.prototype.cancelChanges = function () {
                    this.$window.location.href = '/Instruments';
                };
                CreateInstrumentCtrl.$inject = ['$scope', '$window', 'instrumentsService'];
                return CreateInstrumentCtrl;
            }());
            App.getAppContainer()
                .getSection('app.instruments')
                .getInstance()
                .controller('CreateInstrumentCtrl', CreateInstrumentCtrl);
        })(Controllers = Instruments.Controllers || (Instruments.Controllers = {}));
    })(Instruments = App.Instruments || (App.Instruments = {}));
})(App || (App = {}));
//# sourceMappingURL=createInstrumentCtrl.js.map