namespace App.Manage {
    let section = new Framework.AppSection('app.manage',
        [
            'ngResource',
            'ui.bootstrap',
            'common',
            'common.logger',
            'app.widgets'
        ]);
    App.getAppContainer().addSection(section);
}
