var App;
(function (App) {
    var ModifierTemplates;
    (function (ModifierTemplates) {
        var Controllers;
        (function (Controllers) {
            var EditModifierTemplateCtrl = (function () {
                function EditModifierTemplateCtrl($scope, $window, $location, modifierTemplatesService, lookupService, deleteModalService) {
                    this.$scope = $scope;
                    this.$window = $window;
                    this.$location = $location;
                    this.modifierTemplatesService = modifierTemplatesService;
                    this.lookupService = lookupService;
                    this.deleteModalService = deleteModalService;
                    var modifierTemplateId = +App.Common.Utils.lastUrlParam(this.$location.absUrl());
                    this.initialize();
                    this.loadOrientations();
                    this.loadModifierTemplate(modifierTemplateId);
                }
                EditModifierTemplateCtrl.prototype.initialize = function () {
                    var _this = this;
                    this.editMode = false;
                    this.modifierTemplate = {
                        Name: '',
                        Orientation: {
                            Name: ''
                        },
                        FirstPosition: 1,
                        ModifierTemplatePositions: [
                            {
                                ModifierTemplateId: null,
                                Position: 1,
                                Mod: '',
                                isValid: false
                            }
                        ],
                        Error: {}
                    };
                    this.availableOrientations = [];
                    this.selectedPosition = {};
                    this.menuOptions = [
                        [
                            'Set As First', function ($itemScope) {
                                _this.modifierTemplate.FirstPosition = $itemScope.position.Position;
                                _this.calculateDisplayPosition();
                            }, function ($itemScope) { return $itemScope.position != null; }
                        ],
                        [
                            'Insert', function ($itemScope) {
                                _this.insertNewPosition($itemScope.position.Position);
                            }, function ($itemScope) { return $itemScope.position != null; }
                        ],
                        [
                            'Delete', function ($itemScope) {
                                var currentPosition = $itemScope.position.Position;
                                _this.modifierTemplate.ModifierTemplatePositions =
                                    _this.modifierTemplate.ModifierTemplatePositions
                                        .filter(function (value) { return value.Position !== currentPosition; });
                                _this.modifierTemplate.ModifierTemplatePositions.forEach(function (item) {
                                    if (item.Position > currentPosition) {
                                        item.Position--;
                                    }
                                });
                                if (_this.modifierTemplate.FirstPosition >= currentPosition) {
                                    _this.modifierTemplate.FirstPosition--;
                                }
                                _this.calculateDisplayPosition();
                                _this.$scope.form.$setDirty();
                            }, function ($itemScope) {
                                return $itemScope.position != null &&
                                    _this.modifierTemplate.ModifierTemplatePositions.length > 1 &&
                                    _this.modifierTemplate.FirstPosition !== $itemScope.position.Position;
                            }
                        ]
                    ];
                };
                EditModifierTemplateCtrl.prototype.loadModifierTemplate = function (modifierTemplateId) {
                    var _this = this;
                    this.modifierTemplatesService.getModofierTemplate(modifierTemplateId)
                        .then(function (data) {
                        _this.modifierTemplate = data;
                        for (var i = 0; i < _this.modifierTemplate.ModifierTemplatePositions.length; i++) {
                            var position = _this.modifierTemplate.ModifierTemplatePositions[i];
                            position.isValid = true;
                        }
                        _this.calculateDisplayPosition();
                    });
                };
                EditModifierTemplateCtrl.prototype.permitSubmit = function () {
                    var modifierTemplatePositions = this.modifierTemplate.ModifierTemplatePositions;
                    for (var i = 0; i < modifierTemplatePositions.length; i++) {
                        if (!modifierTemplatePositions[i].isValid)
                            return false;
                    }
                    return this.$scope.form.$valid;
                };
                EditModifierTemplateCtrl.prototype.submit = function () {
                    var _this = this;
                    if (this.permitSubmit()) {
                        var modifierTemplateId = this.modifierTemplate.Id;
                        this.modifierTemplatesService.updateModifierTemplate(modifierTemplateId, this.modifierTemplate)
                            .then(function (data) {
                            if (!data.HasErrors) {
                                _this.$window.location.href = '/ModifierTemplate/Edit/' + data.Id;
                            }
                            _this.modifierTemplate.Error = data.Errors;
                            _this.$scope.form.$setPristine();
                        });
                    }
                };
                EditModifierTemplateCtrl.prototype.validatePosition = function (position) {
                    var mod = position.Mod;
                    if (mod) {
                        if (mod.toLowerCase().contains("x")) {
                            position.isValid = true;
                            return;
                        }
                    }
                    this.modifierTemplatesService.isModStructureValid(mod)
                        .then(function (data) {
                        position.isValid = data;
                    });
                };
                EditModifierTemplateCtrl.prototype.cancelChanges = function () {
                    var modifierTemplateId = this.modifierTemplate.Id;
                    this.loadModifierTemplate(modifierTemplateId);
                    this.$scope.form.$setPristine();
                    this.editMode = false;
                };
                EditModifierTemplateCtrl.prototype.displayPositionDecorator = function () {
                    if (this.modifierTemplate.Orientation.Name === 'Sense') {
                        return '\'';
                    }
                    return '';
                };
                EditModifierTemplateCtrl.prototype.calculateDisplayPosition = function () {
                    var _this = this;
                    this.modifierTemplate.ModifierTemplatePositions.sort(function (a, b) {
                        return a.Position - b.Position;
                    });
                    this.modifierTemplate.ModifierTemplatePositions.forEach(function (item) {
                        var temp = 0;
                        if (_this.modifierTemplate.Orientation.Name === 'Antisense') {
                            temp = item.Position - _this.modifierTemplate.FirstPosition;
                        }
                        else {
                            temp = _this.modifierTemplate.FirstPosition - item.Position;
                        }
                        if (temp > -1) {
                            temp++;
                        }
                        item.displayPosition = temp;
                    });
                };
                EditModifierTemplateCtrl.prototype.addPosition = function (isAppend) {
                    if (isAppend) {
                        this.insertNewPosition(this.modifierTemplate.ModifierTemplatePositions.length + 1);
                    }
                    else {
                        this.insertNewPosition(1);
                    }
                    this.calculateDisplayPosition();
                    this.$scope.form.$setDirty();
                };
                EditModifierTemplateCtrl.prototype.editPosition = function (templatePosition) {
                    if (this.editMode) {
                        this.selectedPosition = templatePosition;
                    }
                };
                EditModifierTemplateCtrl.prototype.insertNewPosition = function (desiredPosition) {
                    this.modifierTemplate.ModifierTemplatePositions.forEach(function (item) {
                        if (item.Position >= desiredPosition) {
                            item.Position++;
                        }
                    });
                    if (this.modifierTemplate.FirstPosition >= desiredPosition) {
                        this.modifierTemplate.FirstPosition++;
                    }
                    this.modifierTemplate.ModifierTemplatePositions.push({
                        ModifierTemplateId: this.modifierTemplate.Id,
                        Position: desiredPosition,
                        Mod: '',
                        isValid: false
                    });
                    this.calculateDisplayPosition();
                };
                EditModifierTemplateCtrl.prototype.loadOrientations = function () {
                    var _this = this;
                    this.lookupService.getTable('Orientations')
                        .then(function (data) {
                        _this.availableOrientations = data.Orientations;
                    });
                };
                EditModifierTemplateCtrl.prototype.pageMode = function () {
                    if (this.editMode) {
                        return "View";
                    }
                    else {
                        return "Edit";
                    }
                };
                EditModifierTemplateCtrl.prototype.permitView = function () {
                    return this.$scope.form.$dirty;
                };
                EditModifierTemplateCtrl.prototype.viewModeChange = function () {
                    this.editMode = !this.editMode;
                };
                EditModifierTemplateCtrl.prototype.showDeleteModal = function (response) {
                    var _this = this;
                    var confirmation = 'Do you wish to remove this modifier template ' + this.modifierTemplate.Name + '?';
                    this.deleteModalService.deleteConfirmation(confirmation)
                        .then(function (response) {
                        if (response === 'ok') {
                            _this.deleteModifierTemplate();
                        }
                    });
                };
                EditModifierTemplateCtrl.prototype.deleteModifierTemplate = function () {
                    var _this = this;
                    var modifierTemplateId = this.modifierTemplate.Id;
                    this.modifierTemplatesService.deleteModifierTemplate(modifierTemplateId)
                        .then(function () {
                        var notification = 'Modifier template' + _this.modifierTemplate.Name + ' was deleted.';
                        _this.deleteModalService.deleteCompleted(notification)
                            .then(function () {
                            return _this.$window.location.href = '/ModifierTemplate/';
                        });
                    });
                };
                EditModifierTemplateCtrl.$inject = ['$scope', '$window', '$location', 'modifierTemplatesService', 'lookupService', 'deleteModalService'];
                return EditModifierTemplateCtrl;
            }());
            App.getAppContainer()
                .getSection('app.modifierTemplates')
                .getInstance()
                .controller('EditModifierTemplateCtrl', EditModifierTemplateCtrl);
        })(Controllers = ModifierTemplates.Controllers || (ModifierTemplates.Controllers = {}));
    })(ModifierTemplates = App.ModifierTemplates || (App.ModifierTemplates = {}));
})(App || (App = {}));
//# sourceMappingURL=editModifierTemplateCtrl.js.map