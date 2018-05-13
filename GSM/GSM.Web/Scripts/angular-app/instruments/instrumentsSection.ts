namespace App.Instruments {
    var section = new Framework.AppSection('app.instruments',
        [
            'common',
            'common.logger',
            'app.services',
            'app.widgets',
            'ui.grid.autoFitColumns'
        ]);
    App.getAppContainer().addSection(section);
}