namespace App.Dashboard.Directives {
    export interface IAttributes extends ng.IAttributes {
        ngEnter: string
    }

    class NgEnterDirective implements ng.IDirective {
        static instance(): ng.IDirective {
            return new NgEnterDirective();
        }

        restrict = 'A';
        link(scope: ng.IScope, element: ng.IAugmentedJQuery, attributes: IAttributes): void {
            element.bind("keydown keypress", event => {
                if (event.which === 13) {
                    scope.$apply(() => {
                        scope.$eval(attributes.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        }
    }
   
    App.getAppContainer()
        .getSection('common')
        .getInstance()
        .directive('ngEnter', NgEnterDirective.instance);
}