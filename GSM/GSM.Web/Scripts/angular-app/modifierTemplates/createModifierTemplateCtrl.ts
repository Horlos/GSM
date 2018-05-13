namespace App.ModifierTemplates.Controllers {

    interface ICreateModifierTemplateScope extends ng.IScope {
        form: ng.IFormController;
    }

    class CreateModifierTemplateCtrl {
        public modifierTemplate: any;
        public availableOrientations: Array<any>;
        public menuOptions: any;

        static $inject = ['$scope', '$window', 'modifierTemplatesService', 'lookupService'];
        constructor(
            private $scope: ICreateModifierTemplateScope,
            private $window: ng.IWindowService,
            private modifierTemplatesService: App.ModifierTemplates.Services.IModifierTemplatesService,
            private lookupService: App.Services.ILookupService) {
            this.initialize();
            this.loadOrientations();
        }

        initialize(): void {
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
                    'Set As First', ($itemScope) => {
                        this.modifierTemplate.FirstPosition = $itemScope.position.Position;
                        this.calculateDisplayPosition();
                    }, ($itemScope) => { return $itemScope.position != null }
                ],
                [
                    'Insert', ($itemScope) => {
                        this.insertNewPosition($itemScope.position.Position);
                    }, $itemScope => { return $itemScope.position != null }
                ],
                [
                    'Delete', ($itemScope) => {
                        var currentPosition = $itemScope.position.Position;
                        this.modifierTemplate.ModifierTemplatePositions =
                            this.modifierTemplate.ModifierTemplatePositions
                            .filter((value) => { return value.Position !== currentPosition });
                        this.modifierTemplate.ModifierTemplatePositions.forEach((item) => {
                            if (item.Position > currentPosition) {
                                item.Position--;
                            }
                        });
                        if (this.modifierTemplate.FirstPosition >= currentPosition) {
                            this.modifierTemplate.FirstPosition--;
                        }
                        this.calculateDisplayPosition();
                        this.$scope.form.$setDirty();
                    }, ($itemScope) => {
                        return $itemScope.position != null &&
                            this.modifierTemplate.ModifierTemplatePositions.length > 1 &&
                            this.modifierTemplate.FirstPosition !== $itemScope.position.Position;
                    }
                ]
            ];
        }

        permitSubmit(): boolean {
            let modifierTemplatePositions = this.modifierTemplate.ModifierTemplatePositions;
            for (let i = 0; i< modifierTemplatePositions.length; i++) {
                if (!modifierTemplatePositions[i].isValid)
                        return false;
            }

            return this.$scope.form.$valid && this.$scope.form.$dirty;
        }

        submit(): void {
            if (this.permitSubmit()) {
                this.modifierTemplatesService.createModifierTemplate(this.modifierTemplate)
                    .then((data) => {
                        if (!data.HasErrors) {
                            this.$window.location.href = '/ModifierTemplate/Edit/' + data.Id;
                        }
                        this.modifierTemplate.Error = data.Errors;
                        this.$scope.form.$setPristine();
                    });
            }
        }

        cancelChanges(): void {
            this.$window.location.href = '/ModifierTemplate';
        }

        displayPositionDecorator(): string {
            if (this.modifierTemplate.Orientation.Name === 'Sense') {
                return '\'';
            }
            return '';
        }

        calculateDisplayPosition(): void {
            this.modifierTemplate.ModifierTemplatePositions.sort((a, b) => {
                return a.Position - b.Position;
            });
            this.modifierTemplate.ModifierTemplatePositions.forEach((item) => {
                var temp = 0;
                if (this.modifierTemplate.Orientation.Name === 'Antisense') {
                    temp = item.Position - this.modifierTemplate.FirstPosition;
                } else {
                    temp = this.modifierTemplate.FirstPosition - item.Position;
                }
                if (temp > -1) {
                    temp++;
                }
                item.displayPosition = temp;
            });
        }

        validatePosition(position): void {
            let mod = position.Mod;
            if (mod) {
                if (mod.toLowerCase().contains("x")) {
                    position.isValid = true;
                    return;
                }
            }

            this.modifierTemplatesService.isModStructureValid(mod)
                .then((data) => {
                    position.isValid = data;
                });
        }

        addPosition(isAppend) {
            if (isAppend) {
                this.insertNewPosition(this.modifierTemplate.ModifierTemplatePositions.length + 1);
            } else {
                this.insertNewPosition(1);
            }
            this.calculateDisplayPosition();
            this.$scope.form.$setDirty();
        }

        insertNewPosition(desiredPosition): void {
            this.modifierTemplate.ModifierTemplatePositions.forEach((item) => {
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
        }

        loadOrientations(): void {
            this.lookupService.getTable('Orientations')
                .then((data) => {
                    this.availableOrientations = data.Orientations;
                    this.modifierTemplate.Orientation = this.availableOrientations[0];
                    this.calculateDisplayPosition();
                });
        }
    }

    App.getAppContainer()
        .getSection('app.modifierTemplates')
        .getInstance()
        .controller('CreateModifierTemplateCtrl', CreateModifierTemplateCtrl);
}