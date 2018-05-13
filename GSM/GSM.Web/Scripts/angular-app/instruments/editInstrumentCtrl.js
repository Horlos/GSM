var App;
(function (App) {
    var Instruments;
    (function (Instruments) {
        var Controllers;
        (function (Controllers) {
            var EditInstrumentsCtrl = (function () {
                function EditInstrumentsCtrl($scope, $window, $location, deleteModalService, instrumentsService) {
                    this.$scope = $scope;
                    this.$window = $window;
                    this.$location = $location;
                    this.deleteModalService = deleteModalService;
                    this.instrumentsService = instrumentsService;
                    this.initialize();
                    var instrumentId = +App.Common.Utils.lastUrlParam(this.$location.absUrl());
                    this.loadInstrumentsData(instrumentId);
                }
                EditInstrumentsCtrl.prototype.initialize = function () {
                    this.editMode = false;
                };
                EditInstrumentsCtrl.prototype.loadInstrumentsData = function (instrumentId) {
                    var _this = this;
                    this.instrumentsService.getInstrumentById(instrumentId)
                        .then(function (data) {
                        _this.instrument = data;
                    });
                };
                EditInstrumentsCtrl.prototype.permitSubmit = function () {
                    return this.$scope.form.$valid && this.$scope.form.$dirty;
                };
                EditInstrumentsCtrl.prototype.submit = function () {
                    var _this = this;
                    var instrumentId = this.instrument.Id;
                    this.instrumentsService.updateInstrument(instrumentId, this.instrument)
                        .then(function (data) {
                        if (!data.HasErrors) {
                            _this.$window.location.href = '/Instrument/Edit/' + data.Id;
                        }
                        else {
                            _this.instrument.Error = data.Errors;
                        }
                    });
                };
                EditInstrumentsCtrl.prototype.cancelChanges = function () {
                    var instrumentId = this.instrument.Id;
                    this.loadInstrumentsData(instrumentId);
                    this.$scope.form.$setPristine();
                    this.editMode = false;
                };
                EditInstrumentsCtrl.prototype.pageMode = function () {
                    if (this.editMode) {
                        return "View";
                    }
                    else {
                        return "Edit";
                    }
                };
                EditInstrumentsCtrl.prototype.permitView = function () {
                    return this.$scope.form.$dirty;
                };
                EditInstrumentsCtrl.prototype.viewModeChange = function () {
                    this.editMode = !this.editMode;
                };
                EditInstrumentsCtrl.prototype.showDeleteModal = function (response) {
                    var _this = this;
                    var confirmation = 'Do you wish to remove this instrument ' + this.instrument.Name + '?';
                    this.deleteModalService.deleteConfirmation(confirmation)
                        .then(function (response) {
                        if (response === 'ok') {
                            _this.deleteInstrument();
                        }
                    });
                };
                EditInstrumentsCtrl.prototype.deleteInstrument = function () {
                    var _this = this;
                    var instrumentId = this.instrument.Id;
                    this.instrumentsService.deleteInstrument(instrumentId)
                        .then(function () {
                        var notification = 'Instrument was deleted.';
                        _this.deleteModalService.deleteCompleted(notification)
                            .then(function () {
                            return _this.$window.location.href = '/Instrument/';
                        });
                    });
                };
                EditInstrumentsCtrl.$inject = ['$scope', '$window', '$location', 'deleteModalService', 'instrumentsService'];
                return EditInstrumentsCtrl;
            }());
            App.getAppContainer()
                .getSection('app.instruments')
                .getInstance()
                .controller('EditInstrumentsCtrl', EditInstrumentsCtrl);
        })(Controllers = Instruments.Controllers || (Instruments.Controllers = {}));
    })(Instruments = App.Instruments || (App.Instruments = {}));
})(App || (App = {}));
//# sourceMappingURL=editInstrumentCtrl.js.map