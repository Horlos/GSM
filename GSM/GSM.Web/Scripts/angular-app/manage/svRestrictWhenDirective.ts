namespace App.Manage.Directives {
    interface IAttributes extends ng.IAttributes {
        svRestrictWhen: string;
        ngModel; any;
    }

    interface ISvRestrictWhenScope extends ng.IScope {
        isRestricted: boolean;
    }

    class SvRestrictWhenDirective implements ng.IDirective {
        static instance(): ng.IDirective {
            return new SvRestrictWhenDirective();
        }

        restrict = 'A';

        link(scope: ISvRestrictWhenScope, element: ng.IAugmentedJQuery, attributes: IAttributes): void {
            var fnrestrict = scope.$parent.$eval(attributes.svRestrictWhen);
            scope.isRestricted = true;
            scope.$parent.$watch(attributes.ngModel,
                (a) => {
                    element.attr('disabled', fnrestrict(a));
                });
        }
    }

    App.getAppContainer()
        .getSection('app.manage')
        .getInstance()
        .directive('svRestrictWhen', SvRestrictWhenDirective.instance);
}