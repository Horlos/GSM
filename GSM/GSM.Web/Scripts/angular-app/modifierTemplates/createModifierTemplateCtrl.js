var App;
(function (App) {
    var ModifierTemplates;
    (function (ModifierTemplates) {
        var Controllers;
        (function (Controllers) {
            var CreateModifierTemplateCtrl = (function () {
                function CreateModifierTemplateCtrl($scope, $window, modifierTemplatesService, lookupService) {
                    this.$scope = $scope;
                    this.$window = $window;
                    this.modifierTemplatesService = modifierTemplatesService;
                    this.lookupService = lookupService;
                    this.initialize();
                    this.loadOrientations();
                }
                CreateModifierTemplateCtrl.prototype.initialize = function () {
                    var _this = this;
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
                CreateModifierTemplateCtrl.prototype.permitSubmit = function () {
                    var modifierTemplatePositions = this.modifierTemplate.ModifierTemplatePositions;
                    for (var i = 0; i < modifierTemplatePositions.length; i++) {
                        if (!modifierTemplatePositions[i].isValid)
                            return false;
                    }
                    return this.$scope.form.$valid && this.$scope.form.$dirty;
                };
                CreateModifierTemplateCtrl.prototype.submit = function () {
                    var _this = this;
                    if (this.permitSubmit()) {
                        this.modifierTemplatesService.createModifierTemplate(this.modifierTemplate)
                            .then(function (data) {
                            if (!data.HasErrors) {
                                _this.$window.location.href = '/ModifierTemplate/Edit/' + data.Id;
                            }
                            _this.modifierTemplate.Error = data.Errors;
                            _this.$scope.form.$setPristine();
                        });
                    }
                };
                CreateModifierTemplateCtrl.prototype.cancelChanges = function () {
                    this.$window.location.href = '/ModifierTemplate';
                };
                CreateModifierTemplateCtrl.prototype.displayPositionDecorator = function () {
                    if (this.modifierTemplate.Orientation.Name === 'Sense') {
                        return '\'';
                    }
                    return '';
                };
                CreateModifierTemplateCtrl.prototype.calculateDisplayPosition = function () {
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
                CreateModifierTemplateCtrl.prototype.validatePosition = function (position) {
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
                CreateModifierTemplateCtrl.prototype.addPosition = function (isAppend) {
                    if (isAppend) {
                        this.insertNewPosition(this.modifierTemplate.ModifierTemplatePositions.length + 1);
                    }
                    else {
                        this.insertNewPosition(1);
                    }
                    this.calculateDisplayPosition();
                    this.$scope.form.$setDirty();
                };
                CreateModifierTemplateCtrl.prototype.insertNewPosition = function (desiredPosition) {
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
                CreateModifierTemplateCtrl.prototype.loadOrientations = function () {
                    var _this = this;
                    this.lookupService.getTable('Orientations')
                        .then(function (data) {
                        _this.availableOrientations = data.Orientations;
                        _this.modifierTemplate.Orientation = _this.availableOrientations[0];
                        _this.calculateDisplayPosition();
                    });
                };
                CreateModifierTemplateCtrl.$inject = ['$scope', '$window', 'modifierTemplatesService', 'lookupService'];
                return CreateModifierTemplateCtrl;
            }());
            App.getAppContainer()
                .getSection('app.modifierTemplates')
                .getInstance()
                .controller('CreateModifierTemplateCtrl', CreateModifierTemplateCtrl);
        })(Controllers = ModifierTemplates.Controllers || (ModifierTemplates.Controllers = {}));
    })(ModifierTemplates = App.ModifierTemplates || (App.ModifierTemplates = {}));
})(App || (App = {}));
//# sourceMappingURL=createModifierTemplateCtrl.js.map