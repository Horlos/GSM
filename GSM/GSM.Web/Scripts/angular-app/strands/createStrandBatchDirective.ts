namespace App.Strands.Directives {

    interface IFormScope extends ng.IScope {
        form: ng.IFormController;
        model: any;
        isFormSubmitted: boolean;
        registerFormScope: (form, id) => void;
    }

    class CreateStrandBatchCtrl {
        public isDatePickerOpened: boolean;

        static $inject = ['$scope', '$timeout'];

        constructor(private $scope: IFormScope, private $timeout: ng.ITimeoutService) {
            this.isDatePickerOpened = false;
            this.$timeout(() => {
                this.$scope.registerFormScope(this.$scope.form, this.$scope.$id);
            });
        }

        selectDate() {
            this.onSelectDate();
        }

        onSelectDate() {
            this.isDatePickerOpened = !this.isDatePickerOpened;
        }
    }

    class CreateStrandBatchDirective implements ng.IDirective {
        static instance() {
            return new CreateStrandBatchDirective();
        }

        scope = {
            model: "=ngModel",
            registerFormScope: "=",
            isFormSubmitted: "="
        }
        templateUrl = "/Scripts/angular-app/strands/createStrandBatchForm.html";
        restrict = "E";
        require = ['ngModel'];
        controller = CreateStrandBatchCtrl;
        controllerAs = "vm";
    }

    App.getAppContainer()
        .getSection('app.strands')
        .getInstance()
        .directive('createBatchForm', CreateStrandBatchDirective.instance);
}