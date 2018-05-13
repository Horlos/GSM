namespace App.Duplexes {
    let section = new Framework.AppSection('app.duplexes',
    [
        'ngResource',
        'ngFileUpload',
        'LocalStorageModule',
        'ui.router',
        'ui.bootstrap.contextMenu',
        'ui.bootstrap',
        'ui.grid',
        'ui.grid.pagination',
        'ui.grid.resizeColumns',
        'ui.grid.selection',
        'ui.grid.autoFitColumns',
        //'ui.grid.pinning',
        //'ui.grid.expandable',
        //'ui.grid.autoResize',
        //'ui.grid.grouping',
        'common',
        'common.logger',
        'app.services',
        'app.widgets'
    ]);
    App.getAppContainer().addSection(section);
}