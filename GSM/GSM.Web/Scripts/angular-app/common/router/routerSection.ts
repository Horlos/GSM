namespace App.Common.Router {
    var section = new Framework.AppSection('common.router', [
        'ngRoute',
        'common.logger'
    ]);
    App.getAppContainer().addSection(section);
}