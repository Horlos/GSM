namespace App.Targets {
    var section = new Framework.AppSection("app.targets",
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