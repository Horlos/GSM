namespace App.Layout.Controllers {
    class NavigationCtrl {
        static $inject = ['$location'];
        constructor(private $location: ng.ILocationService) {
        }

        isActive (viewLocation): boolean {
            return (viewLocation === this.$location.path());
        };
    }

    App.getAppContainer()
        .getSection('app')
        .getInstance()
        .controller('NavigationCtrl', NavigationCtrl);
}