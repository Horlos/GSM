namespace App.Dashboard {
    var section = new Framework.AppSection('app.dashboard',
    [
        'ngResource',
        'angular.filter',
        'angularMoment',
        'common'
    ]);
    App.getAppContainer().addSection(section);
}