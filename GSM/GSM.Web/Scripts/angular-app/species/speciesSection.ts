namespace App.Species {
    var section = new Framework.AppSection('app.species',
        [
            'ui.bootstrap.tooltip',
            'ui.grid.autoFitColumns',
            'common',
            'common.logger',
            'app.services',
            'app.widgets'
        ]);
    App.getAppContainer().addSection(section);
}