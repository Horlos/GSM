namespace App.ModifierTemplates.Controllers {

    interface IEditModifierTemplateScope extends ng.IScope {
        form: ng.IFormController;
    }

    class EditModifierTemplateCtrl {
        public modifierTemplate: any;
        public availableOrientations: Array<any>;
        public menuOptions: any;
        public editMode: boolean;
        public selectedPosition: any;

        static $inject = ['$scope', '$window', '$location', 'modifierTemplatesService', 'lookupService', 'deleteModalService'];
        constructor(
            private $scope: IEditModifierTemplateScope,
            private $window: ng.IWindowService,
            private $location: ng.ILocationService,
            private modifierTemplatesService: App.ModifierTemplates.Services.IModifierTemplatesService,
            private lookupService: App.Services.ILookupService,
            private deleteModalService: App.Widgets.IDeleteModalService) {
            let modifierTemplateId = +App.Common.Utils.lastUrlParam(this.$location.absUrl());
            this.initialize();
            this.loadOrientations();
            this.loadModifierTemplate(modifierTemplateId);
        }

        initialize(): void {
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
                    'Set As First', ($itemScope) => {
                        this.modifierTemplate.FirstPosition = $itemScope.position.Position;
                        this.calculateDisplayPosition();
                    }, ($itemScope) => { return $itemScope.position != null}
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

        loadModifierTemplate(modifierTemplateId): void {
            this.modifierTemplatesService.getModofierTemplate(modifierTemplateId)
                .then((data) => {
                    this.modifierTemplate = data;
                    for (let i = 0; i < this.modifierTemplate.ModifierTemplatePositions.length; i++) {
                        let position = this.modifierTemplate.ModifierTemplatePositions[i];
                        position.isValid = true;
                    }
                    this.calculateDisplayPosition();
                });
        }

        permitSubmit(): boolean {
            let modifierTemplatePositions = this.modifierTemplate.ModifierTemplatePositions;
            for (let i = 0; i < modifierTemplatePositions.length; i++) {
                if (!modifierTemplatePositions[i].isValid)
                    return false;
            }

            return this.$scope.form.$valid;
        }

        submit(): void {
            if (this.permitSubmit()) {
                let modifierTemplateId = this.modifierTemplate.Id;
                this.modifierTemplatesService.updateModifierTemplate(modifierTemplateId, this.modifierTemplate)
                    .then((data) => {
                        if (!data.HasErrors) {
                            this.$window.location.href = '/ModifierTemplate/Edit/' + data.Id;
                        }
                        this.modifierTemplate.Error = data.Errors;
                        this.$scope.form.$setPristine();
                    });
            }
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

        cancelChanges(): void {
            let modifierTemplateId = this.modifierTemplate.Id;
            this.loadModifierTemplate(modifierTemplateId);
            this.$scope.form.$setPristine();
            this.editMode = false;
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

        addPosition(isAppend) {
            if (isAppend) {
                this.insertNewPosition(this.modifierTemplate.ModifierTemplatePositions.length + 1);
            } else {
                this.insertNewPosition(1);
            }
            this.calculateDisplayPosition();
            this.$scope.form.$setDirty();
        }

        editPosition(templatePosition) {
            if (this.editMode) {
                this.selectedPosition = templatePosition;
            }
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
                });
        }

        pageMode() {
            if (this.editMode) {
                return "View";
            } else {
                return "Edit";
            }
        }

        permitView(): boolean {
            return this.$scope.form.$dirty;
        }

        viewModeChange(): void {
            this.editMode = !this.editMode;
        }

        showDeleteModal(response): void {
            let confirmation = 'Do you wish to remove this modifier template ' + this.modifierTemplate.Name + '?';
            this.deleteModalService.deleteConfirmation(confirmation)
                .then((response) => {
                    if (response === 'ok') {
                        this.deleteModifierTemplate();
                    }
                });
        }

        deleteModifierTemplate() {
            let modifierTemplateId = this.modifierTemplate.Id;
            this.modifierTemplatesService.deleteModifierTemplate(modifierTemplateId)
                .then(() => {
                    let notification = 'Modifier template' + this.modifierTemplate.Name + ' was deleted.';
                    this.deleteModalService.deleteCompleted(notification)
                        .then(() =>
                            this.$window.location.href = '/ModifierTemplate/');
                });
        }
    }

    App.getAppContainer()
        .getSection('app.modifierTemplates')
        .getInstance()
        .controller('EditModifierTemplateCtrl', EditModifierTemplateCtrl);
}